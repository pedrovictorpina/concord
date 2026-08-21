import { useEffect, useState } from 'react'
import { DropdownMenu } from 'radix-ui'
import { ChannelPanel } from './ChannelPanel'
import { ChatPanel } from './ChatPanel'
import { CreateServerDialog } from './CreateServerDialog'
import { DirectMessagePanel } from './DirectMessagePanel'
import { FriendsHome } from './FriendsHome'
import type { FriendsHomeTab } from './FriendsHome'
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
import { readVoiceProcessing, writeVoiceProcessing } from './voice-preferences'
import type { VoiceProcessing } from './voice-preferences'
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
  const [settingsTab, setSettingsTab] = useState<'profile' | 'channels' | 'server' | 'servers' | 'permissions' | 'voice'>('profile')
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const [membersPanelVisible, setMembersPanelVisible] = useState(true)
  const [voiceChatVisible, setVoiceChatVisible] = useState(true)
  const [mobileMembersOpen, setMobileMembersOpen] = useState(false)
  const [homeView, setHomeView] = useState<'friends' | 'requests'>('friends')
  const [homeTab, setHomeTab] = useState<FriendsHomeTab>('friends')
  const [voiceProcessing, setVoiceProcessing] = useState<VoiceProcessing>(() => readVoiceProcessing())
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

  const changeVoiceProcessing = (next: VoiceProcessing) => {
    setVoiceProcessing(next)
    writeVoiceProcessing(next)
    void voice.applyVoiceProcessing(next)
  }

  const openHomeRequests = () => { setDirectFriend(null); setHomeView('requests'); setHomeTab('pending') }
  const openHomeFriends = () => { setDirectFriend(null); setHomeView('friends'); setHomeTab('friends') }
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

  const fourthColumnHidden = activeVoiceChannel ? !voiceChatVisible : !membersPanelVisible
  const shellClass = ['app-shell', workspace.activeServer ? '' : 'home-shell', workspace.activeServer && fourthColumnHidden ? 'members-collapsed' : ''].filter(Boolean).join(' ')

  return (
    <main className={shellClass}>
      <ServerRail
        activeServerId={workspace.activeServerId}
        servers={workspace.servers}
        onCreateServer={() => setCreateDialogOpen(true)}
        onOpenSettings={() => { setSettingsTab('profile'); setSettingsOpen(true) }}
        onServerChange={(serverId) => workspace.setActiveServerId(serverId)}
      />
      {workspace.activeServer ? <><ChannelPanel activeChannelId={workspace.activeChannelId} activeVoiceChannelId={activeVoiceChannelId} channels={workspace.channels} connectedVoiceChannelId={voice.connectedChannelId} identity={localIdentity} mobileOpen={mobileNavigationOpen} onChannelChange={(channelId) => { workspace.setActiveChannelId(channelId); setActiveVoiceChannelId(null); setMobileNavigationOpen(false); setMobileMembersOpen(false) }} onCloseMobile={() => setMobileNavigationOpen(false)} onCreateChannel={(kind) => { setMobileNavigationOpen(false); setChannelCreationKind(kind); setSettingsTab('channels'); setSettingsOpen(true) }} onLeaveServer={() => { setMobileNavigationOpen(false); void workspace.leaveServer() }} onMarkServerRead={() => { setMobileNavigationOpen(false); void workspace.markServerRead() }} onModerateMember={workspace.moderateMember} onSetParticipantVolume={voice.setParticipantVolume} onOpenInvite={() => { setMobileNavigationOpen(false); setInviteFriendsOpen(true) }} onOpenPermissions={() => { setMobileNavigationOpen(false); setSettingsTab('permissions'); setSettingsOpen(true) }} onOpenServerSettings={() => { setMobileNavigationOpen(false); setSettingsTab('server'); setSettingsOpen(true) }} onToggleMuted={() => { void workspace.setMuted(!workspace.serverMuted) }} serverMuted={workspace.serverMuted} onOpenPeople={() => { setMobileNavigationOpen(false); setPeopleDialogOpen(true) }} onVoiceChannelChange={(channelId) => { setActiveVoiceChannelId(channelId); workspace.setActiveChannelId(channelId); setMobileNavigationOpen(false); setMobileMembersOpen(false); const channel = workspace.channels.find((item) => item.id === channelId); if (channel && voice.connectedChannelId !== channelId) joinVoiceChannel(channel) }} server={workspace.activeServer} unreadByChannel={workspace.unreadByChannel} userId={userId} voiceParticipantsByChannel={voice.participantsByChannel} volumeByUser={voice.volumeByUser} />
        {activeVoiceChannel ? <LivePanel channel={activeVoiceChannel} chatVisible={voiceChatVisible} connected={voice.connectedChannelId === activeVoiceChannel.id} connecting={voice.connecting} identity={localIdentity} messages={workspace.messages} microphoneDisabled={workspace.voiceRestrictions.microphoneDisabled} microphoneEnabled={voice.microphoneEnabled} onJoin={() => joinVoiceChannel(activeVoiceChannel)} onLeave={voice.leave} onSendMessage={workspace.sendMessage} onSetParticipantVolume={voice.setParticipantVolume} onSetShareVolume={voice.setScreenAudioVolume} onStartScreenShare={(quality) => { void voice.startScreenShare(quality) }} onStopScreenShare={voice.stopScreenShare} onToggleChat={() => setVoiceChatVisible((current) => !current)} onToggleMicrophone={voice.toggleMicrophone} onToggleOutput={voice.toggleOutput} onToggleShareSound={voice.setScreenAudioSilenced} outputDisabled={workspace.voiceRestrictions.outputDisabled} outputEnabled={voice.outputEnabled} screenVolumeByUser={voice.screenVolumeByUser} onWatchShare={voice.setScreenShareWatched} screenAudioMuted={voice.screenAudioMuted} participants={voice.participantsByChannel[activeVoiceChannel.id] ?? []} screenShares={voice.screenShares} sharing={voice.sharing} userId={userId} volumeByUser={voice.volumeByUser} /> : <ChatPanel activeChannel={workspace.activeChannel} identity={localIdentity} loading={workspace.loading} membersPanelVisible={membersPanelVisible} messages={workspace.messages} onOpenMobileNavigation={() => setMobileNavigationOpen(true)} onSendMessage={workspace.sendMessage} onToggleMembersPanel={() => { if (window.matchMedia('(max-width: 760px)').matches) setMobileMembersOpen(true); else setMembersPanelVisible((current) => !current) }} server={workspace.activeServer} userId={userId} />}
        {activeVoiceChannel || !membersPanelVisible ? null : <MemberPanel members={workspace.members} mobileOpen={mobileMembersOpen} onCloseMobile={() => setMobileMembersOpen(false)} onModerateMember={workspace.moderateMember} onRemoveMember={workspace.removeMember} onSetMemberRole={workspace.setMemberRole} onTransferOwnership={workspace.transferOwnership} server={workspace.activeServer} userId={userId} voiceParticipantsByChannel={voice.participantsByChannel} />}</> : <><HomeSidebar activeFriendId={directFriend?.id ?? null} friends={workspace.friends} identity={localIdentity} onOpenFriend={setDirectFriend} onOpenProfile={() => { setSettingsTab('profile'); setSettingsOpen(true) }} onOpenSearch={() => setPeopleDialogOpen(true)} onShowFriends={openHomeFriends} onShowRequests={openHomeRequests} pendingCount={pendingCount} presenceByUser={friendPresence} view={homeView} />
        {directFriend ? <DirectMessagePanel demoMode={demoMode} friend={directFriend} identity={localIdentity} onBack={() => setDirectFriend(null)} presence={friendPresence[directFriend.id]} userId={userId} /> : <FriendsHome friendRequests={workspace.friendRequests} friends={workspace.friends} onAcceptFriendRequest={workspace.acceptFriendRequest} onAcceptServerInvite={workspace.acceptServerInvite} onOpenFriend={setDirectFriend} onSendFriendRequest={workspace.sendFriendRequest} onTabChange={(next) => { setHomeTab(next); setHomeView(next === 'pending' ? 'requests' : 'friends') }} presenceByUser={friendPresence} serverInvites={workspace.serverInvites} tab={homeTab} />}</>}
      <ErrorToast message={workspace.error} />
      {inviteFriendsOpen && workspace.activeServer ? <InviteFriendsDialog channelKind={activeVoiceChannel ? 'voice' : 'text'} channelName={activeVoiceChannel?.name ?? workspace.activeChannel?.name ?? null} friends={workspace.friends} inviteLinks={workspace.inviteLinks} members={workspace.members} onClose={() => setInviteFriendsOpen(false)} onCreateInviteLink={workspace.createInviteLink} onOpenPeople={() => { setInviteFriendsOpen(false); setPeopleDialogOpen(true) }} onSearchProfiles={workspace.searchProfiles} onSendServerInvite={workspace.sendServerInvite} server={workspace.activeServer} /> : null}
      {createDialogOpen ? <CreateServerDialog onClose={() => setCreateDialogOpen(false)} onCreate={workspace.createServer} /> : null}
      {peopleDialogOpen ? <PeopleDialog friendRequests={workspace.friendRequests} friends={workspace.friends} onAcceptFriendRequest={workspace.acceptFriendRequest} onAcceptServerInvite={workspace.acceptServerInvite} onClose={() => setPeopleDialogOpen(false)} onSendFriendRequest={workspace.sendFriendRequest} onSendServerInvite={workspace.sendServerInvite} server={workspace.activeServer} serverInvites={workspace.serverInvites} /> : null}
      {settingsOpen ? <SettingsDialog categories={workspace.categories} onChangeVoiceProcessing={changeVoiceProcessing} voiceProcessing={voiceProcessing} exitLabel={demoMode ? 'SAIR DA DEMONSTRAÇÃO' : 'SAIR DA CONTA'} onExit={onExit} channels={workspace.channels} channelPermissions={workspace.channelPermissions} identity={localIdentity} initialChannelKind={channelCreationKind ?? 'text'} initialTab={settingsTab} inviteLinks={workspace.inviteLinks} key={`${workspace.activeServerId}-${settingsTab}`} members={workspace.members} onClose={() => { setSettingsOpen(false); setChannelCreationKind(null); setSettingsTab('profile') }} onCreateCategory={workspace.createCategory} onCreateInviteLink={workspace.createInviteLink} onDeleteChannel={workspace.deleteChannel} onDeleteServer={workspace.deleteServer} onLeaveServer={workspace.leaveServer} onMarkServerRead={workspace.markServerRead} onModerateMember={workspace.moderateMember} onRevokeInviteLink={workspace.revokeInviteLink} onSaveChannel={workspace.saveChannel} onSaveChannelPermissions={workspace.saveChannelPermissions} onSaveProfile={saveProfile} onSaveServer={workspace.saveServer} onSaveServerNickname={workspace.saveServerNickname} onSelectServer={(serverId) => { workspace.setActiveServerId(serverId); setSettingsTab('server') }} onSetMemberRole={workspace.setMemberRole} onSetMuted={workspace.setMuted} onUploadAvatar={onUploadAvatar} server={workspace.activeServer} serverMuted={workspace.serverMuted} servers={workspace.servers} userId={userId} /> : null}
      {inviteOpen && inviteCode ? <InviteLinkDialog code={inviteCode} onAccept={workspace.redeemInviteLink} onInspect={workspace.inspectInviteLink} onClose={() => { setInviteOpen(false); const url = new URL(window.location.href); url.searchParams.delete('invite'); window.history.replaceState({}, '', `${url.pathname}${url.search}`) }} /> : null}
      {voice.target ? <VoiceDock audioBlocked={voice.audioBlocked} channelName={voice.target.channelName} compact={Boolean(workspace.activeServer && activeVoiceChannel && activeVoiceChannel.id === voice.target.channelId)} demoMode={demoMode} error={voice.error} floating={!workspace.activeServer} notice={voice.notice} onEnableAudioPlayback={() => { void voice.enableAudioPlayback() }} microphoneDisabled={workspace.voiceRestrictions.microphoneDisabled} microphoneEnabled={voice.microphoneEnabled} onLeave={voice.leave} onOpenChannel={openConnectedChannel} onStartScreenShare={(quality) => { void voice.startScreenShare(quality) }} onStopScreenShare={voice.stopScreenShare} onToggleMicrophone={voice.toggleMicrophone} onToggleOutput={voice.toggleOutput} outputDisabled={workspace.voiceRestrictions.outputDisabled} outputEnabled={voice.outputEnabled} serverName={voice.target.serverName} sharing={voice.sharing} /> : null}
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
