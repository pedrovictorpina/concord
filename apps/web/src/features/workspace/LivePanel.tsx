import { useEffect, useRef } from 'react'
import type { LocalTrack, RemoteTrack } from 'livekit-client'
import type { ChannelSummary, VoiceParticipant } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'

type LivePanelProps = {
  channel: ChannelSummary
  connected: boolean
  connecting: boolean
  demoMode: boolean
  onJoin: () => void
  participants: VoiceParticipant[]
  screenTrack: LocalTrack | RemoteTrack | null
  stream: MediaStream | null
}

const statusFor = (participant: VoiceParticipant) => {
  if (participant.sharingScreen) return 'compartilhando tela'
  if (!participant.microphoneEnabled) return 'sem microfone'
  if (participant.speaking) return 'falando'
  return 'conectado'
}

export function LivePanel({ channel, connected, connecting, demoMode, onJoin, participants, screenTrack, stream }: LivePanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sharing = demoMode ? Boolean(stream) : Boolean(screenTrack)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (demoMode) {
      video.srcObject = stream
      return
    }
    if (!screenTrack) {
      video.srcObject = null
      return
    }
    screenTrack.attach(video)
    return () => {
      screenTrack.detach(video)
    }
  }, [demoMode, screenTrack, stream])

  const summary = connected
    ? 'Você está em voz.'
    : participants.length === 1
      ? '1 pessoa em voz agora.'
      : participants.length > 1
        ? `${participants.length} pessoas em voz agora.`
        : 'Ninguém está em voz'

  return (
    <>
      <section className="voice-room">
        <header><div><span>◖</span><strong>{channel.name}</strong></div><small>{connected ? 'CONECTADO' : 'CANAL DE VOZ'}</small></header>
        <div className="voice-room-stage">
          {participants.length === 0 ? <span className="voice-room-icon">◖</span> : null}
          <h1>{channel.name}</h1>
          {sharing ? <div className="voice-stage-share"><video ref={videoRef} autoPlay muted={demoMode} playsInline /><span className="capture-label">TRANSMITINDO</span></div> : null}
          {participants.length > 0 ? (
            <ul className="voice-stage-grid">
              {participants.map((participant) => (
                <li className={participant.speaking ? 'voice-tile speaking' : 'voice-tile'} key={participant.userId}>
                  <Avatar initials={participant.initials} url={participant.avatarUrl} />
                  <strong>{participant.nickname}</strong>
                  <small>{statusFor(participant)}</small>
                </li>
              ))}
            </ul>
          ) : null}
          <p>{summary}</p>
          {!connected ? <button aria-busy={connecting} className="voice-room-join" disabled={connecting} type="button" onClick={onJoin}>{connecting ? 'Entrando na chamada…' : 'Entrar na chamada de voz'}</button> : null}
        </div>
      </section>
      <aside className="voice-chat-side"><header><strong>Chat de voz</strong><small>#{channel.name}</small></header><div><p>O chat deste canal aparece aqui.</p></div></aside>
    </>
  )
}
