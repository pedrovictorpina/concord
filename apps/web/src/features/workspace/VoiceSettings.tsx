import { useEffect, useRef, useState } from 'react'
import { Toggle } from '../../components/ui/Toggle'
import { audioCaptureOptions, voiceIsolationSupported } from './voice-preferences'
import type { VoiceProcessing } from './voice-preferences'

type VoiceSettingsProps = {
  onChange: (value: VoiceProcessing) => void
  value: VoiceProcessing
}

export function VoiceSettings({ onChange, value }: VoiceSettingsProps) {
  const [testing, setTesting] = useState(false)
  const [level, setLevel] = useState(0)
  const [error, setError] = useState('')
  const streamRef = useRef<MediaStream | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const frameRef = useRef(0)
  const isolationSupported = voiceIsolationSupported()

  const stopTest = () => {
    window.cancelAnimationFrame(frameRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    void contextRef.current?.close()
    contextRef.current = null
    setTesting(false)
    setLevel(0)
  }

  useEffect(() => stopTest, [])

  const startTest = async () => {
    setError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Este navegador não libera o microfone nesta página.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioCaptureOptions(value) })
      streamRef.current = stream
      const context = new AudioContext()
      contextRef.current = context
      const analyser = context.createAnalyser()
      analyser.fftSize = 1024
      context.createMediaStreamSource(stream).connect(analyser)
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

  const update = (patch: Partial<VoiceProcessing>) => {
    const next = { ...value, ...patch }
    onChange(next)
    if (testing) {
      stopTest()
      void startTest()
    }
  }

  return (
    <section>
      <h3>Voz e microfone</h3>
      <p>O tratamento é o do próprio navegador e vale para toda chamada, inclusive as próximas.</p>
      <Toggle
        checked={value.noiseSuppression}
        className="settings-toggle"
        description="Reduz ruído constante, como ventilador, teclado e ar-condicionado. Volta ligada sempre que você abre o Concord."
        label="Supressão de ruído"
        onChange={(checked) => update({ noiseSuppression: checked })}
      />
      <Toggle
        checked={value.echoCancellation}
        className="settings-toggle"
        description="Evita que o som das caixas volte pelo microfone."
        label="Cancelamento de eco"
        onChange={(checked) => update({ echoCancellation: checked })}
      />
      <Toggle
        checked={value.autoGainControl}
        className="settings-toggle"
        description="Equilibra o volume quando você fala mais perto ou mais longe."
        label="Ganho automático"
        onChange={(checked) => update({ autoGainControl: checked })}
      />
      <Toggle
        checked={value.voiceIsolation}
        className="settings-toggle"
        description={isolationSupported ? 'Filtro mais agressivo: mantém a voz e corta o resto.' : 'Seu navegador ainda não oferece este filtro.'}
        disabled={!isolationSupported}
        label="Isolamento de voz"
        onChange={(checked) => update({ voiceIsolation: checked })}
      />

      <h4 className="settings-subtitle">Testar microfone</h4>
      <div className="mic-test">
        <button className="dialog-submit subdued" type="button" onClick={() => testing ? stopTest() : void startTest()}>
          {testing ? 'PARAR TESTE' : 'TESTAR MICROFONE'}
        </button>
        <div aria-hidden="true" className="mic-test-meter"><span style={{ transform: `scaleX(${level})` }} /></div>
      </div>
      <p className="mic-test-hint">{testing ? 'Fale ou faça barulho: a barra acompanha o que o microfone captura depois do tratamento.' : 'O teste usa as mesmas opções da chamada.'}</p>
      {error ? <p className="dialog-feedback" role="status">{error}</p> : null}
    </section>
  )
}
