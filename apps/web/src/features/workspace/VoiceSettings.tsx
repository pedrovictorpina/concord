import { useEffect, useRef, useState } from 'react'
import { Toggle } from '../../components/ui/Toggle'
import { rnnoiseSupported } from './audio/rnnoise-support'
import type { RnnoiseGraph } from './audio/rnnoise-graph'
import { audioCaptureOptions, outputDeviceSupported, profilePreset, withNoiseSuppressionMode } from './voice-preferences'
import type { NoiseSuppressionMode, VoiceProcessing, VoiceProfile } from './voice-preferences'

type VoiceSettingsProps = {
  onChange: (value: VoiceProcessing) => void
  value: VoiceProcessing
}

const profiles: ReadonlyArray<readonly [VoiceProfile, string, string]> = [
  ['voice', 'Voz', 'Só a sua voz: o navegador equaliza e corta o resto.'],
  ['studio', 'Estúdio', 'Áudio puro: microfone aberto e sem processamento.'],
  ['custom', 'Personalizado', 'Modo avançado: cada filtro no controle separado.'],
]

const modes: ReadonlyArray<readonly [NoiseSuppressionMode, string]> = [
  ['off', 'Desativada'],
  ['webrtc', 'Padrão (navegador)'],
  ['rnnoise', 'Aprimorada (Beta)'],
]

