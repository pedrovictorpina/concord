import { DropdownMenu } from 'radix-ui'
import type { ChannelSummary, ServerSummary, VoiceParticipant } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { Hint } from '../../components/ui/Hint'
import { MemberContextMenu } from './MemberContextMenu'
import { VoiceStateFlags } from './VoiceStateIcons'
import type { WorkspaceIdentity } from './workspace-types'

const statusFor = (participant: VoiceParticipant) => {
  if (!participant.outputEnabled) return 'sem áudio'
  if (!participant.microphoneEnabled) return 'sem microfone'
  if (participant.sharingScreen) return 'compartilhando tela'
  if (participant.speaking) return 'falando'
  return 'conectado'
}

type ChannelPanelProps = {
  activeChannelId: string | null
  activeVoiceChannelId: string | null
  channels: ChannelSummary[]
  connectedVoiceChannelId: string | null
  identity: WorkspaceIdentity
  mobileOpen: boolean
  onCloseMobile: () => void
  onChannelChange: (channelId: string) => void
  onCreateChannel: (kind: ChannelSummary['kind']) => void
  onLeaveServer: () => void
  onModerateMember: (memberId: string, action: 'ban' | 'timeout' | 'microphone' | 'audio') => Promise<{ ok: boolean; message: string }>
  onSetParticipantVolume: (userId: string, volume: number) => void
  onMarkServerRead: () => void
  onOpenInvite: () => void
  onOpenPermissions: () => void
  onOpenServerSettings: () => void
  onToggleMuted: () => void
  onVoiceChannelChange: (channelId: string) => void
  onOpenPeople: () => void
  server: ServerSummary | null
  serverMuted: boolean
  userId?: string
  volumeByUser: Record<string, number>
  unreadByChannel: Record<string, { count: number; mentioned: boolean }>
  voiceParticipantsByChannel: Record<string, VoiceParticipant[]>
}

export function ChannelPanel({ activeChannelId, activeVoiceChannelId, channels, connectedVoiceChannelId, identity, mobileOpen, onCloseMobile, onChannelChange, onCreateChannel, onLeaveServer, onMarkServerRead, onModerateMember, onSetParticipantVolume, onOpenInvite, onOpenPermissions, onOpenServerSettings, onToggleMuted, onVoiceChannelChange, onOpenPeople, server, serverMuted, unreadByChannel, userId, voiceParticipantsByChannel, volumeByUser }: ChannelPanelProps) {
  const canManage = server?.role === 'owner' || server?.role === 'moderator'

  return (
    <aside className={mobileOpen ? 'channel-panel mobile-open' : 'channel-panel'}>
      <header className="workspace-heading">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger aria-label="Abrir menu do servidor" className="server-menu-trigger">
            <span className="eyebrow">{server?.role === 'owner' ? 'VOCÊ É O DONO' : server?.role === 'moderator' ? 'VOCÊ MODERA' : 'SERVIDOR'}</span>
            <strong>{server?.name ?? 'Concord'}<i aria-hidden="true">⌄</i></strong>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="start" className="server-menu-content" sideOffset={10}>
              <DropdownMenu.Item onSelect={onOpenInvite}>Convidar pessoas</DropdownMenu.Item>
              <DropdownMenu.Item onSelect={onOpenServerSettings}>Configurações do servidor</DropdownMenu.Item>
              <DropdownMenu.Item onSelect={onOpenPermissions}>Cargos e permissões</DropdownMenu.Item>
              {canManage ? <>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={() => onCreateChannel('text')}>Criar canal de texto</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onCreateChannel('voice')}>Criar canal de voz</DropdownMenu.Item>
              </> : null}
              <DropdownMenu.Separator />
              <DropdownMenu.Item onSelect={onToggleMuted}>{serverMuted ? 'Reativar notificações' : 'Silenciar servidor'}</DropdownMenu.Item>
              <DropdownMenu.Item onSelect={onMarkServerRead}>Marcar como lido</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item className="danger" onSelect={onLeaveServer}>Sair do servidor</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <div className="workspace-actions"><button className="mobile-close" type="button" aria-label="Fechar canais" onClick={onCloseMobile}>←</button><Hint label="Convidar amigos"><button type="button" aria-label="Convidar amigos" onClick={onOpenInvite}>⊕</button></Hint><Hint label="Amigos e convites recebidos"><button type="button" aria-label="Amigos e convites" onClick={onOpenPeople}>◎</button></Hint></div>
      </header>

      <section className="channel-group">
        <p>TRANSMISSOES DE TEXTO{canManage ? <Hint label="Adicionar canal de texto"><button className="channel-add" type="button" aria-label="Adicionar canal de texto" onClick={() => onCreateChannel('text')}>+</button></Hint> : null}</p>
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
        <p>FREQUENCIAS DE VOZ{canManage ? <Hint label="Adicionar canal de voz"><button className="channel-add" type="button" aria-label="Adicionar canal de voz" onClick={() => onCreateChannel('voice')}>+</button></Hint> : null}</p>
        {channels.filter((channel) => channel.kind === 'voice').map((channel) => {
          const participants = voiceParticipantsByChannel[channel.id] ?? []
          const channelClasses = ['channel', 'voice']
          if (activeVoiceChannelId === channel.id) channelClasses.push('active')
          if (connectedVoiceChannelId === channel.id) channelClasses.push('connected')
          return (
            <div className="voice-channel" key={channel.id}>
              <button className={channelClasses.join(' ')} type="button" onClick={() => onVoiceChannelChange(channel.id)}><span>◖</span>{channel.name}{participants.length > 0 ? <i className="voice-count">{participants.length}</i> : null}</button>
              {participants.map((participant) => (
                <MemberContextMenu
                  canModerate={canManage && participant.userId !== userId}
                  canSetRole={false}
                  inVoice
                  isSelf={participant.userId === userId}
                  key={participant.userId}
                  onModerate={(action) => onModerateMember(participant.userId, action)}
                  onSetVolume={(volume) => onSetParticipantVolume(participant.userId, volume)}
                  target={{ userId: participant.userId, nickname: participant.nickname, username: participant.username }}
                  volume={volumeByUser[participant.userId] ?? 1}
                >
                  <div className={`voice-member${participant.microphoneEnabled ? '' : ' muted'}${participant.speaking ? ' speaking' : ''}`}>
                    <Avatar initials={participant.initials} url={participant.avatarUrl} />
                    <div><strong>{participant.nickname}</strong><small>{statusFor(participant)}</small></div>
                    <VoiceStateFlags microphoneEnabled={participant.microphoneEnabled} outputEnabled={participant.outputEnabled} sharingScreen={participant.sharingScreen} />
                  </div>
                </MemberContextMenu>
              ))}
            </div>
          )
        })}
      </section>

      <div className="channel-panel-footer">
        <footer className="identity-strip">
          <Avatar alt="Foto de perfil" initials={identity.initials} url={identity.avatarUrl} />
          <div><strong>{identity.nickname}</strong><small>@{identity.username} · {identity.connectionLabel}</small></div>
          <span className="presence-dot" aria-label="Online" />
        </footer>
      </div>
    </aside>
  )
}
