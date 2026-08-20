import { loadRnnoise, RnnoiseWorkletNode } from '@sapphi-red/web-noise-suppressor'
import rnnoiseWasmUrl from '@sapphi-red/web-noise-suppressor/rnnoise.wasm?url'
import rnnoiseWasmSimdUrl from '@sapphi-red/web-noise-suppressor/rnnoise_simd.wasm?url'
import rnnoiseWorkletUrl from '@sapphi-red/web-noise-suppressor/rnnoiseWorklet.js?url'

export type RnnoiseGraph = {
  outputTrack: MediaStreamTrack
  destroy: () => void
}

let wasmBinaryPromise: Promise<ArrayBuffer> | null = null

function loadRnnoiseBinary() {
  wasmBinaryPromise ??= loadRnnoise({ url: rnnoiseWasmUrl, simdUrl: rnnoiseWasmSimdUrl }).catch((caught) => {
    wasmBinaryPromise = null
    throw caught
  })
  return wasmBinaryPromise
}

const workletReadyContexts = new WeakSet<AudioContext>()
const workletLoadingContexts = new WeakMap<AudioContext, Promise<void>>()

function ensureRnnoiseWorklet(audioContext: AudioContext) {
  if (workletReadyContexts.has(audioContext)) return Promise.resolve()
  let loading = workletLoadingContexts.get(audioContext)
  if (!loading) {
    loading = audioContext.audioWorklet.addModule(rnnoiseWorkletUrl)
      .then(() => { workletReadyContexts.add(audioContext) })
      .catch((caught) => {
        workletLoadingContexts.delete(audioContext)
        throw caught
      })
    workletLoadingContexts.set(audioContext, loading)
  }
  return loading
}

// Grafo compartilhado pelo processor do LiveKit (voz publicada) e pelo teste de microfone,
// para garantir que os dois usem exatamente o mesmo processamento RNNoise.
export async function createRnnoiseGraph(audioContext: AudioContext, inputTrack: MediaStreamTrack): Promise<RnnoiseGraph> {
  const [wasmBinary] = await Promise.all([
    loadRnnoiseBinary(),
    ensureRnnoiseWorklet(audioContext),
  ])

  const source = audioContext.createMediaStreamSource(new MediaStream([inputTrack]))
  const node = new RnnoiseWorkletNode(audioContext, { wasmBinary, maxChannels: 1 })
  const destination = audioContext.createMediaStreamDestination()

  source.connect(node)
  node.connect(destination)

  const [outputTrack] = destination.stream.getAudioTracks()
  if (!outputTrack) {
    source.disconnect()
    node.disconnect()
    node.destroy()
    throw new Error('rnnoise: nao foi possivel criar a faixa processada')
  }

  return {
    outputTrack,
    destroy: () => {
      source.disconnect()
      node.disconnect()
      node.destroy()
      outputTrack.stop()
    },
  }
}
