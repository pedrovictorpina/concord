import type { LocalTrack, RemoteTrack } from 'livekit-client'

export type ScreenShareView = {
  id: string
  participantId: string
  nickname: string
  isLocal: boolean
  hasAudio: boolean
  track: LocalTrack | RemoteTrack | null
  stream: MediaStream | null
}
