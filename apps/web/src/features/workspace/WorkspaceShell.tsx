import { useEffect, useState } from 'react'
import { DropdownMenu } from 'radix-ui'
import { ChannelPanel } from './ChannelPanel'
import { ChatPanel } from './ChatPanel'
import { CreateServerDialog } from './CreateServerDialog'
import { DirectMessagePanel } from './DirectMessagePanel'
import { FriendsHome } from './FriendsHome'
import { HomeSidebar } from './HomeSidebar'
import { LivePanel } from './LivePanel'
import { MemberPanel } from './MemberPanel'
import { InviteFriendsDialog } from './InviteFriendsDialog'
import { InviteLinkDialog } from './InviteLinkDialog'
import { PeopleDialog } from './PeopleDialog'
import { ServerRail } from './ServerRail'
import { SettingsDialog } from './SettingsDialog'
import { VoiceDock } from './VoiceDock'
import { ErrorToast } from '../../components/ui/ErrorToast'
import type { WorkspaceIdentity } from './workspace-types'
import type { PersonSummary } from '@concord/contracts'
import { useCommunityWorkspace } from './useCommunityWorkspace'
import { useFriendPresence } from './useFriendPresence'
import { useVoiceSession } from './useVoiceSession'
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
  const [inviteFriendsOpen, setInviteFriendsOpen] = useState(false)
  const [activeVoiceChannelId, setActiveVoiceChannelId] = useState<string | null>(null)
  const [directFriend, setDirectFriend] = useState<PersonSummary | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [channelCreationKind, setChannelCreationKind] = useState<'text' | 'voice' | null>(null)
  const [settingsTab, setSettingsTab] = useState<'profile' | 'channels' | 'server' | 'servers'>('profile')
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const [homeView, setHomeView] = useState<'friends' | 'requests'>('friends')
  const [homeTab, setHomeTab] = useState('online')
  const [inviteOpen, setInviteOpen] = useState(Boolean(inviteCode && !demoMode))
  const [localIdentity, setLocalIdentity] = useState(identity)
  const workspace = useCommunityWorkspace({ demoMode, userId, username: identity.username })
  const activeVoiceChannel = workspace.channels.find((channel) => channel.id === activeVoiceChannelId && channel.kind === 'voice') ?? null
  const voice = useVoiceSession({
    demoMode,
    identity: localIdentity,
    microphoneDisabled: workspace.voiceRestrictions.microphoneDisabled,
    observedServerId: workspace.activeServerId,
    outputDisabled: workspace.voiceRestrictions.outputDisabled,
    userId,
  })

  const friendPresence = useFriendPresence({
    demoMode,
    friends: workspace.friends,
    userId,
    voice: voice.target ? { channelName: voice.target.channelName, serverName: voice.target.serverName } : null,
  })

  useEffect(() => setLocalIdentity(identity), [identity])

  const openHomeRequests = () => { setDirectFriend(null); setHomeView('requests'); setHomeTab('pending') }
  const openHomeFriends = () => { setDirectFriend(null); setHomeView('friends'); setHomeTab('online') }
  const pendingCount = workspace.friendRequests.filter((request) => request.direction === 'received').length + workspace.serverInvites.length

  const openConnectedChannel = () => {
    if (!voice.target) return
    workspace.setActiveServerId(voice.target.serverId)
    setActiveVoiceChannelId(voice.target.channelId)
    setMobileNavigationOpen(false)
  }

  const joinVoiceChannel = (channel: { id: string; name: string }) => {
    if (!workspace.activeServer) return
    void voice.join({
      channelId: channel.id,
      channelName: channel.name,
      serverId: workspace.activeServer.id,
      serverName: workspace.activeServer.name,
    })
  }

  const saveProfile = async (profile: Pick<WorkspaceIdentity, 'nickname' | 'username' | 'avatarUrl'>) => {
    const result = onUpdateProfile ? await onUpdateProfile(profile) : { ok: true, message: 'Perfil atualizado localmente.' }
    if (result.ok) setLocalIdentity((current) => ({ ...current, ...profile, initials: profile.nickname.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() }))
    return result
  }

  return (
    <main className={workspace.activeServer ? 'app-shell' : 'app-shell home-shell'}>
      <ServerRail
        activeServerId={workspace.activeServerId}
        servers={workspace.servers}
        onCreateServer={() => setCreateDialogOpen(true)}
        onOpenSettings={() => { setSettingsTab('profile'); setSettingsOpen(true) }}
        onServerChange={(serverId) => workspace.setActiveServerId(serverId)}
      />
      {workspace.activeServer ? <><ChannelPanel activeChannelId={workspace.activeChannelId} activeVoiceChannelId={activeVoiceChannelId} channels={workspace.channels} connectedVoiceChannelId={voice.connectedChannelId} identity={localIdentity} mobileOpen={mobileNavigationOpen} onChannelChange={(channelId) => { workspace.setActiveChannelId(channelId); setActiveVoiceChannelId(null); setMobileNavigationOpen(false) }} onCloseMobile={() => setMobileNavigationOpen(false)} onCreateChannel={(kind) => { setMobileNavigationOpen(false); setChannelCreationKind(kind); setSettingsTab('channels'); setSettingsOpen(true) }} onOpenInvite={() => { setMobileNavigationOpen(false); setInviteFriendsOpen(true) }} onOpenServerSettings={() => { setMobileNavigationOpen(false); setSettingsTab('server'); setSettingsOpen(true) }} onOpenPeople={() => { setMobileNavigationOpen(false); setPeopleDialogOpen(true) }} onVoiceChannelChange={(channelId) => { setActiveVoiceChannelId(channelId); setMobileNavigationOpen(false) }} server={workspace.activeServer} unreadByChannel={workspace.unreadByChannel} voiceParticipantsByChannel={voice.participantsByChannel} />
        {activeVoiceChannel ? <LivePanel channel={activeVoiceChannel} connected={voice.connectedChannelId === activeVoiceChannel.id} connecting={voice.connecting} onJoin={() => joinVoiceChannel(activeVoiceChannel)} participants={voice.participantsByChannel[activeVoiceChannel.id] ?? []} screenShares={voice.screenShares} /> : <ChatPanel activeChannel={workspace.activeChannel} identity={localIdentity} loading={workspace.loading} messages={workspace.messages} onOpenMobileNavigation={() => setMobileNavigationOpen(true)} onSendMessage={workspace.sendMessage} server={workspace.activeServer} userId={userId} />}
        {activeVoiceChannel ? null : <MemberPanel members={workspace.members} server={workspace.activeServer} userId={userId} voiceParticipantsByChannel={voice.participantsByChannel} />}</> : <><HomeSidebar activeFriendId={directFriend?.id ?? null} friends={workspace.friends} identity={localIdentity} onOpenFriend={setDirectFriend} onOpenProfile={() => { setSettingsTab('profile'); setSettingsOpen(true) }} onOpenSearch={() => setPeopleDialogOpen(true)} onShowFriends={openHomeFriends} onShowRequests={openHomeRequests} pendingCount={pendingCount} presenceByUser={friendPresence} view={homeView} />
        {directFriend ? <DirectMessagePanel demoMode={demoMode} friend={directFriend} identity={localIdentity} onBack={() => setDirectFriend(null)} userId={userId} /> : <FriendsHome friendRequests={workspace.friendRequests} friends={workspace.friends} onAcceptFriendRequest={workspace.acceptFriendRequest} onAcceptServerInvite={workspace.acceptServerInvite} onOpenFriend={setDirectFriend} onSendFriendRequest={workspace.sendFriendRequest} onTabChange={(next) => { setHomeTab(next); setHomeView(next === 'pending' ? 'requests' : 'friends') }} presenceByUser={friendPresence} serverInvites={workspace.serverInvites} tab={homeTab} />}</>}
      <ErrorToast message={workspace.error} />
      {inviteFriendsOpen && workspace.activeServer ? <InviteFriendsDialog channelKind={activeVoiceChannel ? 'voice' : 'text'} channelName={activeVoiceChannel?.name ?? workspace.activeChannel?.name ?? null} friends={workspace.friends} inviteLinks={workspace.inviteLinks} members={workspace.members} onClose={() => setInviteFriendsOpen(false)} onCreateInviteLink={workspace.createInviteLink} onOpenPeople={() => { setInviteFriendsOpen(false); setPeopleDialogOpen(true) }} onSendServerInvite={workspace.sendServerInvite} server={workspace.activeServer} /> : null}
      {createDialogOpen ? <CreateServerDialog onClose={() => setCreateDialogOpen(false)} onCreate={workspace.createServer} /> : null}
      {peopleDialogOpen ? <PeopleDialog friendRequests={workspace.friendRequests} friends={workspace.friends} onAcceptFriendRequest={workspace.acceptFriendRequest} onAcceptServerInvite={workspace.acceptServerInvite} onClose={() => setPeopleDialogOpen(false)} onSendFriendRequest={workspace.sendFriendRequest} onSendServerInvite={workspace.sendServerInvite} server={workspace.activeServer} serverInvites={workspace.serverInvites} /> : null}
      {settingsOpen ? <SettingsDialog categories={workspace.categories} exitLabel={demoMode ? 'SAIR DA DEMONSTRAÇÃO' : 'SAIR DA CONTA'} onExit={onExit} channels={workspace.channels} channelPermissions={workspace.channelPermissions} identity={localIdentity} initialChannelKind={channelCreationKind ?? 'text'} initialTab={settingsTab} inviteLinks={workspace.inviteLinks} key={`${workspace.activeServerId}-${settingsTab}`} members={workspace.members} onClose={() => { setSettingsOpen(false); setChannelCreationKind(null); setSettingsTab('profile') }} onCreateCategory={workspace.createCategory} onCreateInviteLink={workspace.createInviteLink} onDeleteChannel={workspace.deleteChannel} onDeleteServer={workspace.deleteServer} onLeaveServer={workspace.leaveServer} onMarkServerRead={workspace.markServerRead} onModerateMember={workspace.moderateMember} onRevokeInviteLink={workspace.revokeInviteLink} onSaveChannel={workspace.saveChannel} onSaveChannelPermissions={workspace.saveChannelPermissions} onSaveProfile={saveProfile} onSaveServer={workspace.saveServer} onSaveServerNickname={workspace.saveServerNickname} onSelectServer={(serverId) => { workspace.setActiveServerId(serverId); setSettingsTab('server') }} onSetMemberRole={workspace.setMemberRole} onSetMuted={workspace.setMuted} onUploadAvatar={onUploadAvatar} server={workspace.activeServer} serverMuted={workspace.serverMuted} servers={workspace.servers} userId={userId} /> : null}
      {inviteOpen && inviteCode ? <InviteLinkDialog code={inviteCode} onAccept={workspace.redeemInviteLink} onClose={() => { setInviteOpen(false); const url = new URL(window.location.href); url.searchParams.delete('invite'); window.history.replaceState({}, '', `${url.pathname}${url.search}`) }} /> : null}
      {voice.target ? <VoiceDock audioBlocked={voice.audioBlocked} channelName={voice.target.channelName} demoMode={demoMode} error={voice.error} floating={!workspace.activeServer} notice={voice.notice} onEnableAudioPlayback={() => { void voice.enableAudioPlayback() }} microphoneDisabled={workspace.voiceRestrictions.microphoneDisabled} microphoneEnabled={voice.microphoneEnabled} onLeave={voice.leave} onOpenChannel={openConnectedChannel} onStartScreenShare={(quality) => { void voice.startScreenShare(quality) }} onStopScreenShare={voice.stopScreenShare} onToggleMicrophone={voice.toggleMicrophone} onToggleOutput={voice.toggleOutput} outputDisabled={workspace.voiceRestrictions.outputDisabled} outputEnabled={voice.outputEnabled} serverName={voice.target.serverName} sharing={voice.sharing} /> : null}
      <nav className="mobile-you-bar" aria-label="Navegação móvel">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild><button type="button" aria-label="Trocar servidor">◉ <span>Servidores</span></button></DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="start" className="mobile-servers-menu" side="top" sideOffset={10}>
              <DropdownMenu.Item onSelect={() => workspace.setActiveServerId(null)}>Mensagens</DropdownMenu.Item>
              {workspace.servers.map((server) => <DropdownMenu.Item key={server.id} onSelect={() => workspace.setActiveServerId(server.id)}>{server.name}</DropdownMenu.Item>)}
              <DropdownMenu.Separator />
              <DropdownMenu.Item onSelect={() => setCreateDialogOpen(true)}>Criar servidor</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <button type="button" onClick={() => setMobileNavigationOpen(true)}>☰ <span>Canais</span></button>
        <button type="button" onClick={() => workspace.setActiveServerId(null)}>● <span>Mensagens</span></button>
        <button type="button" onClick={() => { setSettingsTab('profile'); setSettingsOpen(true) }}>{localIdentity.avatarUrl ? <img src={localIdentity.avatarUrl} alt="" /> : localIdentity.initials}<span>Você</span></button>
      </nav>
    </main>
  )
}
