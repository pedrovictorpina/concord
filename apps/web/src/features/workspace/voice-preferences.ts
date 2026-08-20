export type VoiceProfile = 'voice' | 'studio' | 'custom'

export type NoiseSuppressionLevel = 'off' | 'standard' | 'high'

export type VoiceProcessing = {
  autoGainControl: boolean
  echoCancellation: boolean
  inputDeviceId: string
  noiseSuppression: boolean
  outputDeviceId: string
  outputVolume: number
  profile: VoiceProfile
  suppressionLevel: NoiseSuppressionLevel
  voiceIsolation: boolean
}

export const defaultVoiceProcessing: VoiceProcessing = {
  autoGainControl: true,
  echoCancellation: true,
  inputDeviceId: '',
  noiseSuppression: true,
  outputDeviceId: '',
  outputVolume: 1,
  profile: 'voice',
  suppressionLevel: 'standard',
  voiceIsolation: false,
}

const storageKey = 'concord.voice.v1'

export const voiceIsolationSupported = () =>
  typeof navigator !== 'undefined'
  && typeof navigator.mediaDevices?.getSupportedConstraints === 'function'
  && 'voiceIsolation' in navigator.mediaDevices.getSupportedConstraints()

export const outputDeviceSupported = () =>
  typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype

export function profilePreset(profile: VoiceProfile, current: VoiceProcessing): VoiceProcessing {
  if (profile === 'voice') {
    return {
      ...current,
      profile,
      autoGainControl: true,
      echoCancellation: true,
      noiseSuppression: true,
      suppressionLevel: voiceIsolationSupported() ? 'high' : 'standard',
      voiceIsolation: voiceIsolationSupported(),
    }
  }
  if (profile === 'studio') {
    return {
      ...current,
      profile,
      autoGainControl: false,
      echoCancellation: false,
      noiseSuppression: false,
      suppressionLevel: 'off',
      voiceIsolation: false,
    }
  }
  return { ...current, profile }
}

export function withSuppressionLevel(value: VoiceProcessing, level: NoiseSuppressionLevel): VoiceProcessing {
  return {
    ...value,
    suppressionLevel: level,
    noiseSuppression: level !== 'off',
    voiceIsolation: level === 'high' && voiceIsolationSupported(),
  }
}

export function readVoiceProcessing(): VoiceProcessing {
  if (typeof window === 'undefined') return defaultVoiceProcessing
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return defaultVoiceProcessing
    const parsed = JSON.parse(stored) as Partial<VoiceProcessing>
    const profile = parsed.profile ?? defaultVoiceProcessing.profile
    const level = profile === 'studio' ? 'off' : parsed.suppressionLevel === 'off' ? 'standard' : parsed.suppressionLevel ?? defaultVoiceProcessing.suppressionLevel
    return {
      autoGainControl: parsed.autoGainControl ?? defaultVoiceProcessing.autoGainControl,
      echoCancellation: parsed.echoCancellation ?? defaultVoiceProcessing.echoCancellation,
      inputDeviceId: parsed.inputDeviceId ?? '',
      noiseSuppression: profile === 'studio' ? false : true,
      outputDeviceId: parsed.outputDeviceId ?? '',
      outputVolume: typeof parsed.outputVolume === 'number' ? Math.min(1, Math.max(0, parsed.outputVolume)) : 1,
      profile,
      suppressionLevel: level,
      voiceIsolation: (parsed.voiceIsolation ?? false) && voiceIsolationSupported(),
    }
  } catch {
    return defaultVoiceProcessing
  }
}

export function writeVoiceProcessing(value: VoiceProcessing) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value))
  } catch (caught) {
    console.error('[voz] falha ao salvar as preferencias de captura', caught)
  }
}

export function audioCaptureOptions(value: VoiceProcessing) {
  const options: Record<string, unknown> = {
    autoGainControl: value.autoGainControl,
    echoCancellation: value.echoCancellation,
    noiseSuppression: value.noiseSuppression,
  }
  if (value.inputDeviceId) options.deviceId = value.inputDeviceId
  if (voiceIsolationSupported()) options.voiceIsolation = value.voiceIsolation
  return options
}
