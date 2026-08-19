import { useEffect, useState } from 'react'
import type { ChannelSummary, VoiceParticipant } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { ScreenShareTile } from './ScreenShareTile'
import type { ScreenShareView } from './screen-shares'
import { VoiceStateFlags } from './VoiceStateIcons'

type LivePanelProps = {
  channel: ChannelSummary
  connected: boolean
  connecting: boolean
  onJoin: () => void
  participants: VoiceParticipant[]
  screenShares: ScreenShareView[]
}

const statusFor = (participant: VoiceParticipant) => {
  if (!participant.outputEnabled) return 'sem áudio'
  if (!participant.microphoneEnabled) return 'sem microfone'
  if (participant.sharingScreen) return 'compartilhando tela'
  if (participant.speaking) return 'falando'
  return 'conectado'
}

export function LivePanel({ channel, connected, connecting, onJoin, participants, screenShares }: LivePanelProps) {
  const [focusedShareId, setFocusedShareId] = useState<string | null>(null)
  const focusedShare = screenShares.find((share) => share.id === focusedShareId) ?? null

  useEffect(() => {
    if (focusedShareId && !screenShares.some((share) => share.id === focusedShareId)) setFocusedShareId(null)
  }, [focusedShareId, screenShares])

  const summary = connected
    ? 'Você está em voz.'
    : participants.length === 1
      ? '1 pessoa em voz agora.'
      : participants.length > 1
        ? `${participants.length} pessoas em voz agora.`
        : 'Ninguém está em voz'

  const sharesLabel = screenShares.length > 1
    ? `${screenShares.length} telas sendo transmitidas agora.`
    : null

  return (
    <>
      <section className="voice-room">
        <header><div><span>◖</span><strong>{channel.name}</strong></div><small>{connected ? 'CONECTADO' : 'CANAL DE VOZ'}</small></header>
        <div className="voice-room-stage">
          {participants.length === 0 ? <span className="voice-room-icon">◖</span> : null}
          <h1>{channel.name}</h1>
          {screenShares.length > 0 ? (
            <ul className={focusedShare ? 'voice-stage-shares has-focus' : 'voice-stage-shares'} data-count={Math.min(screenShares.length, 4)}>
              {screenShares.map((share) => (
                <ScreenShareTile
                  focused={share.id === focusedShare?.id}
                  key={share.id}
                  onToggleFocus={() => setFocusedShareId((current) => current === share.id ? null : share.id)}
                  share={share}
                />
              ))}
            </ul>
          ) : null}
          {sharesLabel ? <p className="voice-stage-shares-note">{sharesLabel}</p> : null}
          {participants.length > 0 ? (
            <ul className="voice-stage-grid">
              {participants.map((participant) => (
                <li className={participant.speaking ? 'voice-tile speaking' : 'voice-tile'} key={participant.userId}>
                  <Avatar initials={participant.initials} url={participant.avatarUrl} />
                  <strong>{participant.nickname}</strong>
                  <small>{statusFor(participant)}</small>
                  <VoiceStateFlags microphoneEnabled={participant.microphoneEnabled} outputEnabled={participant.outputEnabled} sharingScreen={participant.sharingScreen} />
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
