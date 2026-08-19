import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChannelSummary, FriendRequestSummary, MessageSummary, PersonSummary, ServerInviteSummary, ServerSummary } from '@concord/contracts'
import { supabase } from '../../lib/supabase'
import { channels as demoChannels, initialMessages } from './workspace-data'

type CommunityWorkspaceOptions = {
  demoMode: boolean
  userId?: string
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
  profiles: Array<{ nickname: string }> | null
}

type ProfileRow = PersonSummary

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

const demoServer: ServerSummary = {
  id: 'demo-concord',
  name: 'Concord',
  description: 'Fundacao e sinais do produto',
  role: 'owner',
}

const demoMessageList: MessageSummary[] = initialMessages.map((message) => ({
  id: String(message.id),
  channelId: 'geral',
  authorId: message.system ? 'concord-relay' : 'produto',
  authorNickname: message.author,
  body: message.body,
  createdAt: new Date().toISOString(),
  editedAt: null,
}))

const mapMessage = (row: MessageRow): MessageSummary => ({
  id: row.id,
  channelId: row.channel_id,
  authorId: row.author_id,
  authorNickname: row.profiles?.[0]?.nickname ?? 'Membro',
  body: row.body,
  createdAt: row.created_at,
  editedAt: row.edited_at,
})

export function useCommunityWorkspace({ demoMode, userId }: CommunityWorkspaceOptions) {
  const connected = Boolean(supabase && userId && !demoMode)
  const [servers, setServers] = useState<ServerSummary[]>(demoMode ? [demoServer] : [])
  const [activeServerId, setActiveServerId] = useState<string | null>(demoMode ? demoServer.id : null)
  const [channels, setChannels] = useState<ChannelSummary[]>(demoMode ? demoChannels : [])
  const [activeChannelId, setActiveChannelId] = useState<string | null>(demoMode ? 'geral' : null)
  const [messages, setMessages] = useState<MessageSummary[]>(demoMode ? demoMessageList : [])
  const [friendRequests, setFriendRequests] = useState<FriendRequestSummary[]>([])
  const [friends, setFriends] = useState<PersonSummary[]>([])
  const [serverInvites, setServerInvites] = useState<ServerInviteSummary[]>([])
  const [loading, setLoading] = useState(connected)
  const [error, setError] = useState<string | null>(null)

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
    setActiveServerId((current) => nextServers.some((server) => server.id === current) ? current : nextServers[0]?.id ?? null)
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
      supabase.from('friend_requests').select('id, sender_id, recipient_id, status, sender:profiles!friend_requests_sender_id_fkey(id, nickname, username), recipient:profiles!friend_requests_recipient_id_fkey(id, nickname, username)').eq('status', 'pending'),
      supabase.from('friendships').select('user_a_id, user_b_id, person_a:profiles!friendships_user_a_id_fkey(id, nickname, username), person_b:profiles!friendships_user_b_id_fkey(id, nickname, username)').or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`),
      supabase.from('server_invites').select('id, server_id, status, servers(name), sender:profiles!server_invites_sender_id_fkey(id, nickname, username)').eq('recipient_id', userId).eq('status', 'pending'),
    ])

    if (requestsResult.error || friendshipsResult.error || invitesResult.error) {
      setError('Nao foi possivel carregar amizades e convites.')
      return
    }

    setFriendRequests(((requestsResult.data ?? []) as unknown as FriendRequestRow[]).map((request) => ({
      id: request.id,
      direction: request.recipient_id === userId ? 'received' : 'sent',
      person: request.recipient_id === userId ? request.sender : request.recipient,
      status: request.status,
    })).filter((request): request is FriendRequestSummary => Boolean(request.person)))
    setFriends(((friendshipsResult.data ?? []) as unknown as FriendshipRow[]).map((friendship) => (
      friendship.user_a_id === userId ? friendship.person_b : friendship.person_a
    )).filter((person): person is PersonSummary => Boolean(person)))
    setServerInvites(((invitesResult.data ?? []) as unknown as ServerInviteRow[]).map((invite) => ({
      id: invite.id,
      serverId: invite.server_id,
      serverName: invite.servers?.name ?? 'Servidor privado',
      sender: invite.sender ?? { id: '', nickname: 'Membro', username: 'membro' },
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
    void loadMessages(activeChannelId)
  }, [activeChannelId, demoMode, loadMessages])

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

  const findProfile = useCallback(async (username: string) => {
    if (!supabase || !userId) return { ok: false as const, message: 'Conecte sua identidade antes de continuar.' }
    const normalized = username.trim().replace(/^@/, '').toLowerCase()
    if (!normalized) return { ok: false as const, message: 'Informe um identificador como @nome.' }
    const { data, error: requestError } = await supabase.from('profiles').select('id, nickname, username').eq('username', normalized).maybeSingle()
    if (requestError || !data) return { ok: false as const, message: 'Usuario nao encontrado.' }
    if (data.id === userId) return { ok: false as const, message: 'Escolha outra pessoa.' }
    return { ok: true as const, profile: data as ProfileRow }
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
    friendRequests,
    friends,
    createServer,
    error,
    loading,
    messages,
    sendMessage,
    sendFriendRequest,
    sendServerInvite,
    servers,
    serverInvites,
    acceptFriendRequest,
    acceptServerInvite,
    setActiveChannelId,
    setActiveServerId,
  }
}