export function VoiceSettings({ onChange, value }: VoiceSettingsProps) {
  const [testing, setTesting] = useState(false)
  const [level, setLevel] = useState(0)
  const [error, setError] = useState('')
  const [inputs, setInputs] = useState<MediaDeviceInfo[]>([])
  const [outputs, setOutputs] = useState<MediaDeviceInfo[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const rnnoiseGraphRef = useRef<RnnoiseGraph | null>(null)
  const frameRef = useRef(0)
  const rnnoiseAvailable = rnnoiseSupported()
  const sinkSupported = outputDeviceSupported()

  const stopTest = () => {
    window.cancelAnimationFrame(frameRef.current)
    rnnoiseGraphRef.current?.destroy()
    rnnoiseGraphRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    void contextRef.current?.close()
    contextRef.current = null
    setTesting(false)
    setLevel(0)
  }

  useEffect(() => stopTest, [])

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) return
    let active = true
    const load = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices()
      if (!active) return
      setInputs(devices.filter((device) => device.kind === 'audioinput'))
      setOutputs(devices.filter((device) => device.kind === 'audiooutput'))
    }
    void load()
    navigator.mediaDevices.addEventListener?.('devicechange', load)
    return () => {
      active = false
      navigator.mediaDevices.removeEventListener?.('devicechange', load)
    }
  }, [])

  const startTest = async () => {
    setError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Este navegador não libera o microfone nesta página.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioCaptureOptions(value) as MediaTrackConstraints })
      streamRef.current = stream
      const context = new AudioContext()
      contextRef.current = context
      const analyser = context.createAnalyser()
      analyser.fftSize = 1024

      let analyserSource: AudioNode
      if (value.noiseSuppressionMode === 'rnnoise' && rnnoiseAvailable) {
        try {
          const { createRnnoiseGraph } = await import('./audio/rnnoise-graph')
          const [inputTrack] = stream.getAudioTracks()
          const graph = await createRnnoiseGraph(context, inputTrack)
          rnnoiseGraphRef.current = graph
          analyserSource = context.createMediaStreamSource(new MediaStream([graph.outputTrack]))
        } catch (caught) {
          console.error('[voz] falha ao testar com a supressao aprimorada', caught)
          setError('Não foi possível usar a supressão aprimorada no teste. Mostrando o áudio sem esse processamento.')
          analyserSource = context.createMediaStreamSource(stream)
        }
      } else {
        analyserSource = context.createMediaStreamSource(stream)
      }
      analyserSource.connect(analyser)
      const samples = new Uint8Array(analyser.frequencyBinCount)
      setTesting(true)
      const tick = () => {
        analyser.getByteTimeDomainData(samples)
        let peak = 0
        for (const sample of samples) peak = Math.max(peak, Math.abs(sample - 128))
        setLevel(Math.min(1, peak / 90))
        frameRef.current = window.requestAnimationFrame(tick)
      }
      tick()
    } catch (caught) {
      console.error('[voz] falha ao testar o microfone', caught)
      setError('Permissão de microfone negada ou dispositivo indisponível.')
    }
  }

  const update = (next: VoiceProcessing) => {
    onChange(next)
    if (testing) {
      stopTest()
      void startTest()
    }
  }

  const patch = (changes: Partial<VoiceProcessing>) => update({ ...value, ...changes })

  return (
    <section className="voice-settings">
      <h1>Voz e áudio</h1>
      <p>O tratamento é o do próprio navegador e vale para toda chamada, inclusive as próximas.</p>

      <div className="settings-card">
        <h2>Dispositivos</h2>
        <div className="voice-device-grid">
          <label>
            <span>Microfone</span>
            <select value={value.inputDeviceId} onChange={(event) => patch({ inputDeviceId: event.target.value })}>
              <option value="">Padrão do sistema</option>
              {inputs.map((device) => <option key={device.deviceId} value={device.deviceId}>{device.label || 'Microfone sem nome'}</option>)}
            </select>
          </label>
          <label>
            <span>Saída</span>
            <select disabled={!sinkSupported} value={value.outputDeviceId} onChange={(event) => patch({ outputDeviceId: event.target.value })}>
              <option value="">Padrão do sistema</option>
              {outputs.map((device) => <option key={device.deviceId} value={device.deviceId}>{device.label || 'Saída sem nome'}</option>)}
            </select>
          </label>
        </div>
        {!sinkSupported ? <p className="mic-test-hint">Este navegador não deixa escolher a saída de áudio: use o padrão do sistema.</p> : null}

        <label className="voice-output-volume">
          <span>Volume da chamada · {Math.round(value.outputVolume * 100)}%</span>
          <input max={1} min={0} step={0.02} type="range" value={value.outputVolume} onChange={(event) => patch({ outputVolume: Number(event.target.value) })} />
        </label>
      </div>

      <div className="settings-card">
        <h2>Processamento</h2>
        <h3 className="settings-subtitle">Perfil de entrada</h3>
        <div className="voice-profile-list" role="radiogroup" aria-label="Perfil de entrada">
          {profiles.map(([id, label, detail]) => (
            <button
              aria-checked={value.profile === id}
              className={value.profile === id ? 'voice-profile active' : 'voice-profile'}
              key={id}
              role="radio"
              type="button"
              onClick={() => update(profilePreset(id, value))}
            >
              <strong>{label}{id === 'voice' ? <em>Recomendado</em> : null}</strong>
              <small>{detail}</small>
            </button>
          ))}
        </div>

        <h3 className="settings-subtitle">Supressão de ruído</h3>
        <label className="voice-suppression">
          <span>Supressão de ruído</span>
          <select
            disabled={value.profile !== 'custom'}
            value={value.noiseSuppressionMode}
            onChange={(event) => update(withNoiseSuppressionMode(value, event.target.value as NoiseSuppressionMode))}
          >
            {modes.map(([id, label]) => (
              <option disabled={id === 'rnnoise' && !rnnoiseAvailable} key={id} value={id}>
                {id === 'rnnoise' && !rnnoiseAvailable ? `${label} — indisponível neste navegador` : label}
              </option>
            ))}
          </select>
        </label>
        <p className="mic-test-hint">
          {value.profile === 'custom'
            ? 'Padrão usa o processamento do navegador. Aprimorada roda RNNoise localmente e usa mais CPU.'
            : 'Escolha o perfil Personalizado para mudar o modo de supressão.'}
        </p>

        {value.profile === 'custom' ? (
          <>
            <Toggle
              checked={value.echoCancellation}
              className="settings-toggle"
              description="Evita que o som das caixas volte pelo microfone."
              label="Cancelamento de eco"
              onChange={(checked) => patch({ echoCancellation: checked })}
            />
            <Toggle
              checked={value.autoGainControl}
              className="settings-toggle"
              description="Equilibra o volume quando você fala mais perto ou mais longe."
              label="Ganho automático"
              onChange={(checked) => patch({ autoGainControl: checked })}
            />
          </>
        ) : null}
      </div>

      <div className="settings-card">
        <h2>Testar microfone</h2>
        <div className="mic-test">
          <button className="settings-button subdued" type="button" onClick={() => testing ? stopTest() : void startTest()}>
            {testing ? 'Parar teste' : 'Testar microfone'}
          </button>
          <div aria-hidden="true" className="mic-test-meter"><span style={{ transform: `scaleX(${level})` }} /></div>
        </div>
        <p className="mic-test-hint">{testing ? 'Testando seu microfone... fale ou faça barulho: a barra acompanha o que o microfone captura depois do tratamento.' : 'O teste usa o mesmo microfone e os mesmos filtros da chamada.'}</p>
        {error ? <p className="settings-feedback" role="status">{error}</p> : null}
      </div>
    </section>
  )
}
