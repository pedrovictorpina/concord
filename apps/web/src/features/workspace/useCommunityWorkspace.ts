import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChannelSummary, MessageSummary, ServerSummary } from '@concord/contracts'
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

  useEffect(() => {
    if (!connected) {
      setLoading(false)
      return
    }

    setLoading(true)
    void loadServers().finally(() => setLoading(false))
  }, [connected, loadServers])

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
    createServer,
    error,
    loading,
    messages,
    sendMessage,
    servers,
    setActiveChannelId,
    setActiveServerId,
  }
}
