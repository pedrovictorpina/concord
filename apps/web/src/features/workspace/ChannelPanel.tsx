import type { ChannelSummary } from '@concord/contracts'
import { ThemeControls } from '../../components/theme/ThemeControls'

type ChannelPanelProps = {
  activeChannel: string
  channels: ChannelSummary[]
  onChannelChange: (channelId: string) => void
  onExit: () => void
}

export function ChannelPanel({ activeChannel, channels, onChannelChange, onExit }: ChannelPanelProps) {
  return (
    <aside className="channel-panel">
      <header className="workspace-heading">
        <div><span className="eyebrow">REDE PRIVADA</span><strong>Concord</strong></div>
        <button type="button" aria-label="Sair da demonstracao" onClick={onExit}>×</button>
      </header>

      <section className="channel-group">
        <p>TRANSMISSOES DE TEXTO</p>
        {channels.filter((channel) => channel.kind === 'text').map((channel) => (
          <button
            className={activeChannel === channel.id ? 'channel active' : 'channel'}
            key={channel.id}
            type="button"
            onClick={() => onChannelChange(channel.id)}
          >
            <span>#</span>{channel.name}
          </button>
        ))}
      </section>

      <section className="channel-group voice-group">
        <p>FREQUENCIAS DE VOZ</p>
        <button className="channel voice active" type="button"><span>◖</span>sala-da-madrugada</button>
        <div className="voice-member">
          <span className="avatar avatar-green">PV</span>
          <div><strong>Pedro</strong><small>ao vivo</small></div><i aria-label="Microfone ligado">⌁</i>
        </div>
        <div className="voice-member muted">
          <span className="avatar avatar-amber">DC</span>
          <div><strong>Concord Bot</strong><small>monitorando</small></div><i aria-label="Silenciado">×</i>
        </div>
      </section>

      <div className="workspace-theme-control"><ThemeControls compact /></div>
      <footer className="identity-strip">
        <span className="avatar avatar-green">PV</span>
        <div><strong>pedro</strong><small>@fundador</small></div>
        <span className="presence-dot" aria-label="Online" />
      </footer>
    </aside>
  )
}
