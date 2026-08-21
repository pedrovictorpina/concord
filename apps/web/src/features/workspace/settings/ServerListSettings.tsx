import type { ServerSummary } from '@concord/contracts'

const roleLabel: Record<ServerSummary['role'], string> = {
  owner: 'Proprietário',
  moderator: 'Moderador',
  member: 'Membro',
}

type ServerListSettingsProps = {
  onSelectServer: (serverId: string) => void
  servers: ServerSummary[]
}

export function ServerListSettings({ onSelectServer, servers }: ServerListSettingsProps) {
  return (
    <section className="server-list-settings">
      <h1>Meus servidores</h1>
      <p>Gerencie os servidores dos quais você participa.</p>
      <div className="server-list-cards">
        {servers.map((item) => (
          <div className="server-list-card" key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <span className="server-role-badge">{roleLabel[item.role]}</span>
            </div>
            <button className="settings-button subdued" type="button" onClick={() => onSelectServer(item.id)}>Gerenciar</button>
          </div>
        ))}
        {servers.length === 0 ? <p className="settings-empty-hint">Você ainda não participa de nenhum servidor.</p> : null}
      </div>
    </section>
  )
}
