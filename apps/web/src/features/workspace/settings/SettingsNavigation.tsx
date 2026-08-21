import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { Tabs } from 'radix-ui'
import { BellIcon, ChevronDownIcon, CompassIcon, HashIcon, LogoutIcon, PaletteIcon, PersonIcon, SearchIcon, ServerIcon, ShieldIcon, SpeakerIcon } from '../WorkspaceIcons'

export type SettingsTab =
  | 'profile'
  | 'appearance'
  | 'voice'
  | 'servers'
  | 'server'
  | 'channels'
  | 'notifications'
  | 'permissions'
  | 'session'

type NavItem = { id: SettingsTab; keywords: string; label: string }
type NavGroup = { items: readonly NavItem[]; title: string }

const icons: Record<SettingsTab, ComponentType> = {
  profile: PersonIcon,
  appearance: PaletteIcon,
  voice: SpeakerIcon,
  notifications: BellIcon,
  servers: ServerIcon,
  server: CompassIcon,
  channels: HashIcon,
  permissions: ShieldIcon,
  session: LogoutIcon,
}

const navGroups: readonly NavGroup[] = [
  { title: 'Conta', items: [{ id: 'profile', label: 'Minha conta', keywords: 'perfil apelido usuario avatar foto' }] },
  {
    title: 'Preferências',
    items: [
      { id: 'appearance', label: 'Aparência', keywords: 'tema claro escuro sistema cores' },
      { id: 'voice', label: 'Voz e áudio', keywords: 'microfone saida volume supressao ruido eco' },
      { id: 'notifications', label: 'Notificações', keywords: 'silenciar alertas' },
    ],
  },
  {
    title: 'Servidores',
    items: [
      { id: 'servers', label: 'Meus servidores', keywords: 'gerenciar comunidade' },
      { id: 'server', label: 'Servidor atual', keywords: 'nome descricao apelido convite link excluir sair' },
      { id: 'channels', label: 'Canais', keywords: 'categoria texto voz criar editar remover' },
      { id: 'permissions', label: 'Permissões', keywords: 'cargo moderador membro moderacao banir' },
    ],
  },
  { title: 'Sessão', items: [{ id: 'session', label: 'Sair da conta', keywords: 'logout encerrar' }] },
]

type SettingsNavigationProps = {
  onAfterSelect?: () => void
}

export function SettingsNavigation({ onAfterSelect }: SettingsNavigationProps) {
  const [query, setQuery] = useState('')

  const filteredGroups = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return navGroups
    return navGroups
      .map((group) => ({ ...group, items: group.items.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(term)) }))
      .filter((group) => group.items.length > 0)
  }, [query])

  return (
    <div className="settings-nav">
      <label className="settings-search">
        <SearchIcon />
        <input placeholder="Buscar configurações..." type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar configurações" />
      </label>
      <div className="settings-nav-groups">
        {filteredGroups.map((group) => (
          <section className="settings-nav-group" key={group.title}>
            <h4>{group.title}</h4>
            <Tabs.List aria-label={group.title} className="settings-nav-list">
              {group.items.map((item) => {
                const Icon = icons[item.id]
                return (
                  <Tabs.Trigger className="settings-nav-item" key={item.id} value={item.id} onClick={onAfterSelect}>
                    <Icon />
                    <span>{item.label}</span>
                    <i className="settings-nav-chevron" aria-hidden="true"><ChevronDownIcon /></i>
                  </Tabs.Trigger>
                )
              })}
            </Tabs.List>
          </section>
        ))}
        {filteredGroups.length === 0 ? <p className="settings-nav-empty">Nenhuma configuração encontrada.</p> : null}
      </div>
    </div>
  )
}
