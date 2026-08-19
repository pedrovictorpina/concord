import { useCallback, useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { VoiceParticipant } from '@concord/contracts'
import { supabase } from '../../lib/supabase'

export type VoicePresencePayload = Omit<VoiceParticipant, 'speaking'>

export type VoicePresenceSelf = {
  serverId: string
  payload: VoicePresencePayload
}

type PresenceRecord = VoicePresencePayload & { presence_ref: string }

const presenceTopic = (serverId: string) => `voice-presence:${serverId}`

const groupByChannel = (state: Record<string, PresenceRecord[]>) => {
  const grouped: Record<string, VoiceParticipant[]> = {}
  Object.values(state).forEach((records) => {
    const record = records.at(-1)
    if (!record?.channelId || !record.userId) return
    const participants = grouped[record.channelId] ?? []
    if (participants.some((participant) => participant.userId === record.userId)) return
    participants.push({
      userId: record.userId,
      channelId: record.channelId,
      nickname: record.nickname,
      username: record.username,
      initials: record.initials,
      avatarUrl: record.avatarUrl,
      microphoneEnabled: record.microphoneEnabled,
      sharingScreen: record.sharingScreen,
      speaking: false,
    })
    grouped[record.channelId] = participants
  })
  return grouped
}

export function useVoicePresence({ demoMode, observedServerId, self, userId }: {
  demoMode: boolean
  observedServerId: string | null
  self: VoicePresenceSelf | null
  userId?: string
}) {
  const [participantsByChannel, setParticipantsByChannel] = useState<Record<string, VoiceParticipant[]>>({})
  const [observedReady, setObservedReady] = useState(0)
  const [publisherReady, setPublisherReady] = useState(0)
  const observedRef = useRef<RealtimeChannel | null>(null)
  const publisherRef = useRef<RealtimeChannel | null>(null)
  const selfRef = useRef(self)
  const selfKey = self ? JSON.stringify(self) : ''
  const publishServerId = self && self.serverId !== observedServerId ? self.serverId : null

  selfRef.current = self

  const publish = useCallback(async (channel: RealtimeChannel, serverId: string) => {
    const current = selfRef.current
    if (!current || current.serverId !== serverId) return
    await channel.track(current.payload)
  }, [])

  useEffect(() => {
    setParticipantsByChannel({})
    if (!supabase || demoMode || !observedServerId || !userId) return

    const client = supabase
    const channel = client.channel(presenceTopic(observedServerId), {
      config: { presence: { key: userId } },
    })
    const sync = () => setParticipantsByChannel(groupByChannel(channel.presenceState<PresenceRecord>()))

    channel
      .on('presence', { event: 'sync' }, sync)
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') return
        setObservedReady((current) => current + 1)
        void publish(channel, observedServerId)
      })
    observedRef.current = channel

    return () => {
      observedRef.current = null
      void client.removeChannel(channel)
    }
  }, [demoMode, observedServerId, publish, userId])

  useEffect(() => {
    if (!supabase || demoMode || !publishServerId || !userId) return

    const client = supabase
    const channel = client.channel(presenceTopic(publishServerId), {
      config: { presence: { key: userId } },
    })
    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') return
      setPublisherReady((current) => current + 1)
      void publish(channel, publishServerId)
    })
    publisherRef.current = channel

    return () => {
      publisherRef.current = null
      void client.removeChannel(channel)
    }
  }, [demoMode, publish, publishServerId, userId])

  useEffect(() => {
    if (!supabase || demoMode) return
    const current = selfRef.current
    if (!current) {
      void observedRef.current?.untrack()
      return
    }
    const target = current.serverId === observedServerId ? observedRef.current : publisherRef.current
    if (target) void target.track(current.payload)
  }, [demoMode, observedReady, observedServerId, publisherReady, selfKey])

  return participantsByChannel
}
