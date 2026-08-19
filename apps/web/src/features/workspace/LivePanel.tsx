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
  const [demoJoined, setDemoJoined] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sharing = demoMode ? Boolean(demoShare.stream) : Boolean(liveRoom.screenTrack)
  const error = demoMode ? demoShare.error : liveRoom.error
  const joined = demoMode ? demoJoined : liveRoom.connected

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

  if (!voiceChannel) return null

  return (
    <aside className={joined ? 'voice-dock joined' : 'voice-dock'}>
      {joined && sharing ? <div className="voice-preview"><video ref={videoRef} autoPlay muted={demoMode} playsInline /><span className="capture-label">TRANSMITINDO</span></div> : null}
      {error ? <p className="share-error" role="status">{error}</p> : null}
      {!joined ? (
        <button className="voice-join" disabled={!voiceChannel} type="button" onClick={() => demoMode ? setDemoJoined(true) : void liveRoom.join()}><span>◖</span>{voiceChannel ? `Entrar em ${voiceChannel.name}` : 'Escolha um canal de voz'}</button>
      ) : (
        <><div className="voice-dock-status"><span className="live-pulse" /> <strong>{voiceChannel?.name ?? 'Voz'}</strong><small>{demoMode ? 'REDE LOCAL · 28 ms' : 'REDE ESTÁVEL · WEBRTC'}</small></div>
        <footer className="voice-controls">
          <button className={demoMode ? (preferences.microphoneEnabled ? '' : 'disabled') : (liveRoom.microphoneEnabled ? '' : 'disabled')} type="button" onClick={() => demoMode ? toggleDemoPreference('microphoneEnabled') : void liveRoom.toggleMicrophone()}><span>{demoMode ? (preferences.microphoneEnabled ? '⌁' : '×') : (liveRoom.microphoneEnabled ? '⌁' : '×')}</span>MIC</button>
          <button className={demoMode ? (preferences.outputEnabled ? '' : 'disabled') : (liveRoom.outputEnabled ? '' : 'disabled')} type="button" onClick={() => demoMode ? toggleDemoPreference('outputEnabled') : liveRoom.toggleOutput()}><span>{demoMode ? (preferences.outputEnabled ? '◖' : '×') : (liveRoom.outputEnabled ? '◖' : '×')}</span>ÁUDIO</button>
          <button className={sharing ? 'disabled' : ''} type="button" onClick={() => sharing ? void (demoMode ? demoShare.stop() : liveRoom.stopScreenShare()) : setQualityPickerOpen(true)}><span>{sharing ? '■' : '▣'}</span>TELA</button>
          <button className="leave-voice" type="button" onClick={() => demoMode ? setDemoJoined(false) : liveRoom.disconnect()}><span>×</span>SAIR</button>
        </footer></>
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
    </aside>
  )
}
