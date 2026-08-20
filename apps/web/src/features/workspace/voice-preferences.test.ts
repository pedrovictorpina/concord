import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  audioCaptureOptions,
  defaultVoiceProcessing,
  readVoiceProcessing,
  writeVoiceProcessing,
} from './voice-preferences'
import type { NoiseSuppressionMode, VoiceProcessing } from './voice-preferences'

function createMemoryStorage() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
    clear: () => store.clear(),
  }
}

describe('voice-preferences', () => {
  let storage: ReturnType<typeof createMemoryStorage>

  beforeEach(() => {
    storage = createMemoryStorage()
    vi.stubGlobal('window', { localStorage: storage })
    vi.stubGlobal('navigator', {
      mediaDevices: { getSupportedConstraints: () => ({ voiceIsolation: true }) },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('persistencia', () => {
    it.each(['webrtc', 'rnnoise'] satisfies NoiseSuppressionMode[])('modo %s sobrevive ao round-trip', (mode) => {
      const value: VoiceProcessing = { ...defaultVoiceProcessing, noiseSuppressionMode: mode }
      writeVoiceProcessing(value)
      expect(readVoiceProcessing().noiseSuppressionMode).toBe(mode)
    })

    it('desativada persiste apenas no perfil estudio', () => {
      const value: VoiceProcessing = { ...defaultVoiceProcessing, profile: 'studio', noiseSuppressionMode: 'off' }
      writeVoiceProcessing(value)
      expect(readVoiceProcessing().noiseSuppressionMode).toBe('off')
    })

    it('desativada fora do perfil estudio nao sobrevive a reabertura: volta para webrtc', () => {
      const value: VoiceProcessing = { ...defaultVoiceProcessing, profile: 'custom', noiseSuppressionMode: 'off' }
      writeVoiceProcessing(value)
      expect(readVoiceProcessing().noiseSuppressionMode).toBe('webrtc')
    })
  })

  describe('migracao concord.voice.v1 -> v2', () => {
    it('off do perfil estudio permanece off', () => {
      storage.setItem('concord.voice.v1', JSON.stringify({ profile: 'studio', suppressionLevel: 'off' }))
      expect(readVoiceProcessing().noiseSuppressionMode).toBe('off')
    })

    it('off fora do perfil estudio vira webrtc (nao sobrevive a reabertura)', () => {
      storage.setItem('concord.voice.v1', JSON.stringify({ profile: 'custom', suppressionLevel: 'off' }))
      expect(readVoiceProcessing().noiseSuppressionMode).toBe('webrtc')
    })

    it('standard vira webrtc', () => {
      storage.setItem('concord.voice.v1', JSON.stringify({ profile: 'custom', suppressionLevel: 'standard' }))
      expect(readVoiceProcessing().noiseSuppressionMode).toBe('webrtc')
    })

    it('high vira webrtc, nunca rnnoise', () => {
      storage.setItem('concord.voice.v1', JSON.stringify({ profile: 'voice', suppressionLevel: 'high', voiceIsolation: true }))
      expect(readVoiceProcessing().noiseSuppressionMode).toBe('webrtc')
    })

    it('v2 tem prioridade sobre v1 quando ambos existem', () => {
      storage.setItem('concord.voice.v1', JSON.stringify({ suppressionLevel: 'off' }))
      storage.setItem('concord.voice.v2', JSON.stringify({ ...defaultVoiceProcessing, noiseSuppressionMode: 'rnnoise' }))
      expect(readVoiceProcessing().noiseSuppressionMode).toBe('rnnoise')
    })
  })

  describe('audioCaptureOptions', () => {
    it('webrtc liga a supressao nativa do navegador', () => {
      const options = audioCaptureOptions({ ...defaultVoiceProcessing, noiseSuppressionMode: 'webrtc' })
      expect(options.noiseSuppression).toBe(true)
    })

    it('off desliga a supressao nativa', () => {
      const options = audioCaptureOptions({ ...defaultVoiceProcessing, noiseSuppressionMode: 'off' })
      expect(options.noiseSuppression).toBe(false)
    })

    it('rnnoise desliga a supressao nativa para nao suprimir em dobro', () => {
      const options = audioCaptureOptions({ ...defaultVoiceProcessing, noiseSuppressionMode: 'rnnoise' })
      expect(options.noiseSuppression).toBe(false)
    })

    it('perfil voz com webrtc liga o isolamento de voz nativo', () => {
      const options = audioCaptureOptions({ ...defaultVoiceProcessing, profile: 'voice', noiseSuppressionMode: 'webrtc' })
      expect(options.voiceIsolation).toBe(true)
    })

    it('rnnoise sempre desliga o isolamento nativo, mesmo no perfil voz', () => {
      const options = audioCaptureOptions({ ...defaultVoiceProcessing, profile: 'voice', noiseSuppressionMode: 'rnnoise' })
      expect(options.voiceIsolation).toBe(false)
    })
  })
})
