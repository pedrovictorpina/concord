import { useState } from 'react'
import type { FormEvent } from 'react'
import { initialMessages } from './workspace-data'

type ChatPanelProps = {
  activeChannel: string
}

export function ChatPanel({ activeChannel }: ChatPanelProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body) return

    setMessages((current) => [...current, {
      id: Date.now(),
      author: 'Voce',
      time: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
      body,
    }])
    setDraft('')
  }

  return (
    <section className="transmission">
      <header className="transmission-header">
        <div className="channel-title"><span>#</span><div><strong>{activeChannel}</strong><small>Fundacao e sinais do produto</small></div></div>
        <div className="network-status"><i /> REDE ESTAVEL <span>24 ms</span></div>
      </header>

      <div className="messages" aria-live="polite">
        <div className="date-divider"><span>ETAPA 01 · 17 AGO 2026</span></div>
        <article className="launch-note">
          <span className="launch-index">01</span>
          <div>
            <span className="eyebrow">IDENTIDADE MODULAR</span>
            <h1>Um sinal.<br />Muitos estilos.</h1>
            <p>Claro, escuro e sistema compartilham os mesmos componentes. Novas familias visuais entram por tokens, sem duplicar o produto.</p>
          </div>
        </article>

        {messages.map((message) => (
          <article className={message.system ? 'message system' : 'message'} key={message.id}>
            <span className={message.system ? 'avatar avatar-signal' : 'avatar avatar-amber'}>{message.system ? '//' : message.author.slice(0, 2).toUpperCase()}</span>
            <div>
              <header><strong>{message.author}</strong><time>{message.time}</time>{message.system ? <em>SISTEMA</em> : null}</header>
              <p>{message.body}</p>
            </div>
          </article>
        ))}
      </div>

      <form className="composer" onSubmit={sendMessage}>
        <button type="button" aria-label="Adicionar anexo">+</button>
        <input aria-label="Mensagem" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Transmitir em #${activeChannel}`} />
        <span>ENTER ↵</span>
      </form>
    </section>
  )
}
