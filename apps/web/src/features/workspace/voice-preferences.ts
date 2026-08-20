export type VoiceProcessing = {
  autoGainControl: boolean
  echoCancellation: boolean
  noiseSuppression: boolean
  voiceIsolation: boolean
}

export const defaultVoiceProcessing: VoiceProcessing = {
  autoGainControl: true,
  echoCancellation: true,
  noiseSuppression: true,
  voiceIsolation: false,
}

const storageKey = 'concord.voice.v1'

export const voiceIsolationSupported = () =>
  typeof navigator !== 'undefined'
  && typeof navigator.mediaDevices?.getSupportedConstraints === 'function'
  && 'voiceIsolation' in navigator.mediaDevices.getSupportedConstraints()

export function readVoiceProcessing(): VoiceProcessing {
  if (typeof window === 'undefined') return defaultVoiceProcessing
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return defaultVoiceProcessing
    const parsed = JSON.parse(stored) as Partial<VoiceProcessing>
    return {
      autoGainControl: parsed.autoGainControl ?? defaultVoiceProcessing.autoGainControl,
      echoCancellation: parsed.echoCancellation ?? defaultVoiceProcessing.echoCancellation,
      noiseSuppression: parsed.noiseSuppression ?? defaultVoiceProcessing.noiseSuppression,
      voiceIsolation: parsed.voiceIsolation ?? defaultVoiceProcessing.voiceIsolation,
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
  const options: Record<string, boolean> = {
    autoGainControl: value.autoGainControl,
    echoCancellation: value.echoCancellation,
    noiseSuppression: value.noiseSuppression,
  }
  if (voiceIsolationSupported()) options.voiceIsolation = value.voiceIsolation
  return options
}
