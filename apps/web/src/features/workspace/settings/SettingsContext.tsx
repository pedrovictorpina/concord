import type { ServerSummary } from '@concord/contracts'
import { Avatar } from '../../../components/ui/Avatar'
import type { VoiceProcessing } from '../voice-preferences'
import type { WorkspaceIdentity } from '../workspace-types'
import type { SettingsTab } from './SettingsNavigation'

const profileLabel: Record<VoiceProcessing['profile'], string> = {
  voice: 'Voz',
  studio: 'Estúdio',
  custom: 'Personalizado',
}

const roleLabel: Record<ServerSummary['role'], string> = {
  owner: 'Proprietário',
  moderator: 'Moderador',
  member: 'Membro',
}

type SettingsContextProps = {
  identity: WorkspaceIdentity
  server: ServerSummary | null
  serverMuted: boolean
  tab: SettingsTab
  voiceProcessing: VoiceProcessing
}

export function SettingsContext({ identity, server, serverMuted, tab, voiceProcessing }: SettingsContextProps) {
  if (tab === 'profile' || tab === 'session') {
    return (
      <aside className="settings-context">
        <h4>Resumo da conta</h4>
        <div className="settings-context-identity">
          <Avatar alt="Foto de perfil" initials={identity.initials} url={identity.avatarUrl} />
          <strong>{identity.nickname}</strong>
          <small>@{identity.username}</small>
        </div>
      </aside>
    )
  }

  if (tab === 'server' && server) {
    return (
      <aside className="settings-context">
        <h4>Servidor atual</h4>
        <div className="settings-context-card">
          <strong>{server.name}</strong>
          <span>{roleLabel[server.role]}</span>
          <span>{serverMuted ? 'Servidor silenciado' : 'Notificações ativas'}</span>
        </div>
      </aside>
    )
  }

  if (tab === 'voice') {
    return (
      <aside className="settings-context">
        <h4>Voz e áudio</h4>
        <div className="settings-context-card">
          <span>Microfone</span>
          <strong>{voiceProcessing.inputDeviceId ? 'Dispositivo selecionado' : 'Padrão do sistema'}</strong>
        </div>
        <div className="settings-context-card">
          <span>Saída</span>
          <strong>{voiceProcessing.outputDeviceId ? 'Dispositivo selecionado' : 'Padrão do sistema'}</strong>
        </div>
        <div className="settings-context-card">
          <span>Volume</span>
          <strong>{Math.round(voiceProcessing.outputVolume * 100)}%</strong>
        </div>
        <div className="settings-context-card">
          <span>Perfil de processamento</span>
          <strong>{profileLabel[voiceProcessing.profile]}</strong>
        </div>
      </aside>
    )
  }

  return null
}
