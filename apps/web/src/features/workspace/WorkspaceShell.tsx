import { useEffect, useState } from 'react'
import { ChannelPanel } from './ChannelPanel'
import { ChatPanel } from './ChatPanel'
import { CreateServerDialog } from './CreateServerDialog'
import { LivePanel } from './LivePanel'
import { PeopleDialog } from './PeopleDialog'
import { ServerRail } from './ServerRail'
import type { WorkspaceIdentity } from './workspace-types'
import { useCommunityWorkspace } from './useCommunityWorkspace'
import './WorkspaceShell.css'

type WorkspaceShellProps = {
  demoMode: boolean
  identity: WorkspaceIdentity
  onExit: () => void
  userId?: string
}

export function WorkspaceShell({ demoMode, identity, onExit, userId }: WorkspaceShellProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [peopleDialogOpen, setPeopleDialogOpen] = useState(false)
  const [activeVoiceChannelId, setActiveVoiceChannelId] = useState<string | null>(null)
  const workspace = useCommunityWorkspace({ demoMode, userId })
  const activeVoiceChannel = workspace.channels.find((channel) => channel.id === activeVoiceChannelId && channel.kind === 'voice') ?? null

  useEffect(() => {
    if (!activeVoiceChannel && workspace.channels.some((channel) => channel.kind === 'voice')) {
      setActiveVoiceChannelId(workspace.channels.find((channel) => channel.kind === 'voice')?.id ?? null)
    }
  }, [activeVoiceChannel, workspace.channels])

  return (
    <main className="app-shell">
      <ServerRail
        activeServerId={workspace.activeServerId}
        servers={workspace.servers}
        onCreateServer={() => setCreateDialogOpen(true)}
        onServerChange={(serverId) => workspace.setActiveServerId(serverId)}
      />
      <ChannelPanel activeChannelId={workspace.activeChannelId} activeVoiceChannelId={activeVoiceChannelId} channels={workspace.channels} identity={identity} onChannelChange={workspace.setActiveChannelId} onExit={onExit} onOpenPeople={() => setPeopleDialogOpen(true)} onVoiceChannelChange={setActiveVoiceChannelId} server={workspace.activeServer} />
      <ChatPanel activeChannel={workspace.activeChannel} identity={identity} loading={workspace.loading} messages={workspace.messages} onSendMessage={workspace.sendMessage} server={workspace.activeServer} userId={userId} />
      <LivePanel demoMode={demoMode} voiceChannel={activeVoiceChannel} />
      {workspace.error ? <p className="workspace-error" role="status">{workspace.error}</p> : null}
      {createDialogOpen ? <CreateServerDialog onClose={() => setCreateDialogOpen(false)} onCreate={workspace.createServer} /> : null}
      {peopleDialogOpen ? <PeopleDialog friendRequests={workspace.friendRequests} friends={workspace.friends} onAcceptFriendRequest={workspace.acceptFriendRequest} onAcceptServerInvite={workspace.acceptServerInvite} onClose={() => setPeopleDialogOpen(false)} onSendFriendRequest={workspace.sendFriendRequest} onSendServerInvite={workspace.sendServerInvite} server={workspace.activeServer} serverInvites={workspace.serverInvites} /> : null}
    </main>
  )
}
