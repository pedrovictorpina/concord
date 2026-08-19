import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ChannelSummary, MessageSummary, ServerSummary } from '@concord/contracts'
import type { WorkspaceIdentity } from './workspace-types'

type ChatPanelProps = {
  activeChannel: ChannelSummary | null
  identity: WorkspaceIdentity
  loading: boolean
  messages: MessageSummary[]
  onSendMessage: (body: string, authorNickname: string) => Promise<{ ok: boolean; message: string }>
  server: ServerSummary | null
  userId?: string
}

const formatTime = (value: string) => new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(value))

export function ChatPanel({ activeChannel, identity, loading, messages, onSendMessage, server, userId }: ChatPanelProps) {
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState('')

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
        <div className="channel-title"><span>#</span><div><strong>{activeChannel?.name ?? 'canal'}</strong><small>{server.description || 'Conversa direta do servidor'}</small></div></div>
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

        {messages.map((message) => (
          <article className="message" key={message.id}>
            <span className={message.authorId === userId ? 'avatar avatar-green' : 'avatar avatar-amber'}>{message.authorNickname.slice(0, 2).toUpperCase()}</span>
            <div>
              <header><strong>{message.authorNickname}</strong><time>{formatTime(message.createdAt)}</time>{message.editedAt ? <em>EDITADA</em> : null}</header>
              <p>{message.body}</p>
            </div>
          </article>
        ))}
        {!loading && !messages.length ? <p className="channel-empty">Sem mensagens ainda. Abra o primeiro sinal.</p> : null}
      </div>

      <form className="composer" onSubmit={sendMessage}>
        <button type="button" aria-label="Adicionar anexo">+</button>
        <input aria-label="Mensagem" disabled={!activeChannel || sending} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={activeChannel ? `Transmitir em #${activeChannel.name}` : 'Escolha um canal de texto'} />
        <span>{sending ? 'ENVIANDO' : 'ENTER ↵'}</span>
      </form>
      {feedback ? <p className="composer-feedback" role="status">{feedback}</p> : null}
    </section>
  )
}
