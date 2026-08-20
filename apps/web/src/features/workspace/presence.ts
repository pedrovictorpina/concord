import type { FriendPresence } from '@concord/contracts'

export const statusLabel = (presence: FriendPresence | undefined) => {
  if (!presence) return 'Offline'
  if (presence.voiceChannelName) return `Em voz · ${presence.voiceChannelName}`
  if (presence.status === 'away') return 'Ausente'
  if (presence.status === 'busy') return 'Não perturbe'
  return 'Disponível'
}

export const statusClass = (presence: FriendPresence | undefined) => `avatar-slot status-${presence?.status ?? 'offline'}`
