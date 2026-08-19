import { useEffect, useState } from 'react'
import { ChannelPanel } from './ChannelPanel'
import { ChatPanel } from './ChatPanel'
import { CreateServerDialog } from './CreateServerDialog'
import { LivePanel } from './LivePanel'
import { InviteLinkDialog } from './InviteLinkDialog'
import { PeopleDialog } from './PeopleDialog'
import { ServerRail } from './ServerRail'
import { SettingsDialog } from './SettingsDialog'
import type { WorkspaceIdentity } from './workspace-types'
import { useCommunityWorkspace } from './useCommunityWorkspace'
import './WorkspaceShell.css'

type WorkspaceShellProps = {
  demoMode: boolean
  identity: WorkspaceIdentity
  onExit: () => void
  onUpdateProfile?: (profile: Pick<WorkspaceIdentity, 'nickname' | 'username' | 'avatarUrl'>) => Promise<{ ok: boolean; message: string }>
  onUploadAvatar?: (file: File) => Promise<{ ok: boolean; message: string; url?: string }>
  inviteCode?: string | null
  userId?: string
}

export function WorkspaceShell({ demoMode, identity, onExit, onUpdateProfile, onUploadAvatar, inviteCode, userId }: WorkspaceShellProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [peopleDialogOpen, setPeopleDialogOpen] = useState(false)
  const [activeVoiceChannelId, setActiveVoiceChannelId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(Boolean(inviteCode && !demoMode))
  const [localIdentity, setLocalIdentity] = useState(identity)
  const workspace = useCommunityWorkspace({ demoMode, userId, username: identity.username })
  const activeVoiceChannel = workspace.channels.find((channel) => channel.id === activeVoiceChannelId && channel.kind === 'voice') ?? null

  useEffect(() => {
    if (!activeVoiceChannel && workspace.channels.some((channel) => channel.kind === 'voice')) {
      setActiveVoiceChannelId(workspace.channels.find((channel) => channel.kind === 'voice')?.id ?? null)
    }
  }, [activeVoiceChannel, workspace.channels])

  useEffect(() => setLocalIdentity(identity), [identity])

  const saveProfile = async (profile: Pick<WorkspaceIdentity, 'nickname' | 'username' | 'avatarUrl'>) => {
    const result = onUpdateProfile ? await onUpdateProfile(profile) : { ok: true, message: 'Perfil atualizado localmente.' }
    if (result.ok) setLocalIdentity((current) => ({ ...current, ...profile, initials: profile.nickname.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() }))
    return result
  }

  return (
    <main className="app-shell">
      <ServerRail
        activeServerId={workspace.activeServerId}
        servers={workspace.servers}
        onCreateServer={() => setCreateDialogOpen(true)}
        onServerChange={(serverId) => workspace.setActiveServerId(serverId)}
      />
      <ChannelPanel activeChannelId={workspace.activeChannelId} activeVoiceChannelId={activeVoiceChannelId} channels={workspace.channels} identity={localIdentity} mobileOpen={mobileNavigationOpen} onChannelChange={(channelId) => { workspace.setActiveChannelId(channelId); setMobileNavigationOpen(false) }} onCloseMobile={() => setMobileNavigationOpen(false)} onExit={onExit} onOpenPeople={() => setPeopleDialogOpen(true)} onOpenSettings={() => setSettingsOpen(true)} onVoiceChannelChange={(channelId) => { setActiveVoiceChannelId(channelId); setMobileNavigationOpen(false) }} server={workspace.activeServer} unreadByChannel={workspace.unreadByChannel} />
      <ChatPanel activeChannel={workspace.activeChannel} identity={localIdentity} loading={workspace.loading} messages={workspace.messages} onOpenMobileNavigation={() => setMobileNavigationOpen(true)} onSendMessage={workspace.sendMessage} server={workspace.activeServer} userId={userId} />
      <LivePanel demoMode={demoMode} voiceChannel={activeVoiceChannel} />
      {workspace.error ? <p className="workspace-error" role="status">{workspace.error}</p> : null}
      {createDialogOpen ? <CreateServerDialog onClose={() => setCreateDialogOpen(false)} onCreate={workspace.createServer} /> : null}
      {peopleDialogOpen ? <PeopleDialog friendRequests={workspace.friendRequests} friends={workspace.friends} onAcceptFriendRequest={workspace.acceptFriendRequest} onAcceptServerInvite={workspace.acceptServerInvite} onClose={() => setPeopleDialogOpen(false)} onSendFriendRequest={workspace.sendFriendRequest} onSendServerInvite={workspace.sendServerInvite} server={workspace.activeServer} serverInvites={workspace.serverInvites} /> : null}
      {settingsOpen ? <SettingsDialog categories={workspace.categories} channels={workspace.channels} channelPermissions={workspace.channelPermissions} identity={localIdentity} inviteLinks={workspace.inviteLinks} members={workspace.members} onClose={() => setSettingsOpen(false)} onCreateCategory={workspace.createCategory} onCreateInviteLink={workspace.createInviteLink} onDeleteChannel={workspace.deleteChannel} onLeaveServer={workspace.leaveServer} onMarkServerRead={workspace.markServerRead} onRevokeInviteLink={workspace.revokeInviteLink} onSaveChannel={workspace.saveChannel} onSaveChannelPermissions={workspace.saveChannelPermissions} onSaveProfile={saveProfile} onSaveServer={workspace.saveServer} onSaveServerNickname={workspace.saveServerNickname} onSetMemberRole={workspace.setMemberRole} onSetMuted={workspace.setMuted} onUploadAvatar={onUploadAvatar} server={workspace.activeServer} serverMuted={workspace.serverMuted} userId={userId} /> : null}
      {inviteOpen && inviteCode ? <InviteLinkDialog code={inviteCode} onAccept={workspace.redeemInviteLink} onClose={() => { setInviteOpen(false); const url = new URL(window.location.href); url.searchParams.delete('invite'); window.history.replaceState({}, '', `${url.pathname}${url.search}`) }} /> : null}
      <nav className="mobile-you-bar" aria-label="Navegação móvel"><button type="button" onClick={() => setMobileNavigationOpen(true)}>☰ <span>Canais</span></button><button type="button" onClick={() => setPeopleDialogOpen(true)}>◎ <span>Pessoas</span></button><button type="button" onClick={() => setSettingsOpen(true)}>{localIdentity.avatarUrl ? <img src={localIdentity.avatarUrl} alt="" /> : localIdentity.initials}<span>Você</span></button></nav>
    </main>
  )
}
