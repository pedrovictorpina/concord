import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChannelPermission, ChannelSummary, FriendRequestSummary, MessageSummary, PersonSummary, ServerInviteSummary, ServerMemberRole, ServerSummary } from '@concord/contracts'
import { supabase } from '../../lib/supabase'
import { channels as demoChannels, initialMessages } from './workspace-data'

type CommunityWorkspaceOptions = {
  demoMode: boolean
  userId?: string
  username?: string
}

type ServerMembershipRow = {
  role: ServerSummary['role']
  servers: { id: string; name: string; description: string } | null
}

type MessageRow = {
  id: string
  channel_id: string
  author_id: string
  body: string
  created_at: string
  edited_at: string | null
  profiles: { nickname: string } | Array<{ nickname: string }> | null
}

type ProfileRow = { id: string; nickname: string; username: string; avatar_url?: string | null }

const mapProfile = (row: ProfileRow | null): PersonSummary | null => row
  ? { id: row.id, nickname: row.nickname, username: row.username, avatarUrl: row.avatar_url ?? null }
  : null

type FriendRequestRow = {
  id: string
  sender_id: string
  recipient_id: string
  status: FriendRequestSummary['status']
  sender: ProfileRow | null
  recipient: ProfileRow | null
}

type FriendshipRow = {
  user_a_id: string
  user_b_id: string
  person_a: ProfileRow | null
  person_b: ProfileRow | null
}

type ServerInviteRow = {
  id: string
  server_id: string
  status: ServerInviteSummary['status']
  servers: { name: string } | null
  sender: ProfileRow | null
}

type ServerPreferenceRow = { muted: boolean }
type MemberRow = { user_id: string; role: ServerMemberRole; profiles: ProfileRow | null }
type ChannelPermissionRow = { channel_id: string; role: Exclude<ServerMemberRole, 'owner'>; can_read: boolean; can_write: boolean; can_speak: boolean }
type InviteLinkRow = { id: string; code: string; expires_at: string | null; max_uses: number | null; uses_count: number }
type CategoryRow = { id: string; name: string }

const demoServer: ServerSummary = {
  id: 'demo-concord',
  name: 'Concord',
  description: 'Fundacao e sinais do produto',
  role: 'owner',
}
const demoFriends: PersonSummary[] = [
  { id: 'demo-moderador', nickname: 'Ari', username: 'ari', avatarUrl: null },
  { id: 'demo-amigo', nickname: 'Nina', username: 'nina', avatarUrl: null },
]

const demoMembers: Array<PersonSummary & { role: ServerMemberRole }> = [
  { id: 'demo-user', nickname: 'Pedro', username: 'fundador', avatarUrl: null, role: 'owner' },
  { id: 'demo-moderador', nickname: 'Ari', username: 'ari', avatarUrl: null, role: 'moderator' },
  { id: 'demo-membro', nickname: 'Rafa', username: 'rafa', avatarUrl: null, role: 'member' },
]

const demoMessageList: MessageSummary[] = initialMessages.map((message) => ({
  id: String(message.id),
  channelId: 'geral',
  authorId: message.system ? 'concord-relay' : 'produto',
  authorNickname: message.author,
  body: message.body,
  createdAt: new Date().toISOString(),
  editedAt: null,
}))

const nicknameFrom = (embedded: { nickname: string } | Array<{ nickname: string }> | null) => {
  const profile = Array.isArray(embedded) ? embedded[0] : embedded
  return profile?.nickname?.trim() || 'Membro'
}

const mapMessage = (row: MessageRow): MessageSummary => ({
  id: row.id,
  channelId: row.channel_id,
  authorId: row.author_id,
  authorNickname: nicknameFrom(row.profiles),
  body: row.body,
  createdAt: row.created_at,
  editedAt: row.edited_at,
})

