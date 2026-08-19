import { useState } from 'react'
import type { FormEvent } from 'react'
import { Tabs } from 'radix-ui'
import { Choice } from '../../components/ui/Choice'
import { Modal } from '../../components/ui/Modal'
import { Toggle } from '../../components/ui/Toggle'
import { ThemeControls } from '../../components/theme/ThemeControls'
import type { ChannelPermission, ChannelSummary, PersonSummary, ServerMemberRole, ServerSummary } from '@concord/contracts'
import type { WorkspaceIdentity } from './workspace-types'

type Result = { ok: boolean; message: string }
type SettingsDialogProps = {
  channels: ChannelSummary[]
  identity: WorkspaceIdentity
  initialChannelKind?: ChannelSummary['kind']
  initialTab?: SettingsTab
  onClose: () => void
  onExit: () => void
  exitLabel: string
  onDeleteChannel: (channelId: string) => Promise<Result>
  onDeleteServer: () => Promise<Result>
  onSaveChannel: (channel: { id?: string; name: string; kind: ChannelSummary['kind'] }) => Promise<Result>
  onSaveProfile?: (profile: Pick<WorkspaceIdentity, 'nickname' | 'username' | 'avatarUrl'>) => Promise<Result>
  onSaveServer: (name: string, description: string) => Promise<Result>
  onSetMuted: (muted: boolean) => Promise<Result>
  onUploadAvatar?: (file: File) => Promise<{ ok: boolean; message: string; url?: string }>
  channelPermissions: ChannelPermission[]
  inviteLinks: Array<{ id: string; code: string; uses_count: number }>
  members: Array<PersonSummary & { role: ServerMemberRole }>
  onCreateInviteLink: () => Promise<{ ok: boolean; message: string; url: string }>
  onRevokeInviteLink: (linkId: string) => Promise<Result>
  onSaveChannelPermissions: (channelId: string, role: 'moderator' | 'member', permissions: Omit<ChannelPermission, 'channelId' | 'role'>) => Promise<Result>
  onSetMemberRole: (memberId: string, role: ServerMemberRole) => Promise<Result>
  categories: Array<{ id: string; name: string }>
  onCreateCategory: (name: string) => Promise<Result>
  onLeaveServer: () => Promise<Result>
  onMarkServerRead: () => Promise<Result>
  onModerateMember: (memberId: string, action: 'ban' | 'timeout' | 'microphone' | 'audio') => Promise<Result>
  onSaveServerNickname: (nickname: string) => Promise<Result>
  onSelectServer: (serverId: string) => void
  server: ServerSummary | null
  servers: ServerSummary[]
  serverMuted: boolean
  userId?: string
}

type SettingsTab = 'profile' | 'appearance' | 'servers' | 'server' | 'channels' | 'notifications' | 'permissions'

const settingsTabs: ReadonlyArray<readonly [SettingsTab, string]> = [
  ['profile', 'Perfil'],
  ['appearance', 'Tema'],
  ['servers', 'Servidores'],
  ['server', 'Servidor'],
  ['channels', 'Canais'],
  ['notifications', 'Notificações'],
  ['permissions', 'Permissões'],
]

