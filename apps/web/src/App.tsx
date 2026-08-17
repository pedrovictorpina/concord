import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { ChannelSummary, VoicePreferences } from '@darkcord/contracts'
import './App.css'

const channels: ChannelSummary[] = [
  { id: 'geral', name: 'geral', kind: 'text' },
  { id: 'ideias', name: 'ideias-do-produto', kind: 'text' },
  { id: 'madrugada', name: 'sala-da-madrugada', kind: 'voice' },
]

type LocalMessage = {
  id: number
  author: string
  time: string
  body: string
  system?: boolean
}

const initialMessages: LocalMessage[] = [
  {
    id: 1,
    author: 'Darkcord Relay',
    time: 'agora',
    body: 'Fundacao sincronizada. O primeiro sinal da rede esta no ar.',
    system: true,
  },
  {
    id: 2,
    author: 'Produto',
    time: '16:42',
    body: 'A prioridade e direta: texto rapido, voz limpa e tela compartilhada sem atrito.',
  },
]

function App() {
  const [activeChannel, setActiveChannel] = useState('geral')
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [shareStream, setShareStream] = useState<MediaStream | null>(null)
  const [shareError, setShareError] = useState('')
  const [preferences, setPreferences] = useState<VoicePreferences>({
    microphoneEnabled: true,
    outputEnabled: true,
    screenShareEnabled: false,
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = shareStream
  }, [shareStream])

  useEffect(() => {
    return () => shareStream?.getTracks().forEach((track) => track.stop())
  }, [shareStream])

  const stopScreenShare = () => {
    shareStream?.getTracks().forEach((track) => track.stop())
    setShareStream(null)
    setPreferences((current) => ({ ...current, screenShareEnabled: false }))
  }

  const startScreenShare = async () => {
    setShareError('')

    if (!navigator.mediaDevices?.getDisplayMedia) {
      setShareError('Este navegador nao oferece captura de tela.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1280, max: 1280 },
          height: { ideal: 720, max: 720 },
          frameRate: { ideal: 15, max: 15 },
        },
        audio: true,
      })

      stream.getVideoTracks()[0]?.addEventListener('ended', stopScreenShare, {
        once: true,
      })
      setShareStream(stream)
      setPreferences((current) => ({ ...current, screenShareEnabled: true }))
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setShareError('Captura cancelada. Nenhuma tela foi compartilhada.')
        return
      }
      setShareError('Nao foi possivel iniciar a captura de tela.')
    }
  }

  const togglePreference = (
    key: 'microphoneEnabled' | 'outputEnabled',
  ) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
  }

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body) return

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        author: 'Voce',
        time: new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
        body,
      },
    ])
    setDraft('')
  }

  return (
    <main className="app-shell">
      <nav className="server-rail" aria-label="Servidores">
        <button className="server-mark active" type="button" aria-label="Darkcord">
          <span>D</span>
        </button>
        <div className="rail-line" />
        <button className="server-mark secondary" type="button" aria-label="Equipe zero">
          00
        </button>
        <button className="server-mark add" type="button" aria-label="Adicionar servidor">
          +
        </button>
        <span className="rail-version">A.00</span>
      </nav>

      <aside className="channel-panel">
        <header className="workspace-heading">
          <div>
            <span className="eyebrow">REDE PRIVADA</span>
            <strong>Darkcord</strong>
          </div>
          <button type="button" aria-label="Opcoes do servidor">•••</button>
        </header>

        <section className="channel-group">
          <p>TRANSMISSOES DE TEXTO</p>
          {channels
            .filter((channel) => channel.kind === 'text')
            .map((channel) => (
              <button
                className={activeChannel === channel.id ? 'channel active' : 'channel'}
                key={channel.id}
                type="button"
                onClick={() => setActiveChannel(channel.id)}
              >
                <span>#</span>
                {channel.name}
              </button>
            ))}
        </section>

        <section className="channel-group voice-group">
          <p>FREQUENCIAS DE VOZ</p>
          <button className="channel voice active" type="button">
            <span>◖</span>
            sala-da-madrugada
          </button>
          <div className="voice-member">
            <span className="avatar avatar-green">PV</span>
            <div><strong>Pedro</strong><small>ao vivo</small></div>
            <i aria-label="Microfone ligado">⌁</i>
          </div>
          <div className="voice-member muted">
            <span className="avatar avatar-amber">DC</span>
            <div><strong>Darkcord Bot</strong><small>monitorando</small></div>
            <i aria-label="Silenciado">×</i>
          </div>
        </section>

        <footer className="identity-strip">
          <span className="avatar avatar-green">PV</span>
          <div><strong>pedro</strong><small>@fundador</small></div>
          <span className="presence-dot" aria-label="Online" />
        </footer>
      </aside>

      <section className="transmission">
        <header className="transmission-header">
          <div className="channel-title">
            <span>#</span>
            <div><strong>{activeChannel}</strong><small>Fundacao e sinais do produto</small></div>
          </div>
          <div className="network-status"><i /> REDE ESTAVEL <span>24 ms</span></div>
        </header>

        <div className="messages" aria-live="polite">
          <div className="date-divider"><span>ETAPA 00 · 17 AGO 2026</span></div>
          <article className="launch-note">
            <span className="launch-index">00</span>
            <div>
              <span className="eyebrow">PRIMEIRO CONTATO</span>
              <h1>Menos ruido.<br />Mais presenca.</h1>
              <p>Este e o primeiro cliente executavel do Darkcord. Os controles abaixo ja validam composicao, responsividade e captura local de tela.</p>
            </div>
          </article>

          {messages.map((message) => (
            <article className={message.system ? 'message system' : 'message'} key={message.id}>
              <span className={message.system ? 'avatar avatar-signal' : 'avatar avatar-amber'}>
                {message.system ? '//' : message.author.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <header><strong>{message.author}</strong><time>{message.time}</time>{message.system && <em>SISTEMA</em>}</header>
                <p>{message.body}</p>
              </div>
            </article>
          ))}
        </div>

        <form className="composer" onSubmit={sendMessage}>
          <button type="button" aria-label="Adicionar anexo">+</button>
          <input
            aria-label="Mensagem"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Transmitir em #${activeChannel}`}
          />
          <span>ENTER ↵</span>
        </form>
      </section>

      <aside className="live-panel">
        <header>
          <div><span className="live-pulse" /> AO VIVO</div>
          <small>CANAL 03</small>
        </header>

        <div className={shareStream ? 'screen-stage sharing' : 'screen-stage'}>
          {shareStream ? (
            <video ref={videoRef} autoPlay muted playsInline />
          ) : (
            <div className="screen-placeholder">
              <span className="screen-icon"><i /><i /></span>
              <strong>Sua transmissao</strong>
              <p>Compartilhe uma janela ou tela inteira com o canal.</p>
            </div>
          )}
          {shareStream && <span className="capture-label">CAPTURA LOCAL</span>}
        </div>

        {shareError && <p className="share-error" role="status">{shareError}</p>}

        <button
          className={shareStream ? 'share-button stop' : 'share-button'}
          type="button"
          onClick={shareStream ? stopScreenShare : startScreenShare}
        >
          <span>{shareStream ? '■' : '▣'}</span>
          {shareStream ? 'Encerrar transmissao' : 'Compartilhar tela'}
        </button>

        <section className="quality-panel">
          <div><span>QUALIDADE</span><strong>720P · 15 ECO</strong></div>
          <div><span>ROTA DE MIDIA</span><strong className="pending">LOCAL / PROVA</strong></div>
          <div><span>CRIPTOGRAFIA</span><strong>PENDENTE</strong></div>
        </section>

        <footer className="voice-controls">
          <button
            className={preferences.microphoneEnabled ? '' : 'disabled'}
            type="button"
            onClick={() => togglePreference('microphoneEnabled')}
          >
            <span>{preferences.microphoneEnabled ? '⌁' : '×'}</span>
            {preferences.microphoneEnabled ? 'MIC ATIVO' : 'MIC MUDO'}
          </button>
          <button
            className={preferences.outputEnabled ? '' : 'disabled'}
            type="button"
            onClick={() => togglePreference('outputEnabled')}
          >
            <span>{preferences.outputEnabled ? '◖' : '×'}</span>
            {preferences.outputEnabled ? 'AUDIO ATIVO' : 'SEM AUDIO'}
          </button>
        </footer>
      </aside>
    </main>
  )
}

export default App
