import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import { DropdownMenu } from 'radix-ui'
import type { DirectMessageSummary, FriendPresence, PersonSummary } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { Hint } from '../../components/ui/Hint'
import { supabase } from '../../lib/supabase'
import { statusClass, statusLabel } from './presence'
import { BackIcon, MoreIcon, PhoneIcon, PinIcon, SearchIcon, SendIcon, VideoIcon } from './WorkspaceIcons'
import type { WorkspaceIdentity } from './workspace-types'

type DirectMessagePanelProps = {
  demoMode: boolean
  friend: PersonSummary
  identity: WorkspaceIdentity
  onBack: () => void
  presence?: FriendPresence
  userId?: string
}

type DirectMessageRow = { id: string; author_id: string; body: string; created_at: string; profiles: Array<{ nickname: string }> | null }

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

export function DirectMessagePanel({ demoMode, friend, identity, onBack, presence, userId }: DirectMessagePanelProps) {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<DirectMessageSummary[]>([])
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [openError, setOpenError] = useState('')
  const [sendError, setSendError] = useState('')
  const [failedDraft, setFailedDraft] = useState('')
  const [messageQuery, setMessageQuery] = useState('')
  const [showJump, setShowJump] = useState(false)

  const listRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pinnedRef = useRef(true)

  useEffect(() => {
    pinnedRef.current = true
    setShowJump(false)
    setMessageQuery('')
    setOpenError('')
    setSendError('')
    setDraft('')
    setFailedDraft('')
  }, [friend.id])

  useEffect(() => {
    if (demoMode) { setConversationId(`demo-${friend.id}`); setMessages([]); setMessagesLoading(false); return }
    const client = supabase
    if (!client) return
    setMessagesLoading(true)
    setMessages([])
    void client.rpc('get_or_create_direct_conversation', { peer_id: friend.id }).then(({ data, error: requestError }) => {
      if (requestError || !data) { setOpenError('Não foi possível abrir esta conversa.'); return }
      setConversationId(data)
    })
  }, [demoMode, friend.id])

  useEffect(() => {
    const client = supabase
    if (!conversationId || demoMode || !client) return
    const load = () => client.from('direct_messages').select('id, author_id, body, created_at, profiles!direct_messages_author_id_fkey(nickname)').eq('conversation_id', conversationId).order('created_at').then(({ data }) => {
      setMessages(((data ?? []) as unknown as DirectMessageRow[]).map((message) => ({ id: message.id, authorId: message.author_id, authorNickname: message.profiles?.[0]?.nickname ?? 'Membro', body: message.body, createdAt: message.created_at })))
      setMessagesLoading(false)
    })
    void load()
    const channel = client.channel(`direct:${conversationId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'direct_messages', filter: `conversation_id=eq.${conversationId}` }, () => { void load() }).subscribe()
    return () => { void client.removeChannel(channel) }
  }, [conversationId, demoMode])

  useEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, MAX_COMPOSER_HEIGHT)}px`
  }, [draft])

  useEffect(() => {
    const node = listRef.current
    if (!node) return
    if (pinnedRef.current) node.scrollTop = node.scrollHeight
    else setShowJump(true)
  }, [messages])

  const query = messageQuery.trim().toLowerCase()
  const visibleMessages = query ? messages.filter((message) => message.body.toLowerCase().includes(query)) : messages

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

      const own = message.authorId === userId || (demoMode && message.authorId === 'demo-user')
      if (own) {
        nodes.push(
          <article className={groupStart ? 'direct-bubble own' : 'direct-bubble own grouped'} key={message.id}>
            {groupStart ? <header><strong>Você</strong><time>{formatTime(message.createdAt)}</time></header> : null}
            <p>{message.body}</p>
          </article>,
        )
      } else {
        nodes.push(
          <article className={groupStart ? 'direct-message-row' : 'direct-message-row grouped'} key={message.id}>
            {groupStart ? <Avatar initials={friend.nickname.slice(0, 2).toUpperCase()} url={friend.avatarUrl} /> : <span aria-hidden="true" className="direct-message-row-spacer" />}
            <div>
              {groupStart ? <header><strong>{friend.nickname}</strong><time>{formatTime(message.createdAt)}</time></header> : null}
              <p>{message.body}</p>
            </div>
          </article>,
        )
      }
    })
    return nodes
  }, [visibleMessages, friend.nickname, friend.avatarUrl, userId, demoMode])

  const send = async (body: string) => {
    const trimmed = body.trim()
    if (!trimmed || !conversationId) return
    setSendError('')
    if (demoMode) {
      setMessages((current) => [...current, { id: String(Date.now()), authorId: 'demo-user', authorNickname: identity.nickname, body: trimmed, createdAt: new Date().toISOString() }])
    } else if (supabase && userId) {
      const { error: requestError } = await supabase.from('direct_messages').insert({ conversation_id: conversationId, author_id: userId, body: trimmed })
      if (requestError) { setSendError('Não foi possível enviar a mensagem.'); setFailedDraft(trimmed); return }
    }
    setDraft('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    void send(draft)
  }

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void send(draft)
    }
  }

  const jumpToBottom = () => {
    const node = listRef.current
    if (node) node.scrollTop = node.scrollHeight
    pinnedRef.current = true
    setShowJump(false)
  }

  const onScroll = () => {
    const node = listRef.current
    if (!node) return
    const distance = node.scrollHeight - node.scrollTop - node.clientHeight
    pinnedRef.current = distance < JUMP_THRESHOLD_PX
    if (pinnedRef.current) setShowJump(false)
  }

  const opening = !demoMode && !conversationId && !openError

  return (
    <section className="direct-message">
      <header>
        <button aria-label="Voltar para mensagens" className="direct-back" type="button" onClick={onBack}><BackIcon /></button>
        <span className={statusClass(presence)}><Avatar initials={friend.nickname.slice(0, 2).toUpperCase()} url={friend.avatarUrl} /></span>
        <div><strong>{friend.nickname}</strong><small>{statusLabel(presence)}</small></div>
        <div className="direct-header-actions">
          <Hint label="Chamada de voz em breve"><button aria-label="Chamada de voz" disabled type="button"><PhoneIcon /></button></Hint>
          <Hint label="Chamada de vídeo em breve"><button aria-label="Chamada de vídeo" disabled type="button"><VideoIcon /></button></Hint>
          <Hint label="Fixados em breve"><button aria-label="Mensagens fixadas" disabled type="button"><PinIcon /></button></Hint>
          <div className="channel-search-input">
            <SearchIcon />
            <input aria-label="Buscar na conversa" placeholder="Buscar" type="search" value={messageQuery} onChange={(event) => setMessageQuery(event.target.value)} />
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger aria-label="Mais opções" type="button">
              <MoreIcon />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" className="server-menu-content" sideOffset={6}>
                <DropdownMenu.Item onSelect={() => void navigator.clipboard?.writeText(`@${friend.username}`)}>Copiar identificador</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>

      <div aria-live="polite" className="direct-message-list" ref={listRef} onScroll={onScroll}>
        {openError ? (
          <div className="direct-central-error">
            <strong>{openError}</strong>
          </div>
        ) : opening || messagesLoading ? (
          <div aria-hidden="true" className="direct-skeleton">
            <span /><span /><span />
          </div>
        ) : !messages.length ? (
          <div className="direct-empty">
            <Avatar initials={friend.nickname.slice(0, 2).toUpperCase()} url={friend.avatarUrl} />
            <strong>{friend.nickname}</strong>
            <small>@{friend.username}</small>
            <p>Este é o começo da sua conversa com @{friend.username}.</p>
            <span className="direct-empty-note">Vocês são amigos no Concord.</span>
          </div>
        ) : !visibleMessages.length ? (
          <p className="channel-empty">Nenhuma mensagem encontrada.</p>
        ) : (
          timeline
        )}
      </div>

      {showJump ? <button className="direct-jump" type="button" onClick={jumpToBottom}>↓ Novas mensagens</button> : null}

      {sendError ? (
        <p className="composer-feedback" role="status">
          {sendError}
          <button type="button" onClick={() => void send(failedDraft)}>Tentar novamente</button>
        </p>
      ) : null}

      <form className="direct-composer" onSubmit={submit}>
        <Hint label="Anexos em breve"><button aria-label="Adicionar anexo" className="direct-composer-add" disabled type="button">+</button></Hint>
        <textarea
          aria-label="Mensagem privada"
          placeholder={`Conversar com @${friend.username}`}
          ref={textareaRef}
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onComposerKeyDown}
        />
        <div className="direct-composer-actions">
          <Hint label="Emojis em breve"><button aria-label="Emojis" className="direct-composer-emoji" disabled type="button">☺</button></Hint>
          <Hint label="GIFs em breve"><button aria-label="Enviar GIF" className="direct-composer-gif" disabled type="button">GIF</button></Hint>
          <button aria-label="Enviar mensagem" className="direct-composer-send" disabled={!conversationId || !draft.trim()} type="submit"><SendIcon /></button>
        </div>
      </form>
    </section>
  )
}
