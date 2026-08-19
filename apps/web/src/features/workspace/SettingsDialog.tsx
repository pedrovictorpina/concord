import { useState } from 'react'
import type { FormEvent } from 'react'
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
  onSaveServerNickname: (nickname: string) => Promise<Result>
  onSelectServer: (serverId: string) => void
  server: ServerSummary | null
  servers: ServerSummary[]
  serverMuted: boolean
  userId?: string
}

type SettingsTab = 'profile' | 'appearance' | 'servers' | 'server' | 'channels' | 'notifications' | 'permissions'

export function SettingsDialog({ channels, identity, initialChannelKind = 'text', initialTab = 'profile', onClose, onDeleteChannel, onDeleteServer, onSaveChannel, onSaveProfile, onSaveServer, onSetMuted, onUploadAvatar, channelPermissions, inviteLinks, members, onCreateInviteLink, onRevokeInviteLink, onSaveChannelPermissions, onSetMemberRole, categories, onCreateCategory, onLeaveServer, onMarkServerRead, onSaveServerNickname, onSelectServer, server, servers, serverMuted, userId }: SettingsDialogProps) {
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
    <div className="server-dialog-backdrop" role="presentation">
      <section className="server-dialog settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title">
        <button className="dialog-close" type="button" aria-label="Fechar configurações" onClick={onClose}>×</button>
        <span className="eyebrow">CENTRO DE CONTROLE</span>
        <h2 id="settings-dialog-title">Configurações.</h2>
        <div className="settings-layout">
          <nav aria-label="Seções das configurações" className="settings-nav">
            {([['profile', 'Perfil'], ['appearance', 'Tema'], ['servers', 'Servidores'], ['server', 'Servidor'], ['channels', 'Canais'], ['notifications', 'Notificações'], ['permissions', 'Permissões']] as const).map(([id, label]) => <button className={tab === id ? 'active' : ''} key={id} type="button" onClick={() => setTab(id)}>{label}</button>)}
          </nav>
          <div className="settings-content">
            {tab === 'profile' ? <form onSubmit={submitProfile}>
              <h3>Sua identidade</h3><p>Defina como você aparece em toda a rede.</p>
              <label><span>Apelido</span><input required minLength={3} maxLength={32} value={nickname} onChange={(event) => setNickname(event.target.value)} /></label>
              <label><span>Nome de usuário</span><input required minLength={3} maxLength={32} value={username} onChange={(event) => setUsername(event.target.value)} /></label>
              <label><span>Foto de perfil</span><input accept="image/jpeg,image/png,image/webp" type="file" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} /></label>
              <label><span>Ou URL da foto</span><input type="url" value={avatarUrl} onChange={(event) => { setAvatarUrl(event.target.value); setAvatarFile(null) }} placeholder="https://..." /></label>
              {avatarUrl ? <img className="avatar-preview" src={avatarUrl} alt="Prévia da foto de perfil" /> : null}
              <button className="dialog-submit" type="submit" disabled={submitting || !onSaveProfile}>SALVAR PERFIL</button>
            </form> : null}
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
              {owner ? <><form onSubmit={submitChannel}><label><span>Nome do canal</span><input required value={channelName} onChange={(event) => setChannelName(event.target.value)} placeholder="reunião-diária" /></label><label><span>Tipo</span><select value={channelKind} onChange={(event) => setChannelKind(event.target.value as ChannelSummary['kind'])}><option value="text">Texto</option><option value="voice">Voz</option></select></label><button className="dialog-submit" type="submit" disabled={submitting}>{editingChannelId ? 'SALVAR CANAL' : 'CRIAR CANAL'}</button>{editingChannelId ? <button className="dialog-text-button" type="button" onClick={() => { setEditingChannelId(undefined); setChannelName(''); setChannelKind('text') }}>CANCELAR EDIÇÃO</button> : null}</form><form className="category-form" onSubmit={(event) => { event.preventDefault(); void run(async () => { const result = await onCreateCategory(categoryName); if (result.ok) setCategoryName(''); return result }) }}><label><span>Nova categoria</span><input required value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Geral" /></label><button className="dialog-submit subdued" type="submit">CRIAR CATEGORIA</button></form><p className="category-list">{categories.map((category) => category.name).join(' · ') || 'Sem categorias ainda.'}</p></> : null}
              <div className="settings-channel-list">{channels.map((channel) => <div key={channel.id}><span>{channel.kind === 'text' ? '#' : '◖'} {channel.name}</span>{owner ? <aside><button type="button" onClick={() => startEditChannel(channel)}>EDITAR</button><button type="button" onClick={() => void run(() => onDeleteChannel(channel.id))}>REMOVER</button></aside> : null}</div>)}</div>
            </section> : null}
            {tab === 'notifications' ? <section><h3>Sinais e alertas</h3><p>Mensagens e menções aparecem dentro do Concord enquanto ele estiver aberto.</p><label className="settings-toggle"><span><strong>Silenciar servidor</strong><small>Oculta alertas e contadores deste servidor.</small></span><input checked={serverMuted} type="checkbox" onChange={(event) => void run(() => onSetMuted(event.target.checked))} /></label><form className="category-form" onSubmit={(event) => { event.preventDefault(); void run(() => onSaveServerNickname(serverNickname)) }}><label><span>Apelido neste servidor</span><input value={serverNickname} onChange={(event) => setServerNickname(event.target.value)} placeholder={identity.nickname} /></label><button className="dialog-submit subdued" type="submit">SALVAR APELIDO</button></form></section> : null}
            {tab === 'permissions' ? <section><h3>Permissões</h3><p>Proprietário administra tudo. Moderador administra canais. Por canal, você pode controlar leitura, escrita e voz.</p><div className="permission-card"><strong>Proprietário</strong><span>configura servidor, cargos, canais e convites</span></div><div className="permission-card"><strong>Moderador</strong><span>cria e edita canais</span></div><div className="permission-card"><strong>Membro</strong><span>usa os canais liberados</span></div>{owner ? <><h4 className="settings-subtitle">Cargos</h4>{members.filter((member) => member.id !== userId).map((member) => <label className="role-row" key={member.id}><span>{member.nickname}<small>@{member.username}</small></span><select value={member.role} disabled={member.role === 'owner'} onChange={(event) => void run(() => onSetMemberRole(member.id, event.target.value as ServerMemberRole))}><option value="owner">Proprietário</option><option value="moderator">Moderador</option><option value="member">Membro</option></select></label>)}<h4 className="settings-subtitle">Por canal</h4>{channels.map((channel) => <div className="channel-permission-row" key={channel.id}><strong>{channel.kind === 'text' ? '#' : '◖'} {channel.name}</strong>{(['moderator', 'member'] as const).map((role) => { const value = permission(channel.id, role); return <div key={role}><small>{role}</small>{(['canRead', 'canWrite', 'canSpeak'] as const).map((key) => <label key={key}><input checked={value[key]} type="checkbox" onChange={(event) => void run(() => onSaveChannelPermissions(channel.id, role, { ...value, [key]: event.target.checked }))} />{key === 'canRead' ? 'ler' : key === 'canWrite' ? 'escrever' : 'falar'}</label>)}</div>})}</div>)}</> : null}</section> : null}
          </div>
        </div>
        {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
      </section>
    </div>
  )
}
