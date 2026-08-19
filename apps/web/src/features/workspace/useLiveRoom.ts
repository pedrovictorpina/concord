import { useCallback, useEffect, useRef, useState } from 'react'
import type { LocalTrack, Participant, RemoteTrack, RemoteTrackPublication, Room } from 'livekit-client'
import { supabase } from '../../lib/supabase'
import { screenShareQualities } from './screen-quality'
import type { ScreenShareQuality } from './screen-quality'

type LiveKitToken = {
  serverUrl: string
  token: string
}

export type LiveParticipant = {
  userId: string
  nickname: string
  microphoneEnabled: boolean
  sharingScreen: boolean
  speaking: boolean
}

const describeParticipant = (participant: Participant): LiveParticipant => ({
  userId: participant.identity,
  nickname: participant.name?.trim() || 'Membro',
  microphoneEnabled: participant.isMicrophoneEnabled,
  sharingScreen: participant.isScreenShareEnabled,
  speaking: participant.isSpeaking,
})

export function useLiveRoom() {
  const roomRef = useRef<Room | null>(null)
  const audioElementsRef = useRef<HTMLAudioElement[]>([])
  const outputEnabledRef = useRef(true)
  const [connectedChannelId, setConnectedChannelId] = useState<string | null>(null)
  const [participants, setParticipants] = useState<LiveParticipant[]>([])
  const [error, setError] = useState('')
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false)
  const [outputEnabled, setOutputEnabled] = useState(true)
  const [screenTrack, setScreenTrack] = useState<LocalTrack | RemoteTrack | null>(null)

  const leave = useCallback(() => {
    const room = roomRef.current
    roomRef.current = null
    room?.disconnect()
    audioElementsRef.current.forEach((element) => element.remove())
    audioElementsRef.current = []
    setConnectedChannelId(null)
    setParticipants([])
    setMicrophoneEnabled(false)
    setScreenTrack(null)
  }, [])

  const join = useCallback(async (channelId: string, options: { microphone: boolean }) => {
    if (!supabase) {
      setError('Conecte sua conta para entrar em um canal de voz.')
      return false
    }
    if (roomRef.current) leave()

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
    const sync = () => {
      setParticipants([room.localParticipant, ...room.remoteParticipants.values()].map(describeParticipant))
    }

    room.on(RoomEvent.TrackSubscribed, (track, publication: RemoteTrackPublication) => {
      if (publication.source === Track.Source.ScreenShare && track.kind === Track.Kind.Video) {
        setScreenTrack(track as RemoteTrack)
      }
      if (track.kind === Track.Kind.Audio) {
        const audio = track.attach() as HTMLAudioElement
        audio.muted = !outputEnabledRef.current
        audioElementsRef.current.push(audio)
        document.body.append(audio)
      }
      sync()
    })
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      track.detach().forEach((element) => element.remove())
      setScreenTrack((current) => current === track ? null : current)
      sync()
    })
    room.on(RoomEvent.ParticipantConnected, sync)
    room.on(RoomEvent.ParticipantDisconnected, sync)
    room.on(RoomEvent.ParticipantNameChanged, sync)
    room.on(RoomEvent.TrackPublished, sync)
    room.on(RoomEvent.TrackUnpublished, sync)
    room.on(RoomEvent.TrackMuted, sync)
    room.on(RoomEvent.TrackUnmuted, sync)
    room.on(RoomEvent.LocalTrackPublished, sync)
    room.on(RoomEvent.LocalTrackUnpublished, sync)
    room.on(RoomEvent.ActiveSpeakersChanged, sync)
    room.on(RoomEvent.Disconnected, () => leave())

    try {
      await room.connect(data.serverUrl, data.token)
    } catch {
      room.disconnect()
      setError('Nao foi possivel conectar ao canal de voz.')
      return false
    }

    roomRef.current = room
    setConnectedChannelId(channelId)
    sync()

    if (options.microphone) {
      try {
        await room.localParticipant.setMicrophoneEnabled(true)
        setMicrophoneEnabled(true)
      } catch {
        setError('Permissao de microfone negada. Voce entrou sem audio.')
      }
      sync()
    }

    return true
  }, [leave])

  const toggleOutput = useCallback(() => {
    const nextValue = !outputEnabledRef.current
    outputEnabledRef.current = nextValue
    audioElementsRef.current.forEach((element) => { element.muted = !nextValue })
    setOutputEnabled(nextValue)
  }, [])

  const toggleMicrophone = useCallback(async () => {
    const room = roomRef.current
    if (!room) return
    const nextValue = !microphoneEnabled
    try {
      await room.localParticipant.setMicrophoneEnabled(nextValue)
      setMicrophoneEnabled(nextValue)
    } catch {
      setError('Permissao de microfone negada ou indisponivel.')
    }
  }, [microphoneEnabled])

  const startScreenShare = useCallback(async (quality: ScreenShareQuality) => {
    const room = roomRef.current
    if (!room) return
    try {
      const resolution = screenShareQualities[quality].resolution
      const publication = await room.localParticipant.setScreenShareEnabled(
        true,
        { contentHint: 'detail', resolution, systemAudio: 'include', video: true },
        { degradationPreference: 'maintain-resolution', simulcast: true },
      )
      if (publication?.track) setScreenTrack(publication.track)
    } catch {
      setError('Captura cancelada. Nenhuma tela foi compartilhada.')
    }
  }, [])

  const stopScreenShare = useCallback(async () => {
    await roomRef.current?.localParticipant.setScreenShareEnabled(false)
    setScreenTrack(null)
  }, [])

  useEffect(() => leave, [leave])

  return {
    connectedChannelId,
    error,
    join,
    leave,
    microphoneEnabled,
    outputEnabled,
    participants,
    screenTrack,
    startScreenShare,
    stopScreenShare,
    toggleMicrophone,
    toggleOutput,
  }
}
