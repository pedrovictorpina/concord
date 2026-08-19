import type { VoiceParticipant } from '@concord/contracts'
import type { LiveParticipant } from './useLiveRoom'

export const initialsFrom = (name: string) => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase() || '??'

export function mergeVoiceParticipants(
  presenceByChannel: Record<string, VoiceParticipant[]>,
  connectedChannelId: string | null,
  liveParticipants: LiveParticipant[],
): Record<string, VoiceParticipant[]> {
  if (!connectedChannelId) return presenceByChannel

  const merged = { ...presenceByChannel }
  const fromPresence = merged[connectedChannelId] ?? []
  const channelParticipants = liveParticipants.map((live) => {
    const known = fromPresence.find((participant) => participant.userId === live.userId)
    return {
      userId: live.userId,
      channelId: connectedChannelId,
      nickname: known?.nickname ?? live.nickname,
      username: known?.username ?? '',
      initials: known?.initials ?? initialsFrom(live.nickname),
      avatarUrl: known?.avatarUrl ?? null,
      microphoneEnabled: live.microphoneEnabled,
      outputEnabled: known?.outputEnabled ?? true,
      sharingScreen: live.sharingScreen,
      speaking: live.speaking,
    }
  })

  fromPresence.forEach((participant) => {
    if (channelParticipants.some((current) => current.userId === participant.userId)) return
    channelParticipants.push(participant)
  })

  merged[connectedChannelId] = channelParticipants
  return merged
}
