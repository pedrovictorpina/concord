export type ChannelKind = 'text' | 'voice'

export type UserStatus = 'online' | 'away' | 'busy' | 'offline'

export type ChannelSummary = {
  id: string
  name: string
  kind: ChannelKind
}

export type VoicePreferences = {
  microphoneEnabled: boolean
  outputEnabled: boolean
  screenShareEnabled: boolean
}
