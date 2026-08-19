import type { LocalTrack, RemoteTrack } from 'livekit-client'

export type ScreenShareView = {
  id: string
  nickname: string
  isLocal: boolean
  track: LocalTrack | RemoteTrack | null
  stream: MediaStream | null
}
