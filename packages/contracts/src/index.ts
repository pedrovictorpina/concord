export type ChannelKind = 'text' | 'voice'

export type UserStatus = 'online' | 'away' | 'busy' | 'offline'

export type ChannelSummary = {
  id: string
  name: string
  kind: ChannelKind
}

export type ServerSummary = {
  id: string
  name: string
  description: string
  role: 'owner' | 'member'
}

export type MessageSummary = {
  id: string
  channelId: string
  authorId: string
  authorNickname: string
  body: string
  createdAt: string
  editedAt: string | null
}

export type VoicePreferences = {
  microphoneEnabled: boolean
  outputEnabled: boolean
  screenShareEnabled: boolean
}
