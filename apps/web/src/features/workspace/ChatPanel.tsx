import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import type { ChannelSummary, MessageSummary, ServerSummary } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { Hint } from '../../components/ui/Hint'
import { EmojiIcon, GiftIcon, PeopleIcon, PinIcon, SearchIcon, SendIcon } from './WorkspaceIcons'
import type { WorkspaceIdentity } from './workspace-types'

type ChatPanelProps = {
  activeChannel: ChannelSummary | null
  identity: WorkspaceIdentity
  loading: boolean
  membersPanelVisible: boolean
  messages: MessageSummary[]
  onOpenMobileNavigation: () => void
  onSendMessage: (body: string, authorNickname: string) => Promise<{ ok: boolean; message: string }>
  onToggleMembersPanel: () => void
  server: ServerSummary | null
  userId?: string
}

const GROUP_WINDOW_MS = 5 * 60 * 1000
const MAX_COMPOSER_HEIGHT = 132
const JUMP_THRESHOLD_PX = 80

const formatTime = (value: string) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))

const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const formatDayLabel = (value: string) => {
  const date = new Date(value)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(date, now)) return 'Hoje'
  if (isSameDay(date, yesterday)) return 'Ontem'
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

const firstUrl = (body: string) => body.match(/https?:\/\/[^\s]+/)?.[0]

