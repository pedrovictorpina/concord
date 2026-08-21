import { useState } from 'react'
import { Tabs } from 'radix-ui'
import { Modal } from '../../components/ui/Modal'
import { VoiceSettings } from './VoiceSettings'
import type { VoiceProcessing } from './voice-preferences'
import type { ChannelPermission, ChannelSummary, PersonSummary, ServerMemberRole, ServerSummary } from '@concord/contracts'
import type { WorkspaceIdentity } from './workspace-types'
import { AccountSettings } from './settings/AccountSettings'
import { AppearanceSettings } from './settings/AppearanceSettings'
import { ChannelSettings } from './settings/ChannelSettings'
import { NotificationSettings } from './settings/NotificationSettings'
import { PermissionSettings } from './settings/PermissionSettings'
import { ServerListSettings } from './settings/ServerListSettings'
import { ServerSettings } from './settings/ServerSettings'
import { SessionSettings } from './settings/SessionSettings'
import { SettingsContext } from './settings/SettingsContext'
import { SettingsNavigation } from './settings/SettingsNavigation'
import type { SettingsTab } from './settings/SettingsNavigation'
import { BackIcon } from './WorkspaceIcons'
import './settings/settings.css'

type Result = { ok: boolean; message: string }
type SettingsDialogProps = {
  channels: ChannelSummary[]
  identity: WorkspaceIdentity
  initialChannelKind?: ChannelSummary['kind']
  initialTab?: SettingsTab
  onClose: () => void
  onExit: () => void
  exitLabel: string
  onDeleteChannel: (channelId: string) => Promise<Result>
  onDeleteServer: () => Promise<Result>
  onSaveChannel: (channel: { id?: string; name: string; kind: ChannelSummary['kind'] }) => Promise<Result>
  onSaveProfile?: (profile: Pick<WorkspaceIdentity, 'nickname' | 'username' | 'avatarUrl'>) => Promise<Result>
  onSaveServer: (name: string, description: string) => Promise<Result>
  onChangeVoiceProcessing: (value: VoiceProcessing) => void
  voiceProcessing: VoiceProcessing
  onSetMuted: (muted: boolean) => Promise<Result>
  onUploadAvatar?: (file: File) => Promise<{ ok: boolean; message: string; url?: string }>
  channelPermissions: ChannelPermission[]
  inviteLinks: Array<{ id: string; code: string; uses_count: number }>
  members: Array<PersonSummary & { role: ServerMemberRole }>
  onCreateInviteLink: () => Promise<{ ok: boolean; message: string; url: string }>
  onRevokeInviteLink: (linkId: string) => Promise<Result>
  onSaveChannelPermissions: (channelId: string, role: 'moderator' | 'member', permissions: Omit<ChannelPermission, 'channelId' | 'role'>) => Promise<Result>
  onSetMemberRole: (memberId: string, role: ServerMemberRole) => Promise<Result>
  categories: Array<{ id: string; name: string }>
  onCreateCategory: (name: string) => Promise<Result>
  onLeaveServer: () => Promise<Result>
  onMarkServerRead: () => Promise<Result>
  onModerateMember: (memberId: string, action: 'ban' | 'timeout' | 'microphone' | 'audio') => Promise<Result>
  onSaveServerNickname: (nickname: string) => Promise<Result>
  onSelectServer: (serverId: string) => void
  server: ServerSummary | null
  servers: ServerSummary[]
  serverMuted: boolean
  userId?: string
}

export type { SettingsTab }

export function SettingsDialog({ channels, exitLabel, identity, onChangeVoiceProcessing, voiceProcessing, initialChannelKind = 'text', initialTab = 'profile', onClose, onExit, onDeleteChannel, onDeleteServer, onSaveChannel, onSaveProfile, onSaveServer, onSetMuted, onUploadAvatar, channelPermissions, inviteLinks, members, onCreateInviteLink, onRevokeInviteLink, onSaveChannelPermissions, onSetMemberRole, categories, onCreateCategory, onLeaveServer, onMarkServerRead, onModerateMember, onSaveServerNickname, onSelectServer, server, servers, serverMuted, userId }: SettingsDialogProps) {
  const [tab, setTab] = useState<SettingsTab>(initialTab)
  const [mobileIndexOpen, setMobileIndexOpen] = useState(initialTab === 'profile')
  const owner = server?.role === 'owner'
  const canModerate = server?.role === 'owner' || server?.role === 'moderator'

  return (
    <Modal
      className={mobileIndexOpen ? 'settings-dialog settings-index-open' : 'settings-dialog'}
      closeLabel="Fechar configurações"
      eyebrow="CENTRO DE CONTROLE"
      onClose={onClose}
      title="Configurações."
    >
      <Tabs.Root className="settings-shell" onValueChange={(value) => setTab(value as SettingsTab)} value={tab}>
        <SettingsNavigation onAfterSelect={() => setMobileIndexOpen(false)} />
        <div className="settings-content">
          <button aria-label="Voltar para configurações" className="settings-mobile-back" type="button" onClick={() => setMobileIndexOpen(true)}><BackIcon /></button>
          <Tabs.Content value="profile"><AccountSettings identity={identity} onSaveProfile={onSaveProfile} onUploadAvatar={onUploadAvatar} /></Tabs.Content>
          <Tabs.Content value="appearance"><AppearanceSettings /></Tabs.Content>
          <Tabs.Content value="voice"><VoiceSettings onChange={onChangeVoiceProcessing} value={voiceProcessing} /></Tabs.Content>
          <Tabs.Content value="notifications"><NotificationSettings onSetMuted={onSetMuted} serverHasContext={Boolean(server)} serverMuted={serverMuted} /></Tabs.Content>
          <Tabs.Content value="servers"><ServerListSettings onSelectServer={onSelectServer} servers={servers} /></Tabs.Content>
          <Tabs.Content value="server">
            <ServerSettings
              identity={identity}
              inviteLinks={inviteLinks}
              onCreateInviteLink={onCreateInviteLink}
              onDeleteServer={onDeleteServer}
              onLeaveServer={onLeaveServer}
              onMarkServerRead={onMarkServerRead}
              onRevokeInviteLink={onRevokeInviteLink}
              onSaveServer={onSaveServer}
              onSaveServerNickname={onSaveServerNickname}
              server={server}
            />
          </Tabs.Content>
          <Tabs.Content value="channels">
            <ChannelSettings
              categories={categories}
              channels={channels}
              initialChannelKind={initialChannelKind}
              onCreateCategory={onCreateCategory}
              onDeleteChannel={onDeleteChannel}
              onSaveChannel={onSaveChannel}
              owner={owner}
            />
          </Tabs.Content>
          <Tabs.Content value="permissions">
            <PermissionSettings
              canModerate={canModerate}
              channelPermissions={channelPermissions}
              channels={channels}
              members={members}
              onModerateMember={onModerateMember}
              onSaveChannelPermissions={onSaveChannelPermissions}
              onSetMemberRole={onSetMemberRole}
              owner={owner}
              userId={userId}
            />
          </Tabs.Content>
          <Tabs.Content value="session"><SessionSettings exitLabel={exitLabel} onExit={onExit} /></Tabs.Content>
        </div>
        <SettingsContext identity={identity} server={server} serverMuted={serverMuted} tab={tab} voiceProcessing={voiceProcessing} />
      </Tabs.Root>
    </Modal>
  )
}
