import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { ChannelSummary, MessageSummary, VoiceParticipant } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { MemberContextMenu } from './MemberContextMenu'
import { ScreenShareTile } from './ScreenShareTile'
import type { ScreenShareView } from './screen-shares'
import { VoiceStateFlags } from './VoiceStateIcons'
import type { WorkspaceIdentity } from './workspace-types'

type LivePanelProps = {
  channel: ChannelSummary
  connected: boolean
  connecting: boolean
  identity: WorkspaceIdentity
  messages: MessageSummary[]
  onJoin: () => void
  onSendMessage: (body: string, authorNickname: string) => Promise<{ ok: boolean; message: string }>
  onSetParticipantVolume: (userId: string, volume: number) => void
  onSetShareVolume: (participantId: string, volume: number) => void
  onToggleShareSound: (participantId: string, muted: boolean) => void
  screenAudioMuted: Record<string, boolean>
  screenVolumeByUser: Record<string, number>
  onWatchShare: (participantId: string, watched: boolean) => void
  participants: VoiceParticipant[]
  screenShares: ScreenShareView[]
  userId?: string
  volumeByUser: Record<string, number>
}

const formatTime = (value: string) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))

const statusFor = (participant: VoiceParticipant) => {
  if (!participant.outputEnabled) return 'sem áudio'
  if (!participant.microphoneEnabled) return 'sem microfone'
  if (participant.sharingScreen) return 'compartilhando tela'
  if (participant.speaking) return 'falando'
  return 'conectado'
}

export function LivePanel({ channel, connected, connecting, identity, messages, onJoin, onSendMessage, onSetParticipantVolume, onSetShareVolume, onToggleShareSound, screenAudioMuted, screenVolumeByUser, onWatchShare, participants, screenShares, userId, volumeByUser }: LivePanelProps) {
  const [focusedShareId, setFocusedShareId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [chatFeedback, setChatFeedback] = useState('')

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body) return
    setSending(true)
    setChatFeedback('')
    const result = await onSendMessage(body, identity.nickname)
    setSending(false)
    if (result.ok) setDraft('')
    else setChatFeedback(result.message)
  }
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

  const availableShares = participants.filter((participant) => participant.sharingScreen && !screenShares.some((share) => share.participantId === participant.userId))

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
                  muted={screenAudioMuted[share.participantId] === true}
                  onSetVolume={(volume) => onSetShareVolume(share.participantId, volume)}
                  onStopWatching={() => onWatchShare(share.participantId, false)}
                  onToggleSound={() => onToggleShareSound(share.participantId, !(screenAudioMuted[share.participantId] === true))}
                  onToggleFocus={() => setFocusedShareId((current) => current === share.id ? null : share.id)}
                  share={share}
                  volume={screenVolumeByUser[share.participantId] ?? 1}
                />
              ))}
            </ul>
          ) : null}
          {sharesLabel ? <p className="voice-stage-shares-note">{sharesLabel}</p> : null}
          {availableShares.length > 0 ? (
            <ul className="voice-stage-available" aria-label="Transmissões disponíveis">
              {availableShares.map((participant) => (
                <li key={participant.userId}>
                  <button type="button" onClick={() => onWatchShare(participant.userId, true)}>▣ Ver a tela de {participant.nickname}</button>
                </li>
              ))}
            </ul>
          ) : null}
          {participants.length > 0 ? (
            <ul className="voice-stage-grid">
              {participants.map((participant) => (
                <MemberContextMenu
                  canModerate={false}
                  canSetRole={false}
                  inVoice
                  isSelf={participant.userId === userId}
                  key={participant.userId}
                  onSetVolume={(volume) => onSetParticipantVolume(participant.userId, volume)}
                  target={{ userId: participant.userId, nickname: participant.nickname, username: participant.username }}
                  volume={volumeByUser[participant.userId] ?? 1}
                >
                  <li className={participant.speaking ? 'voice-tile speaking' : 'voice-tile'}>
                    <Avatar initials={participant.initials} url={participant.avatarUrl} />
                    <strong>{participant.nickname}</strong>
                    <small>{statusFor(participant)}</small>
                    <VoiceStateFlags microphoneEnabled={participant.microphoneEnabled} outputEnabled={participant.outputEnabled} sharingScreen={participant.sharingScreen} />
                  </li>
                </MemberContextMenu>
              ))}
            </ul>
          ) : null}
          <p>{summary}</p>
          {!connected ? <button aria-busy={connecting} className="voice-room-join" disabled={connecting} type="button" onClick={onJoin}>{connecting ? 'Entrando na chamada…' : 'Entrar na chamada de voz'}</button> : null}
        </div>
      </section>
      <aside className="voice-chat-side">
        <header><strong>Chat de voz</strong><small>#{channel.name}</small></header>
        <div className="voice-chat-messages" aria-live="polite">
          {messages.map((message) => (
            <article className="voice-chat-message" key={message.id}>
              <Avatar initials={message.authorNickname.slice(0, 2).toUpperCase()} tone={message.authorId === userId ? 'green' : 'amber'} />
              <div>
                <header><strong>{message.authorNickname}</strong><time>{formatTime(message.createdAt)}</time></header>
                <p>{message.body}</p>
              </div>
            </article>
          ))}
          {!messages.length ? <p className="channel-empty">Sem mensagens ainda. Este chat acompanha a chamada.</p> : null}
        </div>
        <form className="composer" onSubmit={(event) => void sendMessage(event)}>
          <input aria-label="Mensagem do canal de voz" disabled={sending} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Transmitir em ${channel.name}`} />
          <span>{sending ? 'ENVIANDO' : 'ENTER ↵'}</span>
        </form>
        {chatFeedback ? <p className="composer-feedback" role="status">{chatFeedback}</p> : null}
      </aside>
    </>
  )
}
