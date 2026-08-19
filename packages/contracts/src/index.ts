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
  role: 'owner' | 'moderator' | 'member'
}

export type ServerMemberRole = ServerSummary['role']

export type ChannelPermission = {
  channelId: string
  role: Exclude<ServerMemberRole, 'owner'>
  canRead: boolean
  canWrite: boolean
  canSpeak: boolean
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

export type PersonSummary = {
  id: string
  nickname: string
  username: string
}

export type DirectMessageSummary = {
  id: string
  authorId: string
  authorNickname: string
  body: string
  createdAt: string
}

export type FriendRequestSummary = {
  id: string
  direction: 'received' | 'sent'
  person: PersonSummary
  status: 'pending' | 'accepted' | 'declined' | 'cancelled'
}

export type ServerInviteSummary = {
  id: string
  serverId: string
  serverName: string
  sender: PersonSummary
  status: 'pending' | 'accepted' | 'declined'
}

export type VoiceParticipant = {
  userId: string
  channelId: string
  nickname: string
  username: string
  initials: string
  avatarUrl: string | null
  microphoneEnabled: boolean
  outputEnabled: boolean
  sharingScreen: boolean
  speaking: boolean
}

export type VoicePreferences = {
  microphoneEnabled: boolean
  outputEnabled: boolean
  screenShareEnabled: boolean
}
