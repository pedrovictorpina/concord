import { useState } from 'react'
import { ChannelPanel } from './ChannelPanel'
import { ChatPanel } from './ChatPanel'
import { LivePanel } from './LivePanel'
import { ServerRail } from './ServerRail'
import { channels } from './workspace-data'
import type { WorkspaceIdentity } from './workspace-types'
import './WorkspaceShell.css'

type WorkspaceShellProps = {
  identity: WorkspaceIdentity
  onExit: () => void
}

export function WorkspaceShell({ identity, onExit }: WorkspaceShellProps) {
  const [activeChannel, setActiveChannel] = useState('geral')

  return (
    <main className="app-shell">
      <ServerRail />
      <ChannelPanel activeChannel={activeChannel} channels={channels} identity={identity} onChannelChange={setActiveChannel} onExit={onExit} />
      <ChatPanel activeChannel={activeChannel} />
      <LivePanel />
    </main>
  )
}
