import { useEffect, useRef, useState } from 'react'
import type { FriendPresence, PersonSummary } from '@concord/contracts'
import { supabase } from '../../lib/supabase'

type PresenceRecord = FriendPresence & { presence_ref: string }

type FriendPresenceOptions = {
  demoMode: boolean
  friends: PersonSummary[]
  userId?: string
  voice: { channelName: string; serverName: string } | null
}

const demoPresence = (friends: PersonSummary[]): Record<string, FriendPresence> => {
  const map: Record<string, FriendPresence> = {}
  friends.forEach((friend, index) => {
    map[friend.id] = index === 0
      ? { userId: friend.id, status: 'online', voiceChannelName: 'sala-da-madrugada', voiceServerName: 'Concord' }
      : { userId: friend.id, status: 'online', voiceChannelName: null, voiceServerName: null }
  })
  return map
}

const topic = 'presence:concord'

export function useFriendPresence({ demoMode, friends, userId, voice }: FriendPresenceOptions) {
  const [presenceByUser, setPresenceByUser] = useState<Record<string, FriendPresence>>({})
  const selfRef = useRef<FriendPresence | null>(null)
  const readyRef = useRef(false)
  const channelRef = useRef<ReturnType<NonNullable<typeof supabase>['channel']> | null>(null)

  selfRef.current = userId
    ? {
      userId,
      status: 'online',
      voiceChannelName: voice?.channelName ?? null,
      voiceServerName: voice?.serverName ?? null,
    }
    : null

  const selfKey = selfRef.current ? JSON.stringify(selfRef.current) : ''

  useEffect(() => {
    if (demoMode) {
      setPresenceByUser(demoPresence(friends))
      return
    }
    setPresenceByUser({})
    if (!supabase || !userId) return

    const client = supabase
    const channel = client.channel(topic, { config: { presence: { key: userId } } })
    const sync = () => {
      const state = channel.presenceState<PresenceRecord>()
      const next: Record<string, FriendPresence> = {}
      Object.values(state).forEach((records) => {
        const record = records.at(-1)
        if (!record?.userId) return
        next[record.userId] = {
          userId: record.userId,
          status: record.status ?? 'online',
          voiceChannelName: record.voiceChannelName ?? null,
          voiceServerName: record.voiceServerName ?? null,
        }
      })
      setPresenceByUser(next)
    }

    channel
      .on('presence', { event: 'sync' }, sync)
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') return
        readyRef.current = true
        if (selfRef.current) void channel.track(selfRef.current)
      })
    channelRef.current = channel

    return () => {
      readyRef.current = false
      channelRef.current = null
      void client.removeChannel(channel)
    }
  }, [demoMode, friends, userId])

  useEffect(() => {
    if (!readyRef.current || !channelRef.current || !selfRef.current) return
    void channelRef.current.track(selfRef.current)
  }, [selfKey])

  return presenceByUser
}