export function ChatPanel({ activeChannel, identity, loading, membersPanelVisible, messages, onOpenMobileNavigation, onSendMessage, onToggleMembersPanel, server, userId }: ChatPanelProps) {
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [messageQuery, setMessageQuery] = useState('')
  const [showJump, setShowJump] = useState(false)

  const listRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pinnedRef = useRef(true)

  const query = messageQuery.trim().toLowerCase()
  const visibleMessages = query ? messages.filter((message) => message.body.toLowerCase().includes(query) || message.authorNickname.toLowerCase().includes(query)) : messages

  useEffect(() => {
    pinnedRef.current = true
    setShowJump(false)
  }, [activeChannel?.id])

  useEffect(() => {
    const node = listRef.current
    if (!node) return
    if (pinnedRef.current) node.scrollTop = node.scrollHeight
    else setShowJump(true)
  }, [messages])

  useEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, MAX_COMPOSER_HEIGHT)}px`
  }, [draft])

  const onScroll = () => {
    const node = listRef.current
    if (!node) return
    const distance = node.scrollHeight - node.scrollTop - node.clientHeight
    pinnedRef.current = distance < JUMP_THRESHOLD_PX
    if (pinnedRef.current) setShowJump(false)
  }

  const jumpToBottom = () => {
    const node = listRef.current
    if (node) node.scrollTop = node.scrollHeight
    pinnedRef.current = true
    setShowJump(false)
  }

  const timeline = useMemo(() => {
    const nodes: ReactNode[] = []
    visibleMessages.forEach((message, index) => {
      const previous = visibleMessages[index - 1]
      const createdAt = new Date(message.createdAt)
      const previousCreatedAt = previous ? new Date(previous.createdAt) : null
      const newDay = !previousCreatedAt || !isSameDay(previousCreatedAt, createdAt)
      const sameGroup = Boolean(previous) && !newDay && previous.authorId === message.authorId && createdAt.getTime() - (previousCreatedAt?.getTime() ?? 0) < GROUP_WINDOW_MS
      const groupStart = !sameGroup
      if (newDay) nodes.push(<div className="date-divider" key={`date-${message.id}`}><span>{formatDayLabel(message.createdAt)}</span></div>)
      const url = firstUrl(message.body)
      nodes.push(
        <article className={groupStart ? 'message' : 'message grouped'} key={message.id}>
          {groupStart ? <Avatar initials={message.authorNickname.slice(0, 2).toUpperCase()} tone={message.authorId === userId ? 'green' : 'amber'} /> : <span aria-hidden="true" className="message-spacer" />}
          <div>
            {groupStart ? <header><strong>{message.authorNickname}</strong><time>{formatTime(message.createdAt)}</time>{message.editedAt ? <em>EDITADA</em> : null}</header> : null}
            <p>{message.body}</p>
            {url ? <a className="link-preview" href={url} rel="noreferrer" target="_blank"><strong>{new URL(url).hostname}</strong><span>Abrir link em nova aba ↗</span></a> : null}
          </div>
        </article>,
      )
    })
    return nodes
  }, [visibleMessages, userId])

  const submitDraft = async () => {
    const body = draft.trim()
    if (!body) return
    setSending(true)
    setFeedback('')
    const result = await onSendMessage(body, identity.nickname)
    setSending(false)
    if (result.ok) setDraft('')
    else setFeedback(result.message)
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

  if (!server) {
    return (
      <section className="transmission empty-workspace">
        <header className="transmission-header">
          <div className="channel-title"><span>+</span><div><strong>Seu primeiro servidor</strong><small>Comunidades privadas, sem excesso de camadas.</small></div></div>
        </header>
        <div className="workspace-empty-copy">
          <span className="eyebrow">ETAPA 02 / COMUNIDADES</span>
          <h1>Comece um lugar<br />para a sua equipe.</h1>
          <p>Crie um servidor no botão <strong>+</strong> da barra lateral. O Concord prepara o canal <strong>#geral</strong> automaticamente.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="transmission">
      <header className="transmission-header">
        <div className="channel-title">
          <button className="mobile-channel-menu" type="button" aria-label="Abrir canais" onClick={onOpenMobileNavigation}>☰</button>
          <span>#</span>
          <strong>{activeChannel?.name ?? 'canal'}</strong>
        </div>
        <div className="transmission-header-actions">
          <Hint label="Fixados em breve"><button disabled type="button" aria-label="Mensagens fixadas"><PinIcon /></button></Hint>
          <Hint label={membersPanelVisible ? 'Ocultar membros' : 'Mostrar membros'}><button className={membersPanelVisible ? 'active' : ''} type="button" aria-label="Alternar lista de membros" onClick={onToggleMembersPanel}><PeopleIcon /></button></Hint>
          <div className="channel-search-input">
            <SearchIcon />
            <input aria-label="Buscar no canal" placeholder="Buscar no canal" type="search" value={messageQuery} onChange={(event) => setMessageQuery(event.target.value)} />
          </div>
        </div>
      </header>

      <div className="messages" aria-live="polite" ref={listRef} onScroll={onScroll}>
        {loading ? (
          <p className="channel-empty">Sincronizando mensagens…</p>
        ) : !messages.length ? (
          <div className="channel-empty-state">
            <span>#</span>
            <strong>{activeChannel?.name ?? 'canal'}</strong>
            <p>Este é o começo do canal #{activeChannel?.name}.</p>
            <small>{server.name}</small>
          </div>
        ) : !visibleMessages.length ? (
          <p className="channel-empty">Nenhuma mensagem encontrada.</p>
        ) : (
          timeline
        )}
      </div>

      {showJump ? <button className="chat-jump" type="button" onClick={jumpToBottom}>↓ Novas mensagens</button> : null}

      <form className="composer" onSubmit={handleSubmit}>
        <Hint label="Anexos em breve"><button aria-label="Adicionar anexo" disabled type="button">+</button></Hint>
        <textarea
          aria-label="Mensagem"
          disabled={!activeChannel || sending}
          placeholder={activeChannel ? `Conversar em #${activeChannel.name}` : 'Escolha um canal de texto'}
          ref={textareaRef}
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onComposerKeyDown}
        />
        <div className="composer-actions">
          <Hint label="Enviar presente em breve"><button disabled type="button" aria-label="Enviar presente"><GiftIcon /></button></Hint>
          <Hint label="GIFs em breve"><button className="composer-gif" disabled type="button" aria-label="Enviar GIF">GIF</button></Hint>
          <Hint label="Emojis em breve"><button disabled type="button" aria-label="Emojis"><EmojiIcon /></button></Hint>
          <button className="composer-send" type="submit" aria-label="Enviar mensagem" disabled={!activeChannel || sending || !draft.trim()}><SendIcon /></button>
        </div>
      </form>
      {feedback ? <p className="composer-feedback" role="status">{feedback}</p> : null}
    </section>
  )
}
