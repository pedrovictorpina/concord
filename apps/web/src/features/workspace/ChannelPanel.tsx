import type { ChannelSummary, ServerSummary } from '@concord/contracts'
import { ThemeControls } from '../../components/theme/ThemeControls'
import type { WorkspaceIdentity } from './workspace-types'

type ChannelPanelProps = {
  activeChannelId: string | null
  channels: ChannelSummary[]
  identity: WorkspaceIdentity
  onChannelChange: (channelId: string) => void
  onExit: () => void
  server: ServerSummary | null
}

export function ChannelPanel({ activeChannelId, channels, identity, onChannelChange, onExit, server }: ChannelPanelProps) {
  return (
    <aside className="channel-panel">
      <header className="workspace-heading">
        <div><span className="eyebrow">SERVIDOR PRIVADO</span><strong>{server?.name ?? 'Concord'}</strong></div>
        <button type="button" aria-label="Sair do Concord" onClick={onExit}>×</button>
      </header>

      <section className="channel-group">
        <p>TRANSMISSOES DE TEXTO</p>
        {channels.filter((channel) => channel.kind === 'text').map((channel) => (
          <button
            className={activeChannelId === channel.id ? 'channel active' : 'channel'}
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
        {channels.filter((channel) => channel.kind === 'voice').map((channel) => (
          <button className="channel voice" key={channel.id} type="button"><span>◖</span>{channel.name}</button>
        ))}
        <div className="voice-member">
          <span className="avatar avatar-green">{identity.initials}</span>
          <div><strong>{identity.nickname}</strong><small>ao vivo</small></div><i aria-label="Microfone ligado">⌁</i>
        </div>
        <div className="voice-member muted">
          <span className="avatar avatar-amber">DC</span>
          <div><strong>Concord Bot</strong><small>monitorando</small></div><i aria-label="Silenciado">×</i>
        </div>
      </section>

      <div className="workspace-theme-control"><ThemeControls compact /></div>
      <footer className="identity-strip">
        <span className="avatar avatar-green">{identity.initials}</span>
        <div><strong>{identity.nickname}</strong><small>@{identity.username} · {identity.connectionLabel}</small></div>
        <span className="presence-dot" aria-label="Online" />
      </footer>
    </aside>
  )
}
