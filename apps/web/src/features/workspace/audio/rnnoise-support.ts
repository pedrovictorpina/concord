export function rnnoiseSupported(): boolean {
  return typeof window !== 'undefined'
    && typeof AudioContext !== 'undefined'
    && typeof AudioWorkletNode !== 'undefined'
    && typeof WebAssembly !== 'undefined'
}
