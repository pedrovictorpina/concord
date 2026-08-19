import type { ChannelSummary, ServerSummary } from '@concord/contracts'
import type { ReactNode } from 'react'
import type { WorkspaceIdentity } from './workspace-types'

type ChannelPanelProps = {
  activeChannelId: string | null
  activeVoiceChannelId: string | null
  channels: ChannelSummary[]
  identity: WorkspaceIdentity
  mobileOpen: boolean
  onCloseMobile: () => void
  onChannelChange: (channelId: string) => void
  onCreateChannel: (kind: ChannelSummary['kind']) => void
  onVoiceChannelChange: (channelId: string) => void
  onExit: () => void
  onOpenPeople: () => void
  server: ServerSummary | null
  unreadByChannel: Record<string, { count: number; mentioned: boolean }>
  voiceParticipantChannelId: string | null
  voicePanel: ReactNode
}

export function ChannelPanel({ activeChannelId, activeVoiceChannelId, channels, identity, mobileOpen, onCloseMobile, onChannelChange, onCreateChannel, onVoiceChannelChange, onExit, onOpenPeople, server, unreadByChannel, voiceParticipantChannelId, voicePanel }: ChannelPanelProps) {
  return (
    <aside className={mobileOpen ? 'channel-panel mobile-open' : 'channel-panel'}>
      <header className="workspace-heading">
        <div><span className="eyebrow">SERVIDOR PRIVADO</span><strong>{server?.name ?? 'Concord'}</strong></div>
        <div className="workspace-actions"><button className="mobile-close" type="button" aria-label="Fechar canais" onClick={onCloseMobile}>←</button><button type="button" aria-label="Amigos e convites" onClick={onOpenPeople}>◎</button><button type="button" aria-label="Sair do Concord" onClick={onExit}>×</button></div>
      </header>

      <section className="channel-group">
        <p>TRANSMISSOES DE TEXTO{server?.role === 'owner' ? <button className="channel-add" type="button" aria-label="Adicionar canal de texto" data-tooltip="Adicionar canal de texto" onClick={() => onCreateChannel('text')}>+</button> : null}</p>
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
        <p>FREQUENCIAS DE VOZ{server?.role === 'owner' ? <button className="channel-add" type="button" aria-label="Adicionar canal de voz" data-tooltip="Adicionar canal de voz" onClick={() => onCreateChannel('voice')}>+</button> : null}</p>
        {channels.filter((channel) => channel.kind === 'voice').map((channel) => (
          <div className="voice-channel" key={channel.id}>
            <button className={activeVoiceChannelId === channel.id ? 'channel voice active' : 'channel voice'} type="button" onClick={() => onVoiceChannelChange(channel.id)}><span>◖</span>{channel.name}</button>
            {voiceParticipantChannelId === channel.id ? <div className="voice-member"><span className="avatar avatar-green">{identity.initials}</span><div><strong>{identity.nickname}</strong><small>conectado</small></div><i aria-label="Microfone ligado">⌁</i></div> : null}
          </div>
        ))}
      </section>

      <div className="channel-panel-footer">
        {voicePanel}
        <footer className="identity-strip">
          {identity.avatarUrl ? <img className="avatar avatar-photo" src={identity.avatarUrl} alt="Foto de perfil" /> : <span className="avatar avatar-green">{identity.initials}</span>}
          <div><strong>{identity.nickname}</strong><small>@{identity.username} · {identity.connectionLabel}</small></div>
          <span className="presence-dot" aria-label="Online" />
        </footer>
      </div>
    </aside>
  )
}
