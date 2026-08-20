import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import type { ChannelSummary, MessageSummary, VoiceParticipant } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { MemberContextMenu } from './MemberContextMenu'
import { ScreenShareButton } from './ScreenShareButton'
import { ScreenShareTile } from './ScreenShareTile'
import type { ScreenShareQuality } from './screen-quality'
import type { ScreenShareView } from './screen-shares'
import { AudioIcon, AudioOffIcon, ChatIcon, MicIcon, MicOffIcon, ScreenIcon, SpeakerIcon, VoiceStateFlags } from './VoiceStateIcons'
import type { WorkspaceIdentity } from './workspace-types'

type LivePanelProps = {
  channel: ChannelSummary
  chatVisible: boolean
  connected: boolean
  connecting: boolean
  identity: WorkspaceIdentity
  messages: MessageSummary[]
  microphoneDisabled: boolean
  microphoneEnabled: boolean
  onJoin: () => void
  onLeave: () => void
  onSendMessage: (body: string, authorNickname: string) => Promise<{ ok: boolean; message: string }>
  onSetParticipantVolume: (userId: string, volume: number) => void
  onSetShareVolume: (participantId: string, volume: number) => void
  onStartScreenShare: (quality: ScreenShareQuality) => void
  onStopScreenShare: () => void
  onToggleChat: () => void
  onToggleMicrophone: () => void
  onToggleOutput: () => void
  onToggleShareSound: (participantId: string, muted: boolean) => void
  outputDisabled: boolean
  outputEnabled: boolean
  screenAudioMuted: Record<string, boolean>
  screenVolumeByUser: Record<string, number>
  onWatchShare: (participantId: string, watched: boolean) => void
  participants: VoiceParticipant[]
  screenShares: ScreenShareView[]
  sharing: boolean
  userId?: string
  volumeByUser: Record<string, number>
}

const MAX_COMPOSER_HEIGHT = 132

const formatTime = (value: string) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))

const statusFor = (participant: VoiceParticipant) => {
  if (!participant.outputEnabled) return 'sem áudio'
  if (!participant.microphoneEnabled) return 'sem microfone'
  if (participant.sharingScreen) return 'compartilhando tela'
  if (participant.speaking) return 'falando'
  return 'conectado'
}

export function LivePanel({ channel, chatVisible, connected, connecting, identity, messages, microphoneDisabled, microphoneEnabled, onJoin, onLeave, onSendMessage, onSetParticipantVolume, onSetShareVolume, onStartScreenShare, onStopScreenShare, onToggleChat, onToggleMicrophone, onToggleOutput, onToggleShareSound, outputDisabled, outputEnabled, screenAudioMuted, screenVolumeByUser, onWatchShare, participants, screenShares, sharing, userId, volumeByUser }: LivePanelProps) {
  const [focusedShareId, setFocusedShareId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [chatFeedback, setChatFeedback] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const microphoneOff = microphoneDisabled || !microphoneEnabled
  const outputOff = outputDisabled || !outputEnabled

  const submitDraft = async () => {
    const body = draft.trim()
    if (!body) return
    setSending(true)
    setChatFeedback('')
    const result = await onSendMessage(body, identity.nickname)
    setSending(false)
    if (result.ok) setDraft('')
    else setChatFeedback(result.message)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void submitDraft()
  }

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void submitDraft()
    }
  }

  useEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, MAX_COMPOSER_HEIGHT)}px`
  }, [draft])

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
        <header>
          <div><SpeakerIcon /><strong>{channel.name}</strong></div>
          <div className="voice-room-header-actions">
            <small>{participants.length === 0 ? 'Ninguém em voz' : `${participants.length} ${participants.length === 1 ? 'participante' : 'participantes'}`}</small>
            <button aria-label={chatVisible ? 'Ocultar chat de voz' : 'Mostrar chat de voz'} aria-pressed={chatVisible} className={chatVisible ? 'active' : ''} type="button" onClick={onToggleChat}><ChatIcon /></button>
          </div>
        </header>
        <div className="voice-room-stage">
          {participants.length === 0 ? <span className="voice-room-icon"><SpeakerIcon /></span> : null}
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
                  <button type="button" onClick={() => onWatchShare(participant.userId, true)}><ScreenIcon /> Ver a tela de {participant.nickname}</button>
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
                    <strong>{participant.nickname}{participant.userId === userId ? ' (você)' : ''}</strong>
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
        {connected ? (
          <footer className="voice-room-controls">
            <div className="voice-controls">
              <button aria-label={microphoneDisabled ? 'Microfone desativado pela moderação' : microphoneOff ? 'Microfone mutado' : 'Microfone ligado'} aria-pressed={microphoneOff} className={microphoneOff ? 'disabled' : ''} disabled={microphoneDisabled} type="button" onClick={onToggleMicrophone}><span>{microphoneOff ? <MicOffIcon /> : <MicIcon />}</span>MIC</button>
              <button aria-label={outputDisabled ? 'Áudio desativado pela moderação' : outputOff ? 'Áudio mutado' : 'Áudio ligado'} aria-pressed={outputOff} className={outputOff ? 'disabled' : ''} disabled={outputDisabled} type="button" onClick={onToggleOutput}><span>{outputOff ? <AudioOffIcon /> : <AudioIcon />}</span>ÁUDIO</button>
              <ScreenShareButton onStart={onStartScreenShare} onStop={onStopScreenShare} sharing={sharing} />
              <button className="leave-voice" type="button" onClick={onLeave}><span>×</span>SAIR</button>
            </div>
          </footer>
        ) : null}
      </section>
      <aside className={chatVisible ? 'voice-chat-side' : 'voice-chat-side collapsed'}>
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
        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            aria-label="Mensagem do canal de voz"
            disabled={sending}
            placeholder={`Transmitir em ${channel.name}`}
            ref={textareaRef}
            rows={1}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onComposerKeyDown}
          />
          <button className="composer-send" type="submit" aria-label="Enviar mensagem" disabled={sending || !draft.trim()}>➤</button>
        </form>
        {chatFeedback ? <p className="composer-feedback" role="status">{chatFeedback}</p> : null}
      </aside>
    </>
  )
}
