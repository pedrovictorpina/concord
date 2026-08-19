import { useCallback, useEffect, useRef, useState } from 'react'
import type { LocalTrack, Participant, RemoteTrack, RemoteTrackPublication, Room, TrackPublication } from 'livekit-client'
import { supabase } from '../../lib/supabase'
import { screenShareQualities } from './screen-quality'
import type { ScreenShareQuality } from './screen-quality'
import type { ScreenShareView } from './screen-shares'

type LiveKitToken = {
  serverUrl: string
  token: string
}

const tokenErrorMessages: Record<string, string> = {
  invalid_session: 'Sua sessao expirou. Entre novamente para usar a voz.',
  not_a_member: 'Voce nao e membro deste servidor.',
  cannot_speak: 'Seu cargo nao pode falar neste canal.',
  channel_not_found: 'Este canal de voz nao existe mais.',
  livekit_not_configured: 'A voz ainda nao esta configurada nesta instalacao.',
}

const describeTokenFailure = async (caught: unknown) => {
  const context = (caught as { context?: Response } | null)?.context
  if (!context || typeof context.json !== 'function') return null
  try {
    const body = await context.clone().json() as { code?: string }
    return body.code ? tokenErrorMessages[body.code] ?? null : null
  } catch {
    return null
  }
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

const shareIdFor = (publication: TrackPublication, participant: Participant) =>
  publication.trackSid || `${participant.identity}:${publication.source}`

const mergeShare = (current: ScreenShareView[], share: ScreenShareView) => {
  const known = current.some((item) => item.id === share.id || item.track === share.track)
  return known
    ? current.map((item) => item.id === share.id || item.track === share.track ? share : item)
    : [...current, share]
}

const describeShare = (
  track: LocalTrack | RemoteTrack,
  publication: TrackPublication,
  participant: Participant,
  isLocal: boolean,
): ScreenShareView => ({
  id: shareIdFor(publication, participant),
  nickname: participant.name?.trim() || 'Membro',
  isLocal,
  track,
  stream: null,
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
  const [screenShares, setScreenShares] = useState<ScreenShareView[]>([])

  const leave = useCallback(() => {
    const room = roomRef.current
    roomRef.current = null
    room?.disconnect()
    audioElementsRef.current.forEach((element) => element.remove())
    audioElementsRef.current = []
    setConnectedChannelId(null)
    setParticipants([])
    setMicrophoneEnabled(false)
    setScreenShares([])
  }, [])

  const join = useCallback(async (channelId: string, options: { microphone: boolean }) => {
    if (!supabase) {
      setError('Conecte sua conta para entrar em um canal de voz.')
      return false
    }
    if (roomRef.current) leave()

    setError('')

    let data: LiveKitToken | null = null
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('sessao ausente no cliente')
      const response = await supabase.functions.invoke<LiveKitToken>('livekit-token', { body: { channelId } })
      if (response.error || !response.data) throw response.error ?? new Error('resposta vazia do livekit-token')
      data = response.data
    } catch (caught) {
      console.error('[voz] falha ao autorizar entrada no canal', caught)
      setError(await describeTokenFailure(caught) ?? 'Nao foi possivel autorizar sua entrada no canal de voz.')
      return false
    }

    let client: typeof import('livekit-client')
    try {
      client = await import('livekit-client')
    } catch (caught) {
      console.error('[voz] falha ao carregar o cliente de midia', caught)
      setError('Nao foi possivel carregar a voz. Atualize a pagina e tente de novo.')
      return false
    }

    const { Room, RoomEvent, Track } = client
    const room = new Room({ adaptiveStream: true })
    const sync = () => {
      setParticipants([room.localParticipant, ...room.remoteParticipants.values()].map(describeParticipant))
    }

    const isScreenVideo = (publication: TrackPublication, track: LocalTrack | RemoteTrack) =>
      publication.source === Track.Source.ScreenShare && track.kind === Track.Kind.Video

    const addShare = (share: ScreenShareView) => {
      setScreenShares((current) => mergeShare(current, share))
    }
    const dropShareByTrack = (track: LocalTrack | RemoteTrack) => {
      setScreenShares((current) => current.filter((item) => item.track !== track))
    }

    room.on(RoomEvent.TrackSubscribed, (track, publication: RemoteTrackPublication, participant) => {
      if (isScreenVideo(publication, track)) {
        addShare(describeShare(track, publication, participant, false))
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
      dropShareByTrack(track)
      sync()
    })
    room.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
      const track = publication.track
      if (track && isScreenVideo(publication, track)) {
        addShare(describeShare(track, publication, participant, true))
      }
      sync()
    })
    room.on(RoomEvent.LocalTrackUnpublished, (publication) => {
      if (publication.track) dropShareByTrack(publication.track)
      sync()
    })
    room.on(RoomEvent.ParticipantConnected, sync)
    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      const sids = new Set([...participant.trackPublications.values()].map((publication) => publication.trackSid))
      setScreenShares((current) => current.filter((item) => !sids.has(item.id)))
      sync()
    })
    room.on(RoomEvent.ParticipantNameChanged, sync)
    room.on(RoomEvent.TrackPublished, sync)
    room.on(RoomEvent.TrackUnpublished, sync)
    room.on(RoomEvent.TrackMuted, sync)
    room.on(RoomEvent.TrackUnmuted, sync)
    room.on(RoomEvent.ActiveSpeakersChanged, sync)
    room.on(RoomEvent.Disconnected, () => leave())

    try {
      await room.connect(data.serverUrl, data.token)
    } catch (caught) {
      console.error('[voz] falha ao conectar na sala', caught)
      room.disconnect()
      setError('Nao foi possivel conectar ao canal de voz. Verifique sua conexao e tente de novo.')
      return false
    }

    roomRef.current = room
    setConnectedChannelId(channelId)
    sync()

    if (options.microphone) {
      if (!navigator.mediaDevices) {
        setError('Seu navegador so libera o microfone em conexoes seguras. Voce entrou sem audio.')
      } else {
        try {
          await room.localParticipant.setMicrophoneEnabled(true)
          setMicrophoneEnabled(true)
        } catch (caught) {
          console.error('[voz] falha ao publicar o microfone', caught)
          setError('Permissao de microfone negada. Voce entrou sem audio.')
        }
      }
      sync()
    }

    return true
  }, [leave])

  const setOutput = useCallback((next: boolean) => {
    outputEnabledRef.current = next
    audioElementsRef.current.forEach((element) => { element.muted = !next })
    setOutputEnabled(next)
  }, [])

  const setMicrophone = useCallback(async (next: boolean) => {
    const room = roomRef.current
    if (!room) return
    try {
      await room.localParticipant.setMicrophoneEnabled(next)
      setMicrophoneEnabled(next)
    } catch (caught) {
      console.error('[voz] falha ao alternar o microfone', caught)
      setError('Permissao de microfone negada ou indisponivel.')
    }
  }, [])

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
      if (publication?.track) {
        const share = describeShare(publication.track, publication, room.localParticipant, true)
        setScreenShares((current) => mergeShare(current, share))
      }
    } catch (caught) {
      console.error('[voz] falha ao compartilhar a tela', caught)
      setError('Captura cancelada. Nenhuma tela foi compartilhada.')
    }
  }, [])

  const stopScreenShare = useCallback(async () => {
    await roomRef.current?.localParticipant.setScreenShareEnabled(false)
    setScreenShares((current) => current.filter((item) => !item.isLocal))
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
    screenShares,
    setMicrophone,
    setOutput,
    startScreenShare,
    stopScreenShare,
  }
}