export function useCommunityWorkspace({ demoMode, userId, username }: CommunityWorkspaceOptions) {
  const connected = Boolean(supabase && userId && !demoMode)
  const [servers, setServers] = useState<ServerSummary[]>(demoMode ? [demoServer] : [])
  const [activeServerId, setActiveServerId] = useState<string | null>(null)
  const [channels, setChannels] = useState<ChannelSummary[]>(demoMode ? demoChannels : [])
  const [activeChannelId, setActiveChannelId] = useState<string | null>(demoMode ? 'geral' : null)
  const [messages, setMessages] = useState<MessageSummary[]>(demoMode ? demoMessageList : [])
  const [friendRequests, setFriendRequests] = useState<FriendRequestSummary[]>([])
  const [friends, setFriends] = useState<PersonSummary[]>(demoMode ? demoFriends : [])
  const [serverInvites, setServerInvites] = useState<ServerInviteSummary[]>([])
  const [loading, setLoading] = useState(connected)
  const [error, setError] = useState<string | null>(null)
  const [serverMuted, setServerMuted] = useState(false)
  const [unreadByChannel, setUnreadByChannel] = useState<Record<string, { count: number; mentioned: boolean }>>({})
  const [members, setMembers] = useState<Array<PersonSummary & { role: ServerMemberRole }>>(demoMode ? demoMembers : [])
  const [channelPermissions, setChannelPermissions] = useState<ChannelPermission[]>([])
  const [inviteLinks, setInviteLinks] = useState<InviteLinkRow[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [voiceRestrictions, setVoiceRestrictions] = useState({ microphoneDisabled: false, outputDisabled: false })

  const activeServer = useMemo(
    () => servers.find((server) => server.id === activeServerId) ?? null,
    [activeServerId, servers],
  )
  const activeChannel = useMemo(
    () => channels.find((channel) => channel.id === activeChannelId) ?? null,
    [activeChannelId, channels],
  )

  const loadServers = useCallback(async () => {
    if (!supabase || !userId) return

    const { data, error: requestError } = await supabase
      .from('server_members')
      .select('role, servers (id, name, description)')
      .eq('user_id', userId)

    if (requestError) {
      setError('Nao foi possivel carregar seus servidores.')
      return
    }

    const nextServers = ((data ?? []) as unknown as ServerMembershipRow[])
      .flatMap((membership) => membership.servers ? [{ ...membership.servers, role: membership.role }] : [])
    setServers(nextServers)
    setActiveServerId((current) => current && nextServers.some((server) => server.id === current) ? current : null)
  }, [userId])

  const loadChannels = useCallback(async (serverId: string | null) => {
    if (!supabase || !serverId) {
      setChannels([])
      setActiveChannelId(null)
      return
    }

    const { data, error: requestError } = await supabase
      .from('channels')
      .select('id, name, kind')
      .eq('server_id', serverId)
      .order('position')
      .order('created_at')

    if (requestError) {
      setError('Nao foi possivel carregar os canais.')
      return
    }

    const nextChannels = (data ?? []) as ChannelSummary[]
    setChannels(nextChannels)
    setActiveChannelId((current) => nextChannels.some((channel) => channel.id === current) ? current : nextChannels.find((channel) => channel.kind === 'text')?.id ?? null)
  }, [])

  const loadServerControls = useCallback(async (serverId: string | null) => {
    if (!supabase || !serverId) {
      setMembers([]); setChannelPermissions([]); setInviteLinks([]); setVoiceRestrictions({ microphoneDisabled: false, outputDisabled: false })
      return
    }
    const [membersResult, permissionsResult, linksResult, categoriesResult, moderationResult] = await Promise.all([
      supabase.from('server_members').select('user_id, role, profiles(id, nickname, username, avatar_url)').eq('server_id', serverId),
      supabase.from('channel_permissions').select('channel_id, role, can_read, can_write, can_speak').in('channel_id', channels.map((channel) => channel.id)),
      supabase.from('server_invite_links').select('id, code, expires_at, max_uses, uses_count').eq('server_id', serverId).is('revoked_at', null).order('created_at', { ascending: false }),
      supabase.from('channel_categories').select('id, name').eq('server_id', serverId).order('position'),
      userId ? supabase.from('server_member_moderation').select('microphone_disabled, output_disabled').eq('server_id', serverId).eq('user_id', userId).maybeSingle() : Promise.resolve({ data: null, error: null }),
    ])
    if (membersResult.error || permissionsResult.error || linksResult.error || categoriesResult.error) return
    setMembers(((membersResult.data ?? []) as unknown as MemberRow[]).flatMap((member) => {
      const profile = mapProfile(member.profiles)
      return profile ? [{ ...profile, role: member.role }] : []
    }))
    setChannelPermissions(((permissionsResult.data ?? []) as ChannelPermissionRow[]).map((item) => ({ channelId: item.channel_id, role: item.role, canRead: item.can_read, canWrite: item.can_write, canSpeak: item.can_speak })))
    setInviteLinks((linksResult.data ?? []) as InviteLinkRow[])
    setCategories((categoriesResult.data ?? []) as CategoryRow[])
    setVoiceRestrictions({ microphoneDisabled: moderationResult.data?.microphone_disabled ?? false, outputDisabled: moderationResult.data?.output_disabled ?? false })
  }, [channels, userId])

  const loadMessages = useCallback(async (channelId: string | null) => {
    if (!supabase || !channelId) {
      setMessages([])
      return
    }

    const { data, error: requestError } = await supabase
      .from('messages')
      .select('id, channel_id, author_id, body, created_at, edited_at, profiles!messages_author_id_fkey(nickname)')
      .eq('channel_id', channelId)
      .order('created_at')
      .limit(100)

    if (requestError) {
      setError('Nao foi possivel carregar as mensagens.')
      return
    }

    setMessages(((data ?? []) as unknown as MessageRow[]).map(mapMessage))
  }, [])

  const loadSocial = useCallback(async () => {
    if (!supabase || !userId) return

    const [requestsResult, friendshipsResult, invitesResult] = await Promise.all([
      supabase.from('friend_requests').select('id, sender_id, recipient_id, status, sender:profiles!friend_requests_sender_id_fkey(id, nickname, username, avatar_url), recipient:profiles!friend_requests_recipient_id_fkey(id, nickname, username, avatar_url)').eq('status', 'pending'),
      supabase.from('friendships').select('user_a_id, user_b_id, person_a:profiles!friendships_user_a_id_fkey(id, nickname, username, avatar_url), person_b:profiles!friendships_user_b_id_fkey(id, nickname, username, avatar_url)').or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`),
      supabase.from('server_invites').select('id, server_id, status, servers(name), sender:profiles!server_invites_sender_id_fkey(id, nickname, username, avatar_url)').eq('recipient_id', userId).eq('status', 'pending'),
    ])

    if (requestsResult.error || friendshipsResult.error || invitesResult.error) {
      setError('Nao foi possivel carregar amizades e convites.')
      return
    }

    setFriendRequests(((requestsResult.data ?? []) as unknown as FriendRequestRow[]).map((request) => ({
      id: request.id,
      direction: request.recipient_id === userId ? 'received' : 'sent',
      person: mapProfile(request.recipient_id === userId ? request.sender : request.recipient),
      status: request.status,
    })).filter((request): request is FriendRequestSummary => Boolean(request.person)))
    setFriends(((friendshipsResult.data ?? []) as unknown as FriendshipRow[]).map((friendship) => (
      mapProfile(friendship.user_a_id === userId ? friendship.person_b : friendship.person_a)
    )).filter((person): person is PersonSummary => Boolean(person)))
    setServerInvites(((invitesResult.data ?? []) as unknown as ServerInviteRow[]).map((invite) => ({
      id: invite.id,
      serverId: invite.server_id,
      serverName: invite.servers?.name ?? 'Servidor privado',
      sender: mapProfile(invite.sender) ?? { id: '', nickname: 'Membro', username: 'membro', avatarUrl: null },
      status: invite.status,
    })))
  }, [userId])

  useEffect(() => {
    if (!connected) {
      setLoading(false)
      return
    }

    setLoading(true)
    void loadServers().finally(() => setLoading(false))
  }, [connected, loadServers])

  useEffect(() => {
    if (demoMode || !connected) return
    void loadSocial()
  }, [connected, demoMode, loadSocial])

  useEffect(() => {
    if (demoMode) return
    void loadChannels(activeServerId)
  }, [activeServerId, demoMode, loadChannels])

  useEffect(() => {
    if (demoMode) return
    void loadServerControls(activeServerId)
  }, [activeServerId, demoMode, loadServerControls])

  useEffect(() => {
    if (demoMode) return
    void loadMessages(activeChannelId)
  }, [activeChannelId, demoMode, loadMessages])

  useEffect(() => {
    if (!supabase || demoMode || !activeServerId || !userId) {
      setServerMuted(false)
      return
    }
    void supabase.from('server_preferences').select('muted').eq('server_id', activeServerId).eq('user_id', userId).maybeSingle()
      .then(({ data }) => setServerMuted((data as ServerPreferenceRow | null)?.muted ?? false))
  }, [activeServerId, demoMode, userId])

  useEffect(() => {
    if (!supabase || demoMode || !activeChannelId) return

    const client = supabase
    const realtimeChannel = client
      .channel(`messages:${activeChannelId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${activeChannelId}`,
      }, () => {
        void loadMessages(activeChannelId)
      })
      .subscribe()

    return () => {
      void client.removeChannel(realtimeChannel)
    }
  }, [activeChannelId, demoMode, loadMessages])

  useEffect(() => {
    if (!supabase || demoMode || !activeServerId || !userId) return
    const client = supabase
    const realtimeChannel = client
      .channel(`server-messages:${activeServerId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const message = payload.new as { channel_id?: string; author_id?: string; body?: string }
        if (!message.channel_id || message.author_id === userId || message.channel_id === activeChannelId || serverMuted) return
        if (!channels.some((channel) => channel.id === message.channel_id)) return
        const body = message.body?.toLowerCase() ?? ''
        const mentioned = Boolean(username && body.includes(`@${username.toLowerCase()}`))
        setUnreadByChannel((current) => ({
          ...current,
          [message.channel_id!]: { count: (current[message.channel_id!]?.count ?? 0) + 1, mentioned: current[message.channel_id!]?.mentioned || mentioned },
        }))
      })
      .subscribe()
    return () => { void client.removeChannel(realtimeChannel) }
  }, [activeChannelId, activeServerId, channels, demoMode, serverMuted, userId, username])

  useEffect(() => {
    if (!activeChannelId) return
    setUnreadByChannel((current) => {
      if (!current[activeChannelId]) return current
      const next = { ...current }
      delete next[activeChannelId]
      return next
    })
  }, [activeChannelId])

  useEffect(() => {
    if (!supabase || demoMode || !activeChannelId || !userId) return
    void supabase.from('channel_read_states').upsert({ channel_id: activeChannelId, user_id: userId, last_read_at: new Date().toISOString() })
  }, [activeChannelId, demoMode, userId])

  useEffect(() => {
    if (!supabase || demoMode || !userId || !channels.length) return
    const client = supabase
    void (async () => {
      const { data: states } = await client.from('channel_read_states').select('channel_id, last_read_at').eq('user_id', userId).in('channel_id', channels.map((channel) => channel.id))
      const readAt = new Map((states ?? []).map((state) => [state.channel_id, state.last_read_at]))
      const results = await Promise.all(channels.filter((channel) => channel.id !== activeChannelId && channel.kind === 'text').map(async (channel) => {
        const since = readAt.get(channel.id) ?? '1970-01-01T00:00:00.000Z'
        const [countResult, mentionResult] = await Promise.all([
          client.from('messages').select('*', { count: 'exact', head: true }).eq('channel_id', channel.id).neq('author_id', userId).gt('created_at', since),
          username ? client.from('messages').select('*', { count: 'exact', head: true }).eq('channel_id', channel.id).neq('author_id', userId).gt('created_at', since).ilike('body', `%@${username}%`) : Promise.resolve({ count: 0 }),
        ])
        return [channel.id, { count: countResult.count ?? 0, mentioned: (mentionResult.count ?? 0) > 0 }] as const
      }))
      setUnreadByChannel(Object.fromEntries(results.filter(([, value]) => value.count > 0)))
    })()
  }, [activeChannelId, channels, demoMode, userId, username])

  const createServer = useCallback(async (name: string, description: string) => {
    if (!supabase || !userId) return { ok: false, message: 'Conecte sua identidade antes de criar um servidor.' }

    const { data, error: requestError } = await supabase
      .from('servers')
      .insert({ owner_id: userId, name: name.trim(), description: description.trim() })
      .select('id')
      .single()

    if (requestError || !data) return { ok: false, message: 'Nao foi possivel criar o servidor.' }
    await loadServers()
    setActiveServerId(data.id)
    return { ok: true, message: 'Servidor criado. O canal #geral ja esta pronto.' }
  }, [loadServers, userId])

  const saveServer = useCallback(async (name: string, description: string) => {
    if (!supabase || !activeServer || activeServer.role !== 'owner') return { ok: false, message: 'Somente o proprietario pode editar este servidor.' }
    const { error: requestError } = await supabase.from('servers').update({ name: name.trim(), description: description.trim() }).eq('id', activeServer.id)
    if (requestError) return { ok: false, message: 'Nao foi possivel salvar as configuracoes do servidor.' }
    await loadServers()
    return { ok: true, message: 'Configuracoes do servidor atualizadas.' }
  }, [activeServer, loadServers])

  const deleteServer = useCallback(async () => {
    if (demoMode) {
      setServers([]); setActiveServerId(null); setChannels([]); setActiveChannelId(null); setMessages([])
      return { ok: true, message: 'Servidor excluído.' }
    }
    if (!supabase || !activeServer || activeServer.role !== 'owner') return { ok: false, message: 'Somente o proprietário pode excluir este servidor.' }
    const { error: requestError } = await supabase.from('servers').delete().eq('id', activeServer.id)
    if (requestError) return { ok: false, message: 'Não foi possível excluir o servidor.' }
    await loadServers()
    return { ok: true, message: 'Servidor excluído.' }
  }, [activeServer, demoMode, loadServers])

  const saveChannel = useCallback(async (channel: { id?: string; name: string; kind: ChannelSummary['kind'] }) => {
    const name = channel.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (name.length < 2) return { ok: false, message: 'Use ao menos dois caracteres no nome do canal.' }
    if (demoMode) {
      setChannels((current) => channel.id ? current.map((item) => item.id === channel.id ? { ...item, name, kind: channel.kind } : item) : [...current, { id: `demo-${Date.now()}`, name, kind: channel.kind }])
      return { ok: true, message: channel.id ? 'Canal atualizado.' : 'Canal criado.' }
    }
    if (!supabase || !activeServer || !['owner', 'moderator'].includes(activeServer.role) || !userId) return { ok: false, message: 'Somente quem administra o servidor pode alterar canais.' }
    const request = channel.id
      ? supabase.from('channels').update({ name, kind: channel.kind }).eq('id', channel.id)
      : supabase.from('channels').insert({ server_id: activeServer.id, name, kind: channel.kind, position: channels.length, created_by: userId })
    const { error: requestError } = await request
    if (requestError) return { ok: false, message: 'Nao foi possivel salvar o canal. O nome pode ja estar em uso.' }
    await loadChannels(activeServer.id)
    return { ok: true, message: channel.id ? 'Canal atualizado.' : 'Canal criado.' }
  }, [activeServer, channels.length, demoMode, loadChannels, userId])

  const deleteChannel = useCallback(async (channelId: string) => {
    if (demoMode) {
      setChannels((current) => current.filter((channel) => channel.id !== channelId))
      return { ok: true, message: 'Canal removido.' }
    }
    if (!supabase || !activeServer || !['owner', 'moderator'].includes(activeServer.role)) return { ok: false, message: 'Somente quem administra o servidor pode remover canais.' }
    const { error: requestError } = await supabase.from('channels').delete().eq('id', channelId)
    if (requestError) return { ok: false, message: 'Nao foi possivel remover o canal.' }
    await loadChannels(activeServer.id)
    return { ok: true, message: 'Canal removido.' }
  }, [activeServer, demoMode, loadChannels])

  const setMuted = useCallback(async (muted: boolean) => {
    if (demoMode) {
      setServerMuted(muted)
      return { ok: true, message: muted ? 'Servidor silenciado.' : 'Notificacoes reativadas.' }
    }
    if (!supabase || !activeServer || !userId) return { ok: false, message: 'Conecte sua identidade antes de alterar notificacoes.' }
    const { error: requestError } = await supabase.from('server_preferences').upsert({ server_id: activeServer.id, user_id: userId, muted })
    if (requestError) return { ok: false, message: 'Nao foi possivel salvar a preferencia.' }
    setServerMuted(muted)
    return { ok: true, message: muted ? 'Servidor silenciado.' : 'Notificacoes reativadas.' }
  }, [activeServer, demoMode, userId])

  const setMemberRole = useCallback(async (memberId: string, role: ServerMemberRole) => {
    if (!supabase || !activeServer || activeServer.role !== 'owner') return { ok: false, message: 'Somente o proprietário pode alterar cargos.' }
    const { error: requestError } = await supabase.from('server_members').update({ role }).eq('server_id', activeServer.id).eq('user_id', memberId)
    if (requestError) return { ok: false, message: 'Não foi possível alterar o cargo.' }
    await Promise.all([loadServerControls(activeServer.id), loadServers()])
    return { ok: true, message: 'Cargo atualizado.' }
  }, [activeServer, loadServerControls, loadServers])

  const moderateMember = useCallback(async (memberId: string, action: 'ban' | 'timeout' | 'microphone' | 'audio') => {
    if (demoMode) {
      if (action === 'ban') setMembers((current) => current.filter((member) => member.id !== memberId))
      return { ok: true, message: action === 'ban' ? 'Membro banido.' : action === 'timeout' ? 'Timeout de 10 minutos aplicado.' : action === 'microphone' ? 'Microfone desativado.' : 'Áudio desativado.' }
    }
    if (!supabase || !activeServer || !['owner', 'moderator'].includes(activeServer.role)) return { ok: false, message: 'Sem permissão para moderar membros.' }
    const request = action === 'ban'
      ? supabase.rpc('ban_server_member', { target_server_id: activeServer.id, target_user_id: memberId })
      : supabase.rpc('set_server_member_moderation', { target_server_id: activeServer.id, target_user_id: memberId, next_timeout_until: action === 'timeout' ? new Date(Date.now() + 10 * 60 * 1000).toISOString() : null, next_microphone_disabled: action === 'microphone', next_output_disabled: action === 'audio' })
    const { error: requestError } = await request
    if (requestError) return { ok: false, message: 'Não foi possível aplicar a moderação.' }
    await Promise.all([loadServerControls(activeServer.id), loadServers()])
    return { ok: true, message: action === 'ban' ? 'Membro banido.' : action === 'timeout' ? 'Timeout de 10 minutos aplicado.' : action === 'microphone' ? 'Microfone desativado.' : 'Áudio desativado.' }
  }, [activeServer, demoMode, loadServerControls, loadServers])

  const removeMember = useCallback(async (memberId: string) => {
    if (demoMode) {
      setMembers((current) => current.filter((member) => member.id !== memberId))
      return { ok: true, message: 'Membro removido.' }
    }
    if (!supabase || !activeServer || !['owner', 'moderator'].includes(activeServer.role)) return { ok: false, message: 'Sem permissão para remover membros.' }
    const { error: requestError } = await supabase.rpc('remove_server_member', { target_server_id: activeServer.id, target_user_id: memberId })
    if (requestError) return { ok: false, message: 'Não foi possível remover o membro.' }
    await loadServerControls(activeServer.id)
    return { ok: true, message: 'Membro removido do servidor.' }
  }, [activeServer, demoMode, loadServerControls])

  const transferOwnership = useCallback(async (memberId: string) => {
    if (demoMode) return { ok: false, message: 'A demonstração não transfere servidores.' }
    if (!supabase || !activeServer || activeServer.role !== 'owner') return { ok: false, message: 'Somente o proprietário pode transferir o servidor.' }
    const { error: requestError } = await supabase.rpc('transfer_server_ownership', { target_server_id: activeServer.id, target_user_id: memberId })
    if (requestError) return { ok: false, message: 'Não foi possível transferir o servidor.' }
    await Promise.all([loadServerControls(activeServer.id), loadServers()])
    return { ok: true, message: 'Servidor transferido. Você agora é moderador.' }
  }, [activeServer, demoMode, loadServerControls, loadServers])

  const saveChannelPermissions = useCallback(async (channelId: string, role: Exclude<ServerMemberRole, 'owner'>, permissions: Omit<ChannelPermission, 'channelId' | 'role'>) => {
    if (!supabase || !activeServer || activeServer.role !== 'owner') return { ok: false, message: 'Somente o proprietário pode alterar permissões.' }
    const { error: requestError } = await supabase.from('channel_permissions').upsert({ channel_id: channelId, role, can_read: permissions.canRead, can_write: permissions.canWrite, can_speak: permissions.canSpeak })
    if (requestError) return { ok: false, message: 'Não foi possível salvar as permissões.' }
    await loadServerControls(activeServer.id)
    return { ok: true, message: 'Permissões do canal atualizadas.' }
  }, [activeServer, loadServerControls])

  const createInviteLink = useCallback(async () => {
    if (!supabase || !userId) return { ok: false, message: 'Entre com sua conta para gerar links de convite.', url: '' }
    if (!activeServer || activeServer.role !== 'owner') return { ok: false, message: 'Somente o proprietário pode criar links.', url: '' }
    const { data, error: requestError } = await supabase.from('server_invite_links').insert({ server_id: activeServer.id, created_by: userId }).select('code').single()
    if (requestError || !data) return { ok: false, message: 'Não foi possível criar o link.', url: '' }
    await loadServerControls(activeServer.id)
    return { ok: true, message: 'Link de convite criado.', url: `${window.location.origin}/?invite=${data.code}` }
  }, [activeServer, loadServerControls, userId])

  const revokeInviteLink = useCallback(async (linkId: string) => {
    if (!supabase || !activeServer || activeServer.role !== 'owner') return { ok: false, message: 'Somente o proprietário pode revogar links.' }
    const { error: requestError } = await supabase.from('server_invite_links').update({ revoked_at: new Date().toISOString() }).eq('id', linkId)
    if (requestError) return { ok: false, message: 'Não foi possível revogar o link.' }
    await loadServerControls(activeServer.id)
    return { ok: true, message: 'Link revogado.' }
  }, [activeServer, loadServerControls])

  const redeemInviteLink = useCallback(async (code: string) => {
    if (!supabase) return { ok: false, message: 'Conecte sua identidade antes de aceitar o convite.' }
    const { data, error: requestError } = await supabase.rpc('redeem_server_invite_link', { target_code: code }).single()
    const invite = data as { server_id: string; server_name: string } | null
    if (requestError || !invite) return { ok: false, message: 'Este link é inválido, expirou ou foi revogado.' }
    await loadServers()
    setActiveServerId(invite.server_id)
    return { ok: true, message: `Você entrou em ${invite.server_name}.` }
  }, [loadServers])

  const markServerRead = useCallback(async () => {
    if (!supabase || !userId) return { ok: false, message: 'Conecte sua identidade antes de continuar.' }
    const client = supabase
    await Promise.all(channels.filter((channel) => channel.kind === 'text').map((channel) => client.from('channel_read_states').upsert({ channel_id: channel.id, user_id: userId, last_read_at: new Date().toISOString() })))
    setUnreadByChannel({})
    return { ok: true, message: 'Servidor marcado como lido.' }
  }, [channels, userId])

  const leaveServer = useCallback(async () => {
    if (!supabase || !activeServer || !userId || activeServer.role === 'owner') return { ok: false, message: 'O proprietário precisa transferir ou excluir o servidor antes de sair.' }
    const { error: requestError } = await supabase.from('server_members').delete().eq('server_id', activeServer.id).eq('user_id', userId)
    if (requestError) return { ok: false, message: 'Não foi possível sair do servidor.' }
    await loadServers()
    return { ok: true, message: 'Você saiu do servidor.' }
  }, [activeServer, loadServers, userId])

  const saveServerNickname = useCallback(async (nickname: string) => {
    if (!supabase || !activeServer || !userId) return { ok: false, message: 'Conecte sua identidade antes de continuar.' }
    const { error: requestError } = await supabase.from('server_member_preferences').upsert({ server_id: activeServer.id, user_id: userId, nickname: nickname.trim() || null })
    return requestError ? { ok: false, message: 'Não foi possível salvar o apelido.' } : { ok: true, message: 'Apelido do servidor atualizado.' }
  }, [activeServer, userId])

  const createCategory = useCallback(async (name: string) => {
    if (!supabase || !activeServer || !['owner', 'moderator'].includes(activeServer.role)) return { ok: false, message: 'Sem permissão para criar categorias.' }
    const { error: requestError } = await supabase.from('channel_categories').insert({ server_id: activeServer.id, name: name.trim(), position: categories.length })
    if (requestError) return { ok: false, message: 'Não foi possível criar a categoria.' }
    await loadServerControls(activeServer.id)
    return { ok: true, message: 'Categoria criada.' }
  }, [activeServer, categories.length, loadServerControls])

  const findProfile = useCallback(async (username: string) => {
    if (!supabase || !userId) return { ok: false as const, message: 'Conecte sua identidade antes de continuar.' }
    const normalized = username.trim().replace(/^@/, '').toLowerCase()
    if (!normalized) return { ok: false as const, message: 'Informe um identificador como @nome.' }
    const { data, error: requestError } = await supabase.from('profiles').select('id, nickname, username, avatar_url').eq('username', normalized).maybeSingle()
    if (requestError || !data) return { ok: false as const, message: 'Usuario nao encontrado.' }
    if (data.id === userId) return { ok: false as const, message: 'Escolha outra pessoa.' }
    return { ok: true as const, profile: mapProfile(data as ProfileRow) as PersonSummary }
  }, [userId])

  const sendFriendRequest = useCallback(async (username: string) => {
    const result = await findProfile(username)
    if (!result.ok) return result
    const { error: requestError } = await supabase!.from('friend_requests').insert({ sender_id: userId!, recipient_id: result.profile.id })
    if (requestError) return { ok: false, message: 'Nao foi possivel enviar o pedido. Talvez ele ja exista.' }
    await loadSocial()
    return { ok: true, message: `Pedido enviado para @${result.profile.username}.` }
  }, [findProfile, loadSocial, userId])

  const acceptFriendRequest = useCallback(async (requestId: string) => {
    if (!supabase) return { ok: false, message: 'Conecte sua identidade antes de continuar.' }
    const { error: requestError } = await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', requestId)
    if (requestError) return { ok: false, message: 'Nao foi possivel aceitar o pedido.' }
    await loadSocial()
    return { ok: true, message: 'Amizade confirmada.' }
  }, [loadSocial])

  const sendServerInvite = useCallback(async (serverId: string, username: string) => {
    const result = await findProfile(username)
    if (!result.ok) return result
    const { error: requestError } = await supabase!.from('server_invites').insert({ server_id: serverId, sender_id: userId!, recipient_id: result.profile.id })
    if (requestError) return { ok: false, message: 'Nao foi possivel enviar o convite. Talvez essa pessoa ja tenha sido convidada.' }
    return { ok: true, message: `Convite enviado para @${result.profile.username}.` }
  }, [findProfile, userId])

  const acceptServerInvite = useCallback(async (invite: ServerInviteSummary) => {
    if (!supabase) return { ok: false, message: 'Conecte sua identidade antes de continuar.' }
    const { error: requestError } = await supabase.from('server_invites').update({ status: 'accepted' }).eq('id', invite.id)
    if (requestError) return { ok: false, message: 'Nao foi possivel aceitar o convite.' }
    await Promise.all([loadServers(), loadSocial()])
    setActiveServerId(invite.serverId)
    return { ok: true, message: `Voce entrou em ${invite.serverName}.` }
  }, [loadServers, loadSocial])

  const sendMessage = useCallback(async (body: string, authorNickname: string) => {
    const text = body.trim()
    if (!text) return { ok: false, message: '' }

    if (demoMode) {
      setMessages((current) => [...current, {
        id: `demo-${Date.now()}`,
        channelId: activeChannelId ?? 'geral',
        authorId: 'demo-user',
        authorNickname,
        body: text,
        createdAt: new Date().toISOString(),
        editedAt: null,
      }])
      return { ok: true, message: '' }
    }

    if (!supabase || !userId || !activeChannelId) return { ok: false, message: 'Escolha um canal de texto antes de enviar.' }
    const { error: requestError } = await supabase.from('messages').insert({
      channel_id: activeChannelId,
      author_id: userId,
      body: text,
    })

    return requestError
      ? { ok: false, message: 'Nao foi possivel enviar a mensagem.' }
      : { ok: true, message: '' }
  }, [activeChannelId, demoMode, userId])

  return {
    activeChannel,
    activeChannelId,
    activeServer,
    activeServerId,
    channels,
    categories,
    channelPermissions,
    createInviteLink,
    createCategory,
    friendRequests,
    friends,
    createServer,
    error,
    loading,
    messages,
    leaveServer,
    markServerRead,
    members,
    unreadByChannel,
    voiceRestrictions,
    serverMuted,
    inviteLinks,
    sendMessage,
    sendFriendRequest,
    sendServerInvite,
    servers,
    serverInvites,
    acceptFriendRequest,
    acceptServerInvite,
    setActiveChannelId,
    setActiveServerId,
    saveServer,
    deleteServer,
    saveChannel,
    deleteChannel,
    redeemInviteLink,
    revokeInviteLink,
    saveChannelPermissions,
    saveServerNickname,
    removeMember,
    setMemberRole,
    moderateMember,
    setMuted,
    transferOwnership,
  }
}
