import { useState } from 'react'
import { ChannelPanel } from './ChannelPanel'
import { ChatPanel } from './ChatPanel'
import { CreateServerDialog } from './CreateServerDialog'
import { LivePanel } from './LivePanel'
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
  const workspace = useCommunityWorkspace({ demoMode, userId })

  return (
    <main className="app-shell">
      <ServerRail
        activeServerId={workspace.activeServerId}
        servers={workspace.servers}
        onCreateServer={() => setCreateDialogOpen(true)}
        onServerChange={(serverId) => workspace.setActiveServerId(serverId)}
      />
      <ChannelPanel activeChannelId={workspace.activeChannelId} channels={workspace.channels} identity={identity} onChannelChange={workspace.setActiveChannelId} onExit={onExit} server={workspace.activeServer} />
      <ChatPanel activeChannel={workspace.activeChannel} identity={identity} loading={workspace.loading} messages={workspace.messages} onSendMessage={workspace.sendMessage} server={workspace.activeServer} userId={userId} />
      <LivePanel />
      {workspace.error ? <p className="workspace-error" role="status">{workspace.error}</p> : null}
      {createDialogOpen ? <CreateServerDialog onClose={() => setCreateDialogOpen(false)} onCreate={workspace.createServer} /> : null}
    </main>
  )
}
