export type VoiceProfile = 'voice' | 'studio' | 'custom'

export type NoiseSuppressionMode = 'off' | 'webrtc' | 'rnnoise'

export type VoiceProcessing = {
  autoGainControl: boolean
  echoCancellation: boolean
  inputDeviceId: string
  noiseSuppressionMode: NoiseSuppressionMode
  outputDeviceId: string
  outputVolume: number
  profile: VoiceProfile
}

export const defaultVoiceProcessing: VoiceProcessing = {
  autoGainControl: true,
  echoCancellation: true,
  inputDeviceId: '',
  noiseSuppressionMode: 'webrtc',
  outputDeviceId: '',
  outputVolume: 1,
  profile: 'voice',
}

const storageKeyV1 = 'concord.voice.v1'
const storageKey = 'concord.voice.v2'

type LegacyVoiceProcessingV1 = {
  autoGainControl?: boolean
  echoCancellation?: boolean
  inputDeviceId?: string
  outputDeviceId?: string
  outputVolume?: number
  profile?: VoiceProfile
  suppressionLevel?: 'off' | 'standard' | 'high'
}

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
      noiseSuppressionMode: 'webrtc',
    }
  }
  if (profile === 'studio') {
    return {
      ...current,
      profile,
      autoGainControl: false,
      echoCancellation: false,
      noiseSuppressionMode: 'off',
    }
  }
  return { ...current, profile }
}

export function withNoiseSuppressionMode(value: VoiceProcessing, mode: NoiseSuppressionMode): VoiceProcessing {
  return { ...value, noiseSuppressionMode: mode }
}

const clampVolume = (value: unknown) => typeof value === 'number' ? Math.min(1, Math.max(0, value)) : 1

const isNoiseSuppressionMode = (value: unknown): value is NoiseSuppressionMode =>
  value === 'off' || value === 'webrtc' || value === 'rnnoise'

export function normalizeVoiceProcessing(parsed: Partial<VoiceProcessing>): VoiceProcessing {
  return {
    autoGainControl: parsed.autoGainControl ?? defaultVoiceProcessing.autoGainControl,
    echoCancellation: parsed.echoCancellation ?? defaultVoiceProcessing.echoCancellation,
    inputDeviceId: parsed.inputDeviceId ?? '',
    noiseSuppressionMode: isNoiseSuppressionMode(parsed.noiseSuppressionMode) ? parsed.noiseSuppressionMode : defaultVoiceProcessing.noiseSuppressionMode,
    outputDeviceId: parsed.outputDeviceId ?? '',
    outputVolume: clampVolume(parsed.outputVolume),
    profile: parsed.profile ?? defaultVoiceProcessing.profile,
  }
}

// v1 off -> v2 off; v1 standard/high -> v2 webrtc (nunca migra automaticamente para rnnoise)
export function migrateLegacyVoiceProcessing(parsed: LegacyVoiceProcessingV1): VoiceProcessing {
  return {
    autoGainControl: parsed.autoGainControl ?? defaultVoiceProcessing.autoGainControl,
    echoCancellation: parsed.echoCancellation ?? defaultVoiceProcessing.echoCancellation,
    inputDeviceId: parsed.inputDeviceId ?? '',
    noiseSuppressionMode: parsed.suppressionLevel === 'off' ? 'off' : 'webrtc',
    outputDeviceId: parsed.outputDeviceId ?? '',
    outputVolume: clampVolume(parsed.outputVolume),
    profile: parsed.profile ?? defaultVoiceProcessing.profile,
  }
}

// Desativada nao sobrevive a reabertura do Concord (exceto no perfil Estudio, onde e o padrao):
// evita que o usuario esqueca a supressao desligada de uma sessao para a outra.
const withTransientOffReset = (value: VoiceProcessing): VoiceProcessing =>
  value.noiseSuppressionMode === 'off' && value.profile !== 'studio'
    ? { ...value, noiseSuppressionMode: 'webrtc' }
    : value

export function readVoiceProcessing(): VoiceProcessing {
  if (typeof window === 'undefined') return defaultVoiceProcessing
  try {
    const storedV2 = window.localStorage.getItem(storageKey)
    if (storedV2) return withTransientOffReset(normalizeVoiceProcessing(JSON.parse(storedV2) as Partial<VoiceProcessing>))
    const storedV1 = window.localStorage.getItem(storageKeyV1)
    if (storedV1) return withTransientOffReset(migrateLegacyVoiceProcessing(JSON.parse(storedV1) as LegacyVoiceProcessingV1))
    return defaultVoiceProcessing
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
  const webrtc = value.noiseSuppressionMode === 'webrtc'
  const options: Record<string, unknown> = {
    autoGainControl: value.autoGainControl,
    echoCancellation: value.echoCancellation,
    noiseSuppression: webrtc,
  }
  if (value.inputDeviceId) options.deviceId = value.inputDeviceId
  if (voiceIsolationSupported()) options.voiceIsolation = webrtc && value.profile === 'voice'
  return options
}
