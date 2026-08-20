import { useCallback, useEffect, useRef, useState } from 'react'
import type { LocalTrack, Participant, RemoteTrack, RemoteTrackPublication, Room, TrackPublication } from 'livekit-client'
import { supabase } from '../../lib/supabase'
import { screenShareQualities } from './screen-quality'
import type { ScreenShareQuality } from './screen-quality'
import type { ScreenShareView } from './screen-shares'
import { audioCaptureOptions, readVoiceProcessing } from './voice-preferences'
import type { VoiceProcessing } from './voice-preferences'

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
  const matches = (item: ScreenShareView) => item.id === share.id || item.track === share.track
  return current.some(matches)
    ? current.map((item) => matches(item) ? { ...share, hasAudio: share.hasAudio || item.hasAudio } : item)
    : [...current, share]
}

const describeShare = (
  track: LocalTrack | RemoteTrack,
  publication: TrackPublication,
  participant: Participant,
  isLocal: boolean,
  hasAudio: boolean,
): ScreenShareView => ({
  id: shareIdFor(publication, participant),
  participantId: participant.identity,
  nickname: participant.name?.trim() || 'Membro',
  isLocal,
  hasAudio,
  track,
  stream: null,
})

const withAudioFlag = (current: ScreenShareView[], participantId: string, hasAudio: boolean) =>
  current.map((item) => item.participantId === participantId ? { ...item, hasAudio } : item)

