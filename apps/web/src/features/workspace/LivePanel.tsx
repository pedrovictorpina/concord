import { useEffect, useRef, useState } from 'react'
import type { VoicePreferences } from '@darkcord/contracts'
import { useScreenShare } from './useScreenShare'

export function LivePanel() {
  const { error, start, stop, stream } = useScreenShare()
  const [preferences, setPreferences] = useState<VoicePreferences>({
    microphoneEnabled: true,
    outputEnabled: true,
    screenShareEnabled: false,
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream
    setPreferences((current) => ({ ...current, screenShareEnabled: Boolean(stream) }))
  }, [stream])

  const togglePreference = (key: 'microphoneEnabled' | 'outputEnabled') => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <aside className="live-panel">
      <header><div><span className="live-pulse" /> AO VIVO</div><small>CANAL 03</small></header>
      <div className={stream ? 'screen-stage sharing' : 'screen-stage'}>
        {stream ? <video ref={videoRef} autoPlay muted playsInline /> : (
          <div className="screen-placeholder"><span className="screen-icon"><i /><i /></span><strong>Sua transmissao</strong><p>Compartilhe uma janela ou tela inteira com o canal.</p></div>
        )}
        {stream ? <span className="capture-label">CAPTURA LOCAL</span> : null}
      </div>
      {error ? <p className="share-error" role="status">{error}</p> : null}
      <button className={stream ? 'share-button stop' : 'share-button'} type="button" onClick={stream ? stop : start}>
        <span>{stream ? '■' : '▣'}</span>{stream ? 'Encerrar transmissao' : 'Compartilhar tela'}
      </button>
      <section className="quality-panel">
        <div><span>QUALIDADE</span><strong>720P · 15 ECO</strong></div>
        <div><span>ROTA DE MIDIA</span><strong className="pending">LOCAL / PROVA</strong></div>
        <div><span>CRIPTOGRAFIA</span><strong>PENDENTE</strong></div>
      </section>
      <footer className="voice-controls">
        <button className={preferences.microphoneEnabled ? '' : 'disabled'} type="button" onClick={() => togglePreference('microphoneEnabled')}>
          <span>{preferences.microphoneEnabled ? '⌁' : '×'}</span>{preferences.microphoneEnabled ? 'MIC ATIVO' : 'MIC MUDO'}
        </button>
        <button className={preferences.outputEnabled ? '' : 'disabled'} type="button" onClick={() => togglePreference('outputEnabled')}>
          <span>{preferences.outputEnabled ? '◖' : '×'}</span>{preferences.outputEnabled ? 'AUDIO ATIVO' : 'SEM AUDIO'}
        </button>
      </footer>
    </aside>
  )
}
