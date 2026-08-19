import { useCallback, useEffect, useRef, useState } from 'react'
import type { LocalTrack, RemoteTrack, RemoteTrackPublication, Room } from 'livekit-client'
import { supabase } from '../../lib/supabase'
import { screenShareQualities } from './screen-quality'
import type { ScreenShareQuality } from './screen-quality'

type LiveKitToken = {
  serverUrl: string
  token: string
}

export function useLiveRoom(channelId: string | null) {
  const roomRef = useRef<Room | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false)
  const [screenTrack, setScreenTrack] = useState<LocalTrack | RemoteTrack | null>(null)

  const disconnect = useCallback(() => {
    roomRef.current?.disconnect()
    roomRef.current = null
    setConnected(false)
    setMicrophoneEnabled(false)
    setScreenTrack(null)
  }, [])

  const join = useCallback(async () => {
    if (!supabase || !channelId) {
      setError('Escolha um canal de voz para entrar.')
      return false
    }
    if (roomRef.current?.state === 'connected') return true

    setError('')
    const { data, error: tokenError } = await supabase.functions.invoke<LiveKitToken>('livekit-token', {
      body: { channelId },
    })
    if (tokenError || !data) {
      setError('Nao foi possivel autorizar sua entrada no canal de voz.')
      return false
    }

    const { Room, RoomEvent, Track } = await import('livekit-client')
    const room = new Room({ adaptiveStream: true })
    room.on(RoomEvent.TrackSubscribed, (track, publication: RemoteTrackPublication) => {
      if (publication.source === Track.Source.ScreenShare && track.kind === Track.Kind.Video) {
        setScreenTrack(track as RemoteTrack)
      }
      if (track.kind === Track.Kind.Audio) document.body.append(track.attach())
    })
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      track.detach().forEach((element) => element.remove())
      setScreenTrack((current) => current === track ? null : current)
    })
    room.on(RoomEvent.Disconnected, () => disconnect())

    try {
      await room.connect(data.serverUrl, data.token)
      roomRef.current = room
      setConnected(true)
      return true
    } catch {
      room.disconnect()
      setError('Nao foi possivel conectar ao canal de voz.')
      return false
    }
  }, [channelId, disconnect])

  const toggleMicrophone = useCallback(async () => {
    if (!roomRef.current && !(await join())) return
    const nextValue = !microphoneEnabled
    try {
      await roomRef.current?.localParticipant.setMicrophoneEnabled(nextValue)
      setMicrophoneEnabled(nextValue)
    } catch {
      setError('Permissao de microfone negada ou indisponivel.')
    }
  }, [join, microphoneEnabled])

  const startScreenShare = useCallback(async (quality: ScreenShareQuality) => {
    if (!roomRef.current && !(await join())) return
    try {
      const resolution = screenShareQualities[quality].resolution
      const publication = await roomRef.current?.localParticipant.setScreenShareEnabled(
        true,
        { contentHint: 'detail', resolution, systemAudio: 'include', video: true },
        { degradationPreference: 'maintain-resolution', simulcast: true },
      )
      if (publication?.track) setScreenTrack(publication.track)
    } catch {
      setError('Captura cancelada. Nenhuma tela foi compartilhada.')
    }
  }, [join])

  const stopScreenShare = useCallback(async () => {
    await roomRef.current?.localParticipant.setScreenShareEnabled(false)
    setScreenTrack(null)
  }, [])

  useEffect(() => disconnect, [disconnect])

  return {
    connected,
    disconnect,
    error,
    join,
    microphoneEnabled,
    screenTrack,
    startScreenShare,
    stopScreenShare,
    toggleMicrophone,
  }
}
