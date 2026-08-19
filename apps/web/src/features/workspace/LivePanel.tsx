import { useEffect, useRef, useState } from 'react'
import type { ChannelSummary, VoicePreferences } from '@concord/contracts'
import { useLiveRoom } from './useLiveRoom'
import { useScreenShare } from './useScreenShare'
import { screenShareQualities } from './screen-quality'
import type { ScreenShareQuality } from './screen-quality'

type LivePanelProps = {
  demoMode: boolean
  voiceChannel: ChannelSummary | null
}

export function LivePanel({ demoMode, voiceChannel }: LivePanelProps) {
  const demoShare = useScreenShare()
  const liveRoom = useLiveRoom(voiceChannel?.id ?? null)
  const [preferences, setPreferences] = useState<VoicePreferences>({ microphoneEnabled: true, outputEnabled: true, screenShareEnabled: false })
  const [qualityPickerOpen, setQualityPickerOpen] = useState(false)
  const [quality, setQuality] = useState<ScreenShareQuality>('automatic')
  const videoRef = useRef<HTMLVideoElement>(null)
  const sharing = demoMode ? Boolean(demoShare.stream) : Boolean(liveRoom.screenTrack)
  const error = demoMode ? demoShare.error : liveRoom.error

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (demoMode) {
      video.srcObject = demoShare.stream
      return
    }
    if (!liveRoom.screenTrack) {
      video.srcObject = null
      return
    }
    liveRoom.screenTrack.attach(video)
    return () => {
      liveRoom.screenTrack?.detach(video)
    }
  }, [demoMode, demoShare.stream, liveRoom.screenTrack])

  useEffect(() => setPreferences((current) => ({ ...current, screenShareEnabled: sharing })), [sharing])

  const toggleDemoPreference = (key: 'microphoneEnabled' | 'outputEnabled') => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
  }

  const startScreenShare = (nextQuality: ScreenShareQuality) => {
    setQuality(nextQuality)
    setQualityPickerOpen(false)
    return demoMode ? demoShare.start(nextQuality) : liveRoom.startScreenShare(nextQuality)
  }

  return (
    <aside className="live-panel">
      <header><div><span className="live-pulse" /> {liveRoom.connected || demoMode ? 'AO VIVO' : 'FORA DO CANAL'}</div><small>{voiceChannel?.name?.toUpperCase() ?? 'SEM CANAL'}</small></header>
      <div className={sharing ? 'screen-stage sharing' : 'screen-stage'}>
        {sharing ? <video ref={videoRef} autoPlay muted={demoMode} playsInline /> : <div className="screen-placeholder"><span className="screen-icon"><i /><i /></span><strong>Sua transmissao</strong><p>{voiceChannel ? 'Compartilhe uma janela ou tela inteira com o canal.' : 'Escolha um canal de voz para iniciar.'}</p></div>}
        {sharing ? <span className="capture-label">{demoMode ? 'CAPTURA LOCAL' : 'VIA LIVEKIT'}</span> : null}
      </div>
      {error ? <p className="share-error" role="status">{error}</p> : null}
      {!demoMode && !liveRoom.connected ? (
        <button className="share-button" disabled={!voiceChannel} type="button" onClick={() => void liveRoom.join()}><span>◖</span>Entrar no canal</button>
      ) : (
        <div className="live-actions">
          <button className={sharing ? 'share-button stop' : 'share-button'} disabled={!voiceChannel} type="button" onClick={() => sharing ? void (demoMode ? demoShare.stop() : liveRoom.stopScreenShare()) : setQualityPickerOpen(true)}><span>{sharing ? '■' : '▣'}</span>{sharing ? 'Encerrar transmissao' : 'Compartilhar tela'}</button>
          {!demoMode ? <button className="leave-voice" type="button" onClick={liveRoom.disconnect}>Sair do canal</button> : null}
        </div>
      )}
      {qualityPickerOpen ? (
        <section className="quality-picker" role="dialog" aria-label="Qualidade da transmissao">
          <header><strong>QUALIDADE DA TELA</strong><button aria-label="Fechar seletor de qualidade" type="button" onClick={() => setQualityPickerOpen(false)}>×</button></header>
          <p>Escolha como quer transmitir antes de selecionar a tela.</p>
          <div>{(Object.keys(screenShareQualities) as ScreenShareQuality[]).map((option) => (
            <button className={quality === option ? 'active' : ''} key={option} type="button" onClick={() => void startScreenShare(option)}><strong>{screenShareQualities[option].label}</strong><small>{screenShareQualities[option].detail}</small></button>
          ))}</div>
        </section>
      ) : null}
      <section className="quality-panel">
        <div><span>QUALIDADE</span><strong>{screenShareQualities[quality].label.toUpperCase()}</strong></div>
        <div><span>ROTA DE MIDIA</span><strong className={demoMode ? 'pending' : ''}>{demoMode ? 'LOCAL / PROVA' : 'LIVEKIT CLOUD'}</strong></div>
        <div><span>CRIPTOGRAFIA</span><strong>{demoMode ? 'PENDENTE' : 'WEBRTC / DTLS'}</strong></div>
      </section>
      <footer className="voice-controls">
        <button className={demoMode ? (preferences.microphoneEnabled ? '' : 'disabled') : (liveRoom.microphoneEnabled ? '' : 'disabled')} disabled={!demoMode && !voiceChannel} type="button" onClick={() => demoMode ? toggleDemoPreference('microphoneEnabled') : void liveRoom.toggleMicrophone()}><span>{demoMode ? (preferences.microphoneEnabled ? '⌁' : '×') : (liveRoom.microphoneEnabled ? '⌁' : '×')}</span>{demoMode ? (preferences.microphoneEnabled ? 'MIC ATIVO' : 'MIC MUDO') : (liveRoom.microphoneEnabled ? 'MIC ATIVO' : 'LIGAR MIC')}</button>
        <button className={demoMode ? (preferences.outputEnabled ? '' : 'disabled') : (liveRoom.outputEnabled ? '' : 'disabled')} disabled={!demoMode && !liveRoom.connected} type="button" onClick={() => demoMode ? toggleDemoPreference('outputEnabled') : liveRoom.toggleOutput()}><span>{demoMode ? (preferences.outputEnabled ? '◖' : '×') : (liveRoom.outputEnabled ? '◖' : '×')}</span>{demoMode ? (preferences.outputEnabled ? 'AUDIO ATIVO' : 'SEM AUDIO') : (liveRoom.outputEnabled ? 'AUDIO ATIVO' : 'AUDIO MUDO')}</button>
      </footer>
    </aside>
  )
}
