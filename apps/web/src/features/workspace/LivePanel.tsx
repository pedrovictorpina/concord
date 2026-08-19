import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChannelSummary, VoicePreferences } from '@concord/contracts'
import { useLiveRoom } from './useLiveRoom'
import { useScreenShare } from './useScreenShare'
import { screenShareQualities } from './screen-quality'
import type { ScreenShareQuality } from './screen-quality'

type LivePanelProps = {
  demoMode: boolean
  microphoneDisabled: boolean
  onConnectionChange: (channelId: string | null, connected: boolean) => void
  outputDisabled: boolean
  voiceChannel: ChannelSummary | null
}

export function LivePanel({ demoMode, microphoneDisabled, onConnectionChange, outputDisabled, voiceChannel }: LivePanelProps) {
  const demoShare = useScreenShare()
  const liveRoom = useLiveRoom(voiceChannel?.id ?? null)
  const disconnectRoom = liveRoom.disconnect
  const [preferences, setPreferences] = useState<VoicePreferences>({ microphoneEnabled: true, outputEnabled: true, screenShareEnabled: false })
  const [qualityPickerOpen, setQualityPickerOpen] = useState(false)
  const [quality, setQuality] = useState<ScreenShareQuality>('automatic')
  const [demoJoined, setDemoJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sharing = demoMode ? Boolean(demoShare.stream) : Boolean(liveRoom.screenTrack)
  const screenShareAvailable = Boolean(navigator.mediaDevices?.getDisplayMedia)
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
  useEffect(() => { if (joined) setJoining(false) }, [joined])
  useEffect(() => setJoining(false), [voiceChannel?.id])
  useEffect(() => {
    setDemoJoined(false)
    disconnectRoom()
  }, [disconnectRoom, voiceChannel?.id])
  useEffect(() => onConnectionChange(voiceChannel?.id ?? null, joined), [joined, onConnectionChange, voiceChannel?.id])
  useEffect(() => {
    if (demoMode || !joined) return
    if (microphoneDisabled && liveRoom.microphoneEnabled) void liveRoom.toggleMicrophone()
    if (outputDisabled && liveRoom.outputEnabled) liveRoom.toggleOutput()
  }, [demoMode, joined, liveRoom, microphoneDisabled, outputDisabled])

  const toggleDemoPreference = (key: 'microphoneEnabled' | 'outputEnabled') => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
  }

  const startScreenShare = (nextQuality: ScreenShareQuality) => {
    if (!screenShareAvailable) return
    setQuality(nextQuality)
    setQualityPickerOpen(false)
    return demoMode ? demoShare.start(nextQuality) : liveRoom.startScreenShare(nextQuality)
  }

  const joinVoice = useCallback(async () => {
    if (joining || joined) return
    setJoining(true)
    const connected = demoMode
      ? await new Promise<boolean>((resolve) => window.setTimeout(() => resolve(true), 250))
      : await liveRoom.join()
    if (demoMode && connected) setDemoJoined(true)
    if (!connected) setJoining(false)
  }, [demoMode, joined, joining, liveRoom])

  if (!voiceChannel) return null

  return (
    <>
      <section className="voice-room">
        <header><div><span>◖</span><strong>{voiceChannel.name}</strong></div><small>{joined ? 'CONECTADO' : 'CANAL DE VOZ'}</small></header>
        <div className="voice-room-stage"><span className="voice-room-icon">◖</span><h1>{voiceChannel.name}</h1><p>{joined ? 'Você está em voz.' : 'Ninguém está em voz'}</p>{!joined ? <button aria-busy={joining} className="voice-room-join" disabled={joining} type="button" onClick={() => void joinVoice()}>{joining ? 'Entrando na chamada…' : 'Entrar na chamada de voz'}</button> : null}</div>
      </section>
      <aside className="voice-chat-side"><header><strong>Chat de voz</strong><small>#{voiceChannel.name}</small></header><div><p>O chat deste canal aparece aqui.</p></div></aside>
      {joined ? <aside className="voice-dock joined">
        {sharing ? <div className="voice-preview"><video ref={videoRef} autoPlay muted={demoMode} playsInline /><span className="capture-label">TRANSMITINDO</span></div> : null}
        {error ? <p className="share-error" role="status">{error}</p> : null}
        {!screenShareAvailable ? <p className="voice-capability-note" role="status">Compartilhar tela não é suportado nesta PWA móvel. Use o Concord no desktop.</p> : null}
        <div className="voice-dock-status"><span className="live-pulse" /> <strong>Voz conectada</strong><small>{demoMode ? 'REDE LOCAL · 28 ms' : 'REDE ESTÁVEL · WEBRTC'}</small></div>
        <footer className="voice-controls">
          <button aria-label={microphoneDisabled ? 'Microfone desativado pela moderação' : 'MIC'} className={microphoneDisabled || (demoMode ? !preferences.microphoneEnabled : !liveRoom.microphoneEnabled) ? 'disabled' : ''} disabled={microphoneDisabled} type="button" onClick={() => demoMode ? toggleDemoPreference('microphoneEnabled') : void liveRoom.toggleMicrophone()}><span>{microphoneDisabled || (demoMode ? !preferences.microphoneEnabled : !liveRoom.microphoneEnabled) ? '×' : '⌁'}</span>MIC</button>
          <button aria-label={outputDisabled ? 'Áudio desativado pela moderação' : 'ÁUDIO'} className={outputDisabled || (demoMode ? !preferences.outputEnabled : !liveRoom.outputEnabled) ? 'disabled' : ''} disabled={outputDisabled} type="button" onClick={() => demoMode ? toggleDemoPreference('outputEnabled') : liveRoom.toggleOutput()}><span>{outputDisabled || (demoMode ? !preferences.outputEnabled : !liveRoom.outputEnabled) ? '×' : '◖'}</span>ÁUDIO</button>
          <button aria-label={screenShareAvailable ? 'TELA' : 'Tela indisponível neste dispositivo'} className={sharing || !screenShareAvailable ? 'disabled' : ''} disabled={!screenShareAvailable} title={screenShareAvailable ? undefined : 'Compartilhamento de tela indisponível nesta PWA móvel'} type="button" onClick={() => sharing ? void (demoMode ? demoShare.stop() : liveRoom.stopScreenShare()) : setQualityPickerOpen(true)}><span>{sharing ? '■' : '▣'}</span>TELA</button>
          <button className="leave-voice" type="button" onClick={() => demoMode ? setDemoJoined(false) : liveRoom.disconnect()}><span>×</span>SAIR</button>
        </footer>
      </aside> : null}
      {joined && qualityPickerOpen ? (
        <section className="quality-picker" role="dialog" aria-label="Qualidade da transmissao">
          <header><strong>QUALIDADE DA TELA</strong><button aria-label="Fechar seletor de qualidade" type="button" onClick={() => setQualityPickerOpen(false)}>×</button></header>
          <p>Escolha como quer transmitir antes de selecionar a tela.</p>
          <div>{(Object.keys(screenShareQualities) as ScreenShareQuality[]).map((option) => (
            <button className={quality === option ? 'active' : ''} key={option} type="button" onClick={() => void startScreenShare(option)}><strong>{screenShareQualities[option].label}</strong><small>{screenShareQualities[option].detail}</small></button>
          ))}</div>
        </section>
      ) : null}
    </>
  )
}
