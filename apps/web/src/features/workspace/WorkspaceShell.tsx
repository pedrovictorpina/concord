import { useState } from 'react'
import { ChannelPanel } from './ChannelPanel'
import { ChatPanel } from './ChatPanel'
import { LivePanel } from './LivePanel'
import { ServerRail } from './ServerRail'
import { channels } from './workspace-data'
import './WorkspaceShell.css'

type WorkspaceShellProps = {
  onExit: () => void
}

export function WorkspaceShell({ onExit }: WorkspaceShellProps) {
  const [activeChannel, setActiveChannel] = useState('geral')

  return (
    <main className="app-shell">
      <ServerRail />
      <ChannelPanel activeChannel={activeChannel} channels={channels} onChannelChange={setActiveChannel} onExit={onExit} />
      <ChatPanel activeChannel={activeChannel} />
      <LivePanel />
    </main>
  )
}
