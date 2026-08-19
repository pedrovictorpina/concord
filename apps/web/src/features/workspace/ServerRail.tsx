import type { ServerSummary } from '@concord/contracts'

type ServerRailProps = {
  activeServerId: string | null
  onCreateServer: () => void
  onServerChange: (serverId: string | null) => void
  servers: ServerSummary[]
}

const serverInitials = (name: string) => name
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase()

export function ServerRail({ activeServerId, onCreateServer, onServerChange, servers }: ServerRailProps) {
  return (
    <nav className="server-rail" aria-label="Servidores">
      <button className={!activeServerId ? 'server-mark active' : 'server-mark'} type="button" aria-label="Inicio do Concord" onClick={() => onServerChange(null)}><span>C</span></button>
      {servers.length ? <div className="rail-line" /> : null}
      {servers.map((server) => (
        <button
          className={activeServerId === server.id ? 'server-mark active' : 'server-mark secondary'}
          key={server.id}
          type="button"
          aria-label={server.name}
          onClick={() => onServerChange(server.id)}
        >
          {serverInitials(server.name)}
        </button>
      ))}
      <button className="server-mark add" type="button" aria-label="Criar servidor" onClick={onCreateServer}>+</button>
      <span className="rail-version">A.02</span>
    </nav>
  )
}
