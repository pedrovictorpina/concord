import type { FriendPresence } from '@concord/contracts'

export type PresenceBucket = 'online' | 'away' | 'offline'

export const statusLabel = (presence: FriendPresence | undefined) => {
  if (!presence) return 'Offline'
  if (presence.voiceChannelName) return `Em voz · ${presence.voiceChannelName}`
  if (presence.status === 'away') return 'Ausente'
  if (presence.status === 'busy') return 'Não perturbe'
  return 'Disponível'
}

export const statusClass = (presence: FriendPresence | undefined) => `avatar-slot status-${presence?.status ?? 'offline'}`

// Ocupado conta como "online" aqui: o Concord ainda nao tem um filtro dedicado para ele,
// e nao existe hoje nenhum caminho que produza esse status (ver useFriendPresence).
export const presenceBucket = (presence: FriendPresence | undefined): PresenceBucket => {
  if (!presence || presence.status === 'offline') return 'offline'
  if (presence.status === 'away') return 'away'
  return 'online'
}
