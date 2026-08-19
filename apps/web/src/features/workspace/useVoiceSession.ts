import { useCallback, useEffect, useMemo, useState } from 'react'
import type { VoiceParticipant } from '@concord/contracts'
import { useLiveRoom } from './useLiveRoom'
import { useScreenShare } from './useScreenShare'
import { useVoicePresence } from './useVoicePresence'
import { mergeVoiceParticipants } from './voice-participants'
import type { ScreenShareQuality } from './screen-quality'
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

  const microphoneEnabled = demoMode ? demoPreferences.microphoneEnabled : liveRoom.microphoneEnabled
  const outputEnabled = demoMode ? demoPreferences.outputEnabled : liveRoom.outputEnabled
  const sharing = demoMode ? Boolean(demoShare.stream) : Boolean(liveRoom.screenTrack)
  const error = demoMode ? demoShare.error : liveRoom.error
  const connectedChannelId = target?.channelId ?? null

  useEffect(() => {
    if (demoMode || !target || liveRoom.connectedChannelId === target.channelId) return
    setTarget(null)
  }, [demoMode, liveRoom.connectedChannelId, target])

  useEffect(() => {
    if (demoMode || !target) return
    if (microphoneDisabled && liveRoom.microphoneEnabled) void liveRoom.toggleMicrophone()
    if (outputDisabled && liveRoom.outputEnabled) liveRoom.toggleOutput()
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
        sharingScreen: sharing,
      },
    }
  }, [demoMode, identity, microphoneDisabled, microphoneEnabled, sharing, target, userId])

  const presenceByChannel = useVoicePresence({ demoMode, observedServerId, self: presenceSelf, userId })

  const participantsByChannel = useMemo<Record<string, VoiceParticipant[]>>(() => {
    if (!demoMode) return mergeVoiceParticipants(presenceByChannel, connectedChannelId, liveRoom.participants)
    if (!connectedChannelId) return {}
    return {
      [connectedChannelId]: [{
        userId: userId ?? 'voce',
        channelId: connectedChannelId,
        nickname: identity.nickname,
        username: identity.username,
        initials: identity.initials,
        avatarUrl: identity.avatarUrl,
        microphoneEnabled: microphoneEnabled && !microphoneDisabled,
        sharingScreen: sharing,
        speaking: false,
      }],
    }
  }, [connectedChannelId, demoMode, identity, liveRoom.participants, microphoneDisabled, microphoneEnabled, presenceByChannel, sharing, userId])

  const join = useCallback(async (next: VoiceTarget) => {
    if (connecting || target?.channelId === next.channelId) return
    setConnecting(true)
    const connected = demoMode
      ? await new Promise<boolean>((resolve) => window.setTimeout(() => resolve(true), 250))
      : await liveRoom.join(next.channelId, { microphone: !microphoneDisabled })
    if (connected) setTarget(next)
    setConnecting(false)
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

  const toggleMicrophone = useCallback(() => {
    if (microphoneDisabled) return
    if (demoMode) {
      setDemoPreferences((current) => ({ ...current, microphoneEnabled: !current.microphoneEnabled }))
      return
    }
    void liveRoom.toggleMicrophone()
  }, [demoMode, liveRoom, microphoneDisabled])

  const toggleOutput = useCallback(() => {
    if (outputDisabled) return
    if (demoMode) {
      setDemoPreferences((current) => ({ ...current, outputEnabled: !current.outputEnabled }))
      return
    }
    liveRoom.toggleOutput()
  }, [demoMode, liveRoom, outputDisabled])

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
    connectedChannelId,
    connecting,
    error,
    join,
    leave,
    microphoneEnabled,
    outputEnabled,
    participantsByChannel,
    screenTrack: liveRoom.screenTrack,
    sharing,
    startScreenShare,
    stopScreenShare,
    stream: demoShare.stream,
    target,
    toggleMicrophone,
    toggleOutput,
  }
}