export function SettingsDialog({ channels, exitLabel, identity, initialChannelKind = 'text', initialTab = 'profile', onClose, onExit, onDeleteChannel, onDeleteServer, onSaveChannel, onSaveProfile, onSaveServer, onSetMuted, onUploadAvatar, channelPermissions, inviteLinks, members, onCreateInviteLink, onRevokeInviteLink, onSaveChannelPermissions, onSetMemberRole, categories, onCreateCategory, onLeaveServer, onMarkServerRead, onModerateMember, onSaveServerNickname, onSelectServer, server, servers, serverMuted, userId }: SettingsDialogProps) {
  const [tab, setTab] = useState<SettingsTab>(initialTab)
  const [nickname, setNickname] = useState(identity.nickname)
  const [username, setUsername] = useState(identity.username)
  const [avatarUrl, setAvatarUrl] = useState(identity.avatarUrl ?? '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [serverName, setServerName] = useState(server?.name ?? '')
  const [serverDescription, setServerDescription] = useState(server?.description ?? '')
  const [channelName, setChannelName] = useState('')
  const [channelKind, setChannelKind] = useState<ChannelSummary['kind']>(initialChannelKind)
  const [categoryName, setCategoryName] = useState('')
  const [serverNickname, setServerNickname] = useState('')
  const [editingChannelId, setEditingChannelId] = useState<string | undefined>()
  const [feedback, setFeedback] = useState('')
  const [createdInviteUrl, setCreatedInviteUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const owner = server?.role === 'owner'
  const canModerate = server?.role === 'owner' || server?.role === 'moderator'

  const run = async (action: () => Promise<Result>) => {
    setSubmitting(true)
    setFeedback('')
    const result = await action()
    setSubmitting(false)
    setFeedback(result.message)
    return result
  }

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSaveProfile) return
    void run(async () => {
      let nextAvatarUrl = avatarUrl
      if (avatarFile && onUploadAvatar) {
        const upload = await onUploadAvatar(avatarFile)
        if (!upload.ok || !upload.url) return upload
        nextAvatarUrl = upload.url
        setAvatarUrl(upload.url)
      }
      return onSaveProfile({ nickname, username, avatarUrl: nextAvatarUrl || null })
    })
  }
  const submitServer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void run(() => onSaveServer(serverName, serverDescription))
  }
  const submitChannel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void run(async () => {
      const result = await onSaveChannel({ id: editingChannelId, name: channelName, kind: channelKind })
      if (result.ok) { setChannelName(''); setChannelKind('text'); setEditingChannelId(undefined) }
      return result
    })
  }

  const startEditChannel = (channel: ChannelSummary) => {
    setChannelName(channel.name)
    setChannelKind(channel.kind)
    setEditingChannelId(channel.id)
  }

  const permission = (channelId: string, role: 'moderator' | 'member') => channelPermissions.find((item) => item.channelId === channelId && item.role === role) ?? { channelId, role, canRead: true, canWrite: true, canSpeak: true }

  return (
    <Modal
      className="settings-dialog"
      closeLabel="Fechar configurações"
      eyebrow="CENTRO DE CONTROLE"
      onClose={onClose}
      title="Configurações."
    >
      <Tabs.Root className="settings-layout" onValueChange={(value) => setTab(value as SettingsTab)} orientation="vertical" value={tab}>
          <Tabs.List aria-label="Seções das configurações" className="settings-nav">
            {settingsTabs.map(([id, label]) => <Tabs.Trigger key={id} value={id}>{label}</Tabs.Trigger>)}
          </Tabs.List>
          <Tabs.Content className="settings-content" value={tab}>
            {tab === 'profile' ? <form onSubmit={submitProfile}>
              <h3>Sua identidade</h3><p>Defina como você aparece em toda a rede.</p>
              <label><span>Apelido</span><input required minLength={3} maxLength={32} value={nickname} onChange={(event) => setNickname(event.target.value)} /></label>
              <label><span>Nome de usuário</span><input required minLength={3} maxLength={32} value={username} onChange={(event) => setUsername(event.target.value)} /></label>
              <label><span>Foto de perfil</span><input accept="image/jpeg,image/png,image/webp" type="file" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} /></label>
              <label><span>Ou URL da foto</span><input type="url" value={avatarUrl} onChange={(event) => { setAvatarUrl(event.target.value); setAvatarFile(null) }} placeholder="https://..." /></label>
              {avatarUrl ? <img className="avatar-preview" src={avatarUrl} alt="Prévia da foto de perfil" /> : null}
              <button className="dialog-submit" type="submit" disabled={submitting || !onSaveProfile}>SALVAR PERFIL</button>
            </form> : null}
            {tab === 'profile' ? <section className="settings-session"><h4 className="settings-subtitle">Sessão</h4><p>Encerrar a sessão apaga a identidade guardada neste navegador.</p><button className="dialog-text-button danger" type="button" onClick={onExit}>{exitLabel}</button></section> : null}
            {tab === 'appearance' ? <section><h3>Seu tema</h3><p>O modo sistema acompanha a preferência do dispositivo.</p><ThemeControls /></section> : null}
            {tab === 'servers' ? <section><h3>Gerenciar servidores</h3><p>Escolha um servidor para administrar suas configurações.</p><div className="settings-server-list">{servers.map((item) => <div key={item.id}><span><strong>{item.name}</strong><small>{item.role === 'owner' ? 'Proprietário' : item.role === 'moderator' ? 'Moderador' : 'Membro'}</small></span><button type="button" onClick={() => onSelectServer(item.id)}>GERENCIAR</button></div>)}</div></section> : null}
            {tab === 'server' ? <form onSubmit={submitServer}>
              <h3>Informações do servidor</h3><p>{owner ? 'Você é o proprietário deste espaço.' : 'Apenas o proprietário pode editar estes dados.'}</p>
              <label><span>Nome</span><input required minLength={3} maxLength={48} disabled={!owner} value={serverName} onChange={(event) => setServerName(event.target.value)} /></label>
              <label><span>Descrição</span><textarea maxLength={160} disabled={!owner} value={serverDescription} onChange={(event) => setServerDescription(event.target.value)} /></label>
              <button className="dialog-submit" type="submit" disabled={submitting || !owner}>SALVAR SERVIDOR</button>
              {owner ? <section className="invite-links"><strong>Convite por link</strong><button className="dialog-submit subdued" type="button" disabled={submitting} onClick={() => void run(async () => { const result = await onCreateInviteLink(); if (result.ok) setCreatedInviteUrl(result.url); return result })}>GERAR LINK</button>{createdInviteUrl ? <input aria-label="Link de convite" readOnly value={createdInviteUrl} onFocus={(event) => event.currentTarget.select()} /> : null}{inviteLinks.map((link) => <div key={link.id}><small>{link.uses_count} entradas</small><button type="button" onClick={() => void run(() => onRevokeInviteLink(link.id))}>REVOGAR</button></div>)}</section> : null}
              <button className="dialog-text-button" type="button" onClick={() => void run(onMarkServerRead)}>MARCAR SERVIDOR COMO LIDO</button>
              {!owner ? <button className="dialog-text-button danger" type="button" onClick={() => void run(onLeaveServer)}>SAIR DO SERVIDOR</button> : null}
              {owner ? <button className="dialog-text-button danger" type="button" onClick={() => { if (window.confirm(`Excluir ${server?.name}? Esta ação não pode ser desfeita.`)) void run(onDeleteServer) }}>EXCLUIR SERVIDOR</button> : null}
            </form> : null}
            {tab === 'channels' ? <section><h3>Canais do servidor</h3><p>{owner ? 'Crie e ajuste canais de texto ou voz.' : 'Somente o proprietário administra os canais.'}</p>
              {owner ? <><form onSubmit={submitChannel}><label><span>Nome do canal</span><input required value={channelName} onChange={(event) => setChannelName(event.target.value)} placeholder="reunião-diária" /></label><Choice label="Tipo" onChange={setChannelKind} options={[{ value: 'text', label: 'Texto' }, { value: 'voice', label: 'Voz' }]} value={channelKind} /><button className="dialog-submit" type="submit" disabled={submitting}>{editingChannelId ? 'SALVAR CANAL' : 'CRIAR CANAL'}</button>{editingChannelId ? <button className="dialog-text-button" type="button" onClick={() => { setEditingChannelId(undefined); setChannelName(''); setChannelKind('text') }}>CANCELAR EDIÇÃO</button> : null}</form><form className="category-form" onSubmit={(event) => { event.preventDefault(); void run(async () => { const result = await onCreateCategory(categoryName); if (result.ok) setCategoryName(''); return result }) }}><label><span>Nova categoria</span><input required value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Geral" /></label><button className="dialog-submit subdued" type="submit">CRIAR CATEGORIA</button></form><p className="category-list">{categories.map((category) => category.name).join(' · ') || 'Sem categorias ainda.'}</p></> : null}
              <div className="settings-channel-list">{channels.map((channel) => <div key={channel.id}><span>{channel.kind === 'text' ? '#' : '◖'} {channel.name}</span>{owner ? <aside><button type="button" onClick={() => startEditChannel(channel)}>EDITAR</button><button type="button" onClick={() => void run(() => onDeleteChannel(channel.id))}>REMOVER</button></aside> : null}</div>)}</div>
            </section> : null}
            {tab === 'notifications' ? <section><h3>Sinais e alertas</h3><p>Mensagens e menções aparecem dentro do Concord enquanto ele estiver aberto.</p><Toggle checked={serverMuted} className="settings-toggle" description="Oculta alertas e contadores deste servidor." label="Silenciar servidor" onChange={(checked) => void run(() => onSetMuted(checked))} /><form className="category-form" onSubmit={(event) => { event.preventDefault(); void run(() => onSaveServerNickname(serverNickname)) }}><label><span>Apelido neste servidor</span><input value={serverNickname} onChange={(event) => setServerNickname(event.target.value)} placeholder={identity.nickname} /></label><button className="dialog-submit subdued" type="submit">SALVAR APELIDO</button></form></section> : null}
            {tab === 'permissions' ? <section><h3>Permissões</h3><p>Proprietário administra tudo. Moderador administra canais e membros comuns. Por canal, você pode controlar leitura, escrita e voz.</p><div className="permission-card"><strong>Proprietário</strong><span>configura servidor, cargos, canais e convites</span></div><div className="permission-card"><strong>Moderador</strong><span>cria canais e modera membros comuns</span></div><div className="permission-card"><strong>Membro</strong><span>usa os canais liberados</span></div>{canModerate ? <><h4 className="settings-subtitle">Moderação</h4>{members.filter((member) => member.id !== userId && member.role !== 'owner' && (owner || member.role === 'member')).map((member) => <div className="member-moderation-row" key={member.id}><span><strong>{member.nickname}</strong><small>@{member.username}</small></span><button type="button" onClick={() => void run(() => onModerateMember(member.id, 'microphone'))}>MIC</button><button type="button" onClick={() => void run(() => onModerateMember(member.id, 'audio'))}>ÁUDIO</button><button type="button" onClick={() => void run(() => onModerateMember(member.id, 'timeout'))}>TIMEOUT</button><button className="danger" type="button" onClick={() => { if (window.confirm(`Banir ${member.nickname} deste servidor?`)) void run(() => onModerateMember(member.id, 'ban')) }}>BANIR</button></div>)}</> : null}{owner ? <><h4 className="settings-subtitle">Cargos</h4>{members.filter((member) => member.id !== userId).map((member) => <div className="role-row" key={member.id}><span>{member.nickname}<small>@{member.username}</small></span><Choice disabled={member.role === 'owner'} hideLabel label={`Cargo de ${member.nickname}`} onChange={(role) => void run(() => onSetMemberRole(member.id, role))} options={[{ value: 'owner', label: 'Proprietário' }, { value: 'moderator', label: 'Moderador' }, { value: 'member', label: 'Membro' }]} value={member.role} /></div>)}<h4 className="settings-subtitle">Por canal</h4>{channels.map((channel) => <div className="channel-permission-row" key={channel.id}><strong>{channel.kind === 'text' ? '#' : '◖'} {channel.name}</strong>{(['moderator', 'member'] as const).map((role) => { const value = permission(channel.id, role); return <div key={role}><small>{role}</small>{(['canRead', 'canWrite', 'canSpeak'] as const).map((key) => <Toggle checked={value[key]} className="permission-toggle" key={key} label={key === 'canRead' ? 'ler' : key === 'canWrite' ? 'escrever' : 'falar'} onChange={(checked) => void run(() => onSaveChannelPermissions(channel.id, role, { ...value, [key]: checked }))} />)}</div>})}</div>)}</> : null}</section> : null}
          </Tabs.Content>
      </Tabs.Root>
      {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
    </Modal>
  )
}
