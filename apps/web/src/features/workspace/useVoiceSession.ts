import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { VoiceParticipant } from '@concord/contracts'
import { useLiveRoom } from './useLiveRoom'
import { useScreenShare } from './useScreenShare'
import { useVoicePresence } from './useVoicePresence'
import { mergeVoiceParticipants } from './voice-participants'
import type { ScreenShareQuality } from './screen-quality'
import type { ScreenShareView } from './screen-shares'
import type { WorkspaceIdentity } from './workspace-types'

export type VoiceTarget = {
  channelId: string
  channelName: string
  serverId: string
  serverName: string
}

type VoiceSessionOptions = {
  demoMode: boolean
  identity: WorkspaceIdentity
  microphoneDisabled: boolean
  observedServerId: string | null
  outputDisabled: boolean
  userId?: string
}

export function useVoiceSession({ demoMode, identity, microphoneDisabled, observedServerId, outputDisabled, userId }: VoiceSessionOptions) {
  const liveRoom = useLiveRoom()
  const demoShare = useScreenShare()
  const [target, setTarget] = useState<VoiceTarget | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [demoPreferences, setDemoPreferences] = useState({ microphoneEnabled: true, outputEnabled: true })
  const microphoneBeforeMuteRef = useRef(false)

  const microphoneEnabled = demoMode ? demoPreferences.microphoneEnabled : liveRoom.microphoneEnabled
  const outputEnabled = demoMode ? demoPreferences.outputEnabled : liveRoom.outputEnabled
  const error = demoMode ? demoShare.error : liveRoom.error
  const connectedChannelId = target?.channelId ?? null

  const screenShares = useMemo<ScreenShareView[]>(() => {
    if (!demoMode) return liveRoom.screenShares
    if (!demoShare.stream) return []
    return [{
      id: 'demo-screen',
      participantId: userId ?? 'demo-user',
      nickname: identity.nickname,
      isLocal: true,
      hasAudio: demoShare.stream.getAudioTracks().length > 0,
      track: null,
      stream: demoShare.stream,
    }]
  }, [demoMode, demoShare.stream, identity.nickname, liveRoom.screenShares, userId])

  const sharing = screenShares.some((share) => share.isLocal)

  useEffect(() => {
    if (demoMode || !target || liveRoom.connectedChannelId === target.channelId) return
    setTarget(null)
  }, [demoMode, liveRoom.connectedChannelId, target])

  useEffect(() => {
    if (demoMode || !target) return
    if (microphoneDisabled && liveRoom.microphoneEnabled) void liveRoom.setMicrophone(false)
    if (outputDisabled && liveRoom.outputEnabled) liveRoom.setOutput(false)
  }, [demoMode, liveRoom, microphoneDisabled, outputDisabled, target])

  const presenceSelf = useMemo(() => {
    if (demoMode || !target || !userId) return null
    return {
      serverId: target.serverId,
      payload: {
        userId,
        channelId: target.channelId,
        nickname: identity.nickname,
        username: identity.username,
        initials: identity.initials,
        avatarUrl: identity.avatarUrl,
        microphoneEnabled: microphoneEnabled && !microphoneDisabled,
        outputEnabled: outputEnabled && !outputDisabled,
        sharingScreen: sharing,
      },
    }
  }, [demoMode, identity, microphoneDisabled, microphoneEnabled, outputDisabled, outputEnabled, sharing, target, userId])

  const presenceByChannel = useVoicePresence({ demoMode, observedServerId, self: presenceSelf, userId })

  const participantsByChannel = useMemo<Record<string, VoiceParticipant[]>>(() => {
    if (!demoMode) return mergeVoiceParticipants(presenceByChannel, connectedChannelId, liveRoom.participants)
    if (!connectedChannelId) return {}
    return {
      [connectedChannelId]: [{
        userId: userId ?? 'demo-user',
        channelId: connectedChannelId,
        nickname: identity.nickname,
        username: identity.username,
        initials: identity.initials,
        avatarUrl: identity.avatarUrl,
        microphoneEnabled: microphoneEnabled && !microphoneDisabled,
        outputEnabled: outputEnabled && !outputDisabled,
        sharingScreen: sharing,
        speaking: false,
      }],
    }
  }, [connectedChannelId, demoMode, identity, liveRoom.participants, microphoneDisabled, microphoneEnabled, outputDisabled, outputEnabled, presenceByChannel, sharing, userId])

  const join = useCallback(async (next: VoiceTarget) => {
    if (connecting || target?.channelId === next.channelId) return
    setConnecting(true)
    try {
      const connected = demoMode
        ? await new Promise<boolean>((resolve) => window.setTimeout(() => resolve(true), 250))
        : await liveRoom.join(next.channelId, { microphone: !microphoneDisabled })
      if (connected) setTarget(next)
    } finally {
      setConnecting(false)
    }
  }, [connecting, demoMode, liveRoom, microphoneDisabled, target])

  const leave = useCallback(() => {
    setTarget(null)
    if (demoMode) {
      demoShare.stop()
      setDemoPreferences({ microphoneEnabled: true, outputEnabled: true })
      return
    }
    liveRoom.leave()
  }, [demoMode, demoShare, liveRoom])

  const applyPreferences = useCallback((next: { microphoneEnabled: boolean; outputEnabled: boolean }) => {
    if (demoMode) {
      setDemoPreferences(next)
      return
    }
    if (next.outputEnabled !== liveRoom.outputEnabled) liveRoom.setOutput(next.outputEnabled)
    if (next.microphoneEnabled !== liveRoom.microphoneEnabled) void liveRoom.setMicrophone(next.microphoneEnabled)
  }, [demoMode, liveRoom])

  const toggleMicrophone = useCallback(() => {
    if (microphoneDisabled) return
    const nextMicrophone = !microphoneEnabled
    microphoneBeforeMuteRef.current = nextMicrophone
    applyPreferences({
      microphoneEnabled: nextMicrophone,
      outputEnabled: nextMicrophone && !outputEnabled && !outputDisabled ? true : outputEnabled,
    })
  }, [applyPreferences, microphoneDisabled, microphoneEnabled, outputDisabled, outputEnabled])

  const toggleOutput = useCallback(() => {
    if (outputDisabled) return
    const nextOutput = !outputEnabled
    if (!nextOutput) microphoneBeforeMuteRef.current = microphoneEnabled
    const restored = microphoneBeforeMuteRef.current && !microphoneDisabled
    applyPreferences({
      microphoneEnabled: nextOutput ? restored : false,
      outputEnabled: nextOutput,
    })
  }, [applyPreferences, microphoneDisabled, microphoneEnabled, outputDisabled, outputEnabled])

  const startScreenShare = useCallback((quality: ScreenShareQuality) => {
    if (demoMode) return demoShare.start(quality)
    return liveRoom.startScreenShare(quality)
  }, [demoMode, demoShare, liveRoom])

  const stopScreenShare = useCallback(() => {
    if (demoMode) {
      demoShare.stop()
      return
    }
    void liveRoom.stopScreenShare()
  }, [demoMode, demoShare, liveRoom])

  return {
    audioBlocked: demoMode ? false : liveRoom.audioBlocked,
    connectedChannelId,
    connecting,
    enableAudioPlayback: liveRoom.enableAudioPlayback,
    error,
    join,
    leave,
    microphoneEnabled,
    notice: demoMode ? '' : liveRoom.notice,
    outputEnabled,
    participantsByChannel,
    screenShares,
    setParticipantVolume: liveRoom.setParticipantVolume,
    sharing,
    startScreenShare,
    stopScreenShare,
    target,
    toggleMicrophone,
    toggleOutput,
    volumeByUser: liveRoom.volumeByUser,
  }
}