export function useLiveRoom() {
  const roomRef = useRef<Room | null>(null)
  const clientRef = useRef<typeof import('livekit-client') | null>(null)
  const audioElementsRef = useRef<Array<{ element: HTMLAudioElement; participantId: string }>>([])
  const volumeRef = useRef<Record<string, number>>({})
  const outputEnabledRef = useRef(true)
  const screenAudioRef = useRef(new Set<string>())
  const processingRef = useRef<VoiceProcessing>(readVoiceProcessing())
  const [connectedChannelId, setConnectedChannelId] = useState<string | null>(null)
  const [participants, setParticipants] = useState<LiveParticipant[]>([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [audioBlocked, setAudioBlocked] = useState(false)
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false)
  const [outputEnabled, setOutputEnabled] = useState(true)
  const [screenShares, setScreenShares] = useState<ScreenShareView[]>([])
  const [volumeByUser, setVolumeByUser] = useState<Record<string, number>>({})

  const leave = useCallback(() => {
    const room = roomRef.current
    roomRef.current = null
    room?.disconnect()
    audioElementsRef.current.forEach((item) => item.element.remove())
    audioElementsRef.current = []
    volumeRef.current = {}
    screenAudioRef.current.clear()
    setConnectedChannelId(null)
    setParticipants([])
    setMicrophoneEnabled(false)
    setScreenShares([])
    setVolumeByUser({})
    setNotice('')
    setAudioBlocked(false)
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
    const isScreenAudio = (publication: TrackPublication) =>
      publication.source === Track.Source.ScreenShareAudio

    const addShare = (share: ScreenShareView) => {
      setScreenShares((current) => mergeShare(current, share))
    }
    const dropShareByTrack = (track: LocalTrack | RemoteTrack) => {
      setScreenShares((current) => current.filter((item) => item.track !== track))
    }
    const markScreenAudio = (participant: Participant, hasAudio: boolean) => {
      if (hasAudio) screenAudioRef.current.add(participant.identity)
      else screenAudioRef.current.delete(participant.identity)
      setScreenShares((current) => withAudioFlag(current, participant.identity, hasAudio))
    }

    room.on(RoomEvent.TrackSubscribed, (track, publication: RemoteTrackPublication, participant) => {
      if (isScreenVideo(publication, track)) {
        addShare(describeShare(track, publication, participant, false, screenAudioRef.current.has(participant.identity)))
      }
      if (isScreenAudio(publication)) markScreenAudio(participant, true)
      if (track.kind === Track.Kind.Audio) {
        const audio = track.attach() as HTMLAudioElement
        audio.muted = !outputEnabledRef.current
        audio.volume = volumeRef.current[participant.identity] ?? 1
        audioElementsRef.current.push({ element: audio, participantId: participant.identity })
        document.body.append(audio)
        void audio.play().catch(() => setAudioBlocked(true))
      }
      sync()
    })
    room.on(RoomEvent.TrackUnsubscribed, (track, publication: RemoteTrackPublication, participant) => {
      const detached = track.detach()
      detached.forEach((element) => element.remove())
      audioElementsRef.current = audioElementsRef.current.filter((item) => !detached.includes(item.element))
      dropShareByTrack(track)
      if (isScreenAudio(publication)) markScreenAudio(participant, false)
      sync()
    })
    room.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
      const track = publication.track
      if (track && isScreenVideo(publication, track)) {
        addShare(describeShare(track, publication, participant, true, screenAudioRef.current.has(participant.identity)))
      }
      if (isScreenAudio(publication)) markScreenAudio(participant, true)
      sync()
    })
    room.on(RoomEvent.LocalTrackUnpublished, (publication, participant) => {
      if (publication.track) dropShareByTrack(publication.track)
      if (isScreenAudio(publication)) markScreenAudio(participant, false)
      sync()
    })
    room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
      setAudioBlocked(!room.canPlaybackAudio)
    })
    room.on(RoomEvent.ParticipantConnected, sync)
    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      screenAudioRef.current.delete(participant.identity)
      setScreenShares((current) => current.filter((item) => item.participantId !== participant.identity))
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
    clientRef.current = client
    setConnectedChannelId(channelId)
    setAudioBlocked(!room.canPlaybackAudio)
    sync()

    if (options.microphone) {
      if (!navigator.mediaDevices) {
        setError('Seu navegador so libera o microfone em conexoes seguras. Voce entrou sem audio.')
      } else {
        try {
          await room.localParticipant.setMicrophoneEnabled(true, audioCaptureOptions(processingRef.current))
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
    audioElementsRef.current.forEach((item) => { item.element.muted = !next })
    setOutputEnabled(next)
  }, [])

  const setMicrophone = useCallback(async (next: boolean) => {
    const room = roomRef.current
    if (!room) return
    try {
      await room.localParticipant.setMicrophoneEnabled(next, next ? audioCaptureOptions(processingRef.current) : undefined)
      setMicrophoneEnabled(next)
    } catch (caught) {
      console.error('[voz] falha ao alternar o microfone', caught)
      setError('Permissao de microfone negada ou indisponivel.')
    }
  }, [])

  const startScreenShare = useCallback(async (quality: ScreenShareQuality) => {
    const room = roomRef.current
    const client = clientRef.current
    if (!room || !client) return
    setNotice('')
    try {
      const resolution = screenShareQualities[quality].resolution
      const publication = await room.localParticipant.setScreenShareEnabled(
        true,
        {
          audio: {
            autoGainControl: false,
            echoCancellation: false,
            noiseSuppression: false,
            restrictOwnAudio: true,
            suppressLocalAudioPlayback: true,
          } as unknown as boolean,
          contentHint: 'detail',
          resolution,
          selfBrowserSurface: 'exclude',
          systemAudio: 'include',
          video: true,
        },
        {
          audioPreset: client.AudioPresets.musicHighQualityStereo,
          degradationPreference: 'maintain-resolution',
          dtx: false,
          red: false,
          simulcast: true,
        },
      )
      const audioPublication = room.localParticipant.getTrackPublication(client.Track.Source.ScreenShareAudio)
      if (audioPublication) screenAudioRef.current.add(room.localParticipant.identity)
      else setNotice('Sua tela foi compartilhada sem som. Marque "Compartilhar audio" na janela do navegador para levar o audio junto.')
      if (audioPublication) setNotice('Tela transmitindo com som. Se voce ouve a chamada pela caixa de som, use fone: o navegador pode devolver as vozes junto com o audio da tela.')
      if (publication?.track) {
        const share = describeShare(publication.track, publication, room.localParticipant, true, Boolean(audioPublication))
        setScreenShares((current) => mergeShare(current, share))
      }
    } catch (caught) {
      console.error('[voz] falha ao compartilhar a tela', caught)
      setError('Captura cancelada. Nenhuma tela foi compartilhada.')
    }
  }, [])

  const stopScreenShare = useCallback(async () => {
    const room = roomRef.current
    if (room) screenAudioRef.current.delete(room.localParticipant.identity)
    await room?.localParticipant.setScreenShareEnabled(false)
    setScreenShares((current) => current.filter((item) => !item.isLocal))
    setNotice('')
  }, [])

  const applyVoiceProcessing = useCallback(async (next: VoiceProcessing) => {
    processingRef.current = next
    const room = roomRef.current
    const client = clientRef.current
    if (!room || !client) return
    const publication = room.localParticipant.getTrackPublication(client.Track.Source.Microphone)
    const track = publication?.audioTrack
    if (!track) return
    try {
      await track.restartTrack(audioCaptureOptions(next))
    } catch (caught) {
      console.error('[voz] falha ao aplicar o tratamento de audio', caught)
      setError('Nao foi possivel aplicar o tratamento de audio no microfone.')
    }
  }, [])

  const setScreenShareWatched = useCallback((participantId: string, watched: boolean) => {
    const room = roomRef.current
    const client = clientRef.current
    if (!room || !client) return
    const participant = [...room.remoteParticipants.values()].find((item) => item.identity === participantId)
    if (!participant) return
    participant.getTrackPublication(client.Track.Source.ScreenShare)?.setSubscribed(watched)
    participant.getTrackPublication(client.Track.Source.ScreenShareAudio)?.setSubscribed(watched)
  }, [])

  const setParticipantVolume = useCallback((userId: string, volume: number) => {
    const safe = Math.min(1, Math.max(0, volume))
    volumeRef.current = { ...volumeRef.current, [userId]: safe }
    audioElementsRef.current.forEach((item) => {
      if (item.participantId === userId) item.element.volume = safe
    })
    const participant = [...(roomRef.current?.remoteParticipants.values() ?? [])].find((item) => item.identity === userId)
    participant?.setVolume(safe)
    setVolumeByUser((current) => ({ ...current, [userId]: safe }))
  }, [])

  const enableAudioPlayback = useCallback(async () => {
    const room = roomRef.current
    if (!room) return
    try {
      await room.startAudio()
      audioElementsRef.current.forEach((item) => { void item.element.play().catch(() => undefined) })
      setAudioBlocked(!room.canPlaybackAudio)
    } catch (caught) {
      console.error('[voz] falha ao liberar a reproducao de audio', caught)
    }
  }, [])

  useEffect(() => leave, [leave])

  return {
    audioBlocked,
    connectedChannelId,
    enableAudioPlayback,
    error,
    join,
    leave,
    microphoneEnabled,
    notice,
    outputEnabled,
    participants,
    screenShares,
    setMicrophone,
    setOutput,
    applyVoiceProcessing,
    setParticipantVolume,
    setScreenShareWatched,
    startScreenShare,
    stopScreenShare,
    volumeByUser,
  }
}
