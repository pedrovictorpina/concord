import type { ChannelSummary, ServerSummary } from '@concord/contracts'
import { ThemeControls } from '../../components/theme/ThemeControls'
import type { WorkspaceIdentity } from './workspace-types'

type ChannelPanelProps = {
  activeChannelId: string | null
  activeVoiceChannelId: string | null
  channels: ChannelSummary[]
  identity: WorkspaceIdentity
  onChannelChange: (channelId: string) => void
  onVoiceChannelChange: (channelId: string) => void
  onExit: () => void
  onOpenPeople: () => void
  onOpenSettings: () => void
  server: ServerSummary | null
  unreadByChannel: Record<string, { count: number; mentioned: boolean }>
}

export function ChannelPanel({ activeChannelId, activeVoiceChannelId, channels, identity, onChannelChange, onVoiceChannelChange, onExit, onOpenPeople, onOpenSettings, server, unreadByChannel }: ChannelPanelProps) {
  return (
    <aside className="channel-panel">
      <header className="workspace-heading">
        <div><span className="eyebrow">SERVIDOR PRIVADO</span><strong>{server?.name ?? 'Concord'}</strong></div>
        <div className="workspace-actions"><button type="button" aria-label="Amigos e convites" onClick={onOpenPeople}>◎</button><button type="button" aria-label="Abrir configurações" onClick={onOpenSettings}>⚙</button><button type="button" aria-label="Sair do Concord" onClick={onExit}>×</button></div>
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
            <span>#</span>{channel.name}{unreadByChannel[channel.id] ? <i className={unreadByChannel[channel.id].mentioned ? 'channel-badge mention' : 'channel-badge'}>{unreadByChannel[channel.id].mentioned ? '@' : unreadByChannel[channel.id].count}</i> : null}
          </button>
        ))}
      </section>

      <section className="channel-group voice-group">
        <p>FREQUENCIAS DE VOZ</p>
        {channels.filter((channel) => channel.kind === 'voice').map((channel) => (
          <button className={activeVoiceChannelId === channel.id ? 'channel voice active' : 'channel voice'} key={channel.id} type="button" onClick={() => onVoiceChannelChange(channel.id)}><span>◖</span>{channel.name}</button>
        ))}
        <div className="voice-member">
          {identity.avatarUrl ? <img className="avatar avatar-photo" src={identity.avatarUrl} alt="" /> : <span className="avatar avatar-green">{identity.initials}</span>}
          <div><strong>{identity.nickname}</strong><small>ao vivo</small></div><i aria-label="Microfone ligado">⌁</i>
        </div>
        <div className="voice-member muted">
          <span className="avatar avatar-amber">DC</span>
          <div><strong>Concord Bot</strong><small>monitorando</small></div><i aria-label="Silenciado">×</i>
        </div>
      </section>

      <div className="workspace-theme-control"><ThemeControls compact /></div>
      <footer className="identity-strip">
        {identity.avatarUrl ? <img className="avatar avatar-photo" src={identity.avatarUrl} alt="Foto de perfil" /> : <span className="avatar avatar-green">{identity.initials}</span>}
        <div><strong>{identity.nickname}</strong><small>@{identity.username} · {identity.connectionLabel}</small></div>
        <span className="presence-dot" aria-label="Online" />
      </footer>
    </aside>
  )
}
