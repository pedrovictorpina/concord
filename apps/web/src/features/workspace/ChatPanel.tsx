import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ChannelSummary, MessageSummary, ServerSummary } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { Hint } from '../../components/ui/Hint'
import { BellIcon, EmojiIcon, GiftIcon, PeopleIcon, PinIcon, SearchIcon } from './WorkspaceIcons'
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

const formatTime = (value: string) => new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(value))

const firstUrl = (body: string) => body.match(/https?:\/\/[^\s]+/)?.[0]

export function ChatPanel({ activeChannel, identity, loading, membersPanelVisible, messages, onOpenMobileNavigation, onSendMessage, onToggleMembersPanel, server, userId }: ChatPanelProps) {
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [messageQuery, setMessageQuery] = useState('')
  const query = messageQuery.trim().toLowerCase()
  const visibleMessages = query ? messages.filter((message) => message.body.toLowerCase().includes(query) || message.authorNickname.toLowerCase().includes(query)) : messages

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body) return

    setSending(true)
    setFeedback('')
    const result = await onSendMessage(body, identity.nickname)
    setSending(false)
    if (result.ok) setDraft('')
    else setFeedback(result.message)
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
        <div className="channel-title"><button className="mobile-channel-menu" type="button" aria-label="Abrir canais" onClick={onOpenMobileNavigation}>☰</button><span>#</span><div><strong>{activeChannel?.name ?? 'canal'}</strong><small>{server.description || 'Conversa direta do servidor'}</small></div></div>
        <div className="transmission-header-actions">
          <Hint label="Mensagens fixadas"><button type="button" aria-label="Mensagens fixadas"><PinIcon /></button></Hint>
          <Hint label="Notificações"><button type="button" aria-label="Notificações"><BellIcon /></button></Hint>
          <Hint label={membersPanelVisible ? 'Ocultar membros' : 'Mostrar membros'}><button className={membersPanelVisible ? 'active' : ''} type="button" aria-label="Alternar lista de membros" onClick={onToggleMembersPanel}><PeopleIcon /></button></Hint>
          <div className="channel-search-input">
            <SearchIcon />
            <input aria-label="Buscar no canal" placeholder="Buscar no canal" type="search" value={messageQuery} onChange={(event) => setMessageQuery(event.target.value)} />
          </div>
        </div>
        <div className="network-status"><i /> {loading ? 'SINCRONIZANDO' : 'REDE ESTAVEL'} <span>RT</span></div>
      </header>

      <div className="messages" aria-live="polite">
        <div className="date-divider"><span>CANAL DE TEXTO · ETAPA 02</span></div>
        <article className="launch-note">
          <span className="launch-index">02</span>
          <div>
            <span className="eyebrow">{server.role === 'owner' ? 'VOCE INICIOU ESTE ESPACO' : 'MEMBRO DO SERVIDOR'}</span>
            <h1>{server.name}.<br />Em sintonia.</h1>
            <p>{server.description || 'Este canal esta pronto para a primeira mensagem da comunidade.'}</p>
          </div>
        </article>

        {visibleMessages.map((message) => (
          <article className="message" key={message.id}>
            <Avatar initials={message.authorNickname.slice(0, 2).toUpperCase()} tone={message.authorId === userId ? 'green' : 'amber'} />
            <div>
              <header><strong>{message.authorNickname}</strong><time>{formatTime(message.createdAt)}</time>{message.editedAt ? <em>EDITADA</em> : null}</header>
              <p>{message.body}</p>
              {firstUrl(message.body) ? <a className="link-preview" href={firstUrl(message.body)} rel="noreferrer" target="_blank"><strong>{new URL(firstUrl(message.body)!).hostname}</strong><span>Abrir link em nova aba ↗</span></a> : null}
            </div>
          </article>
        ))}
        {!loading && !visibleMessages.length ? <p className="channel-empty">{query ? 'Nenhuma mensagem encontrada.' : 'Sem mensagens ainda. Abra o primeiro sinal.'}</p> : null}
      </div>

      <form className="composer" onSubmit={sendMessage}>
        <button type="button" aria-label="Adicionar anexo">+</button>
        <input aria-label="Mensagem" disabled={!activeChannel || sending} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={activeChannel ? `Transmitir em #${activeChannel.name}` : 'Escolha um canal de texto'} />
        <div className="composer-actions">
          <Hint label="Enviar presente"><button type="button" aria-label="Enviar presente"><GiftIcon /></button></Hint>
          <Hint label="Enviar GIF"><button className="composer-gif" type="button" aria-label="Enviar GIF">GIF</button></Hint>
          <Hint label="Emojis"><button type="button" aria-label="Emojis"><EmojiIcon /></button></Hint>
          <button className="composer-send" type="submit" aria-label="Enviar mensagem" disabled={!activeChannel || sending || !draft.trim()}>➤</button>
        </div>
      </form>
      {feedback ? <p className="composer-feedback" role="status">{feedback}</p> : null}
    </section>
  )
}
