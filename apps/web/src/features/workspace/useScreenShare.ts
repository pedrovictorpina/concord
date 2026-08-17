import { useCallback, useEffect, useRef, useState } from 'react'

export function useScreenShare() {
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState('')

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStream(null)
  }, [])

  const start = useCallback(async () => {
    setError('')
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setError('Este navegador nao oferece captura de tela.')
      return
    }

    try {
      const nextStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1280, max: 1280 },
          height: { ideal: 720, max: 720 },
          frameRate: { ideal: 15, max: 15 },
        },
        audio: true,
      })

      nextStream.getVideoTracks()[0]?.addEventListener('ended', stop, { once: true })
      streamRef.current = nextStream
      setStream(nextStream)
    } catch (caughtError) {
      if (caughtError instanceof DOMException && caughtError.name === 'NotAllowedError') {
        setError('Captura cancelada. Nenhuma tela foi compartilhada.')
        return
      }
      setError('Nao foi possivel iniciar a captura de tela.')
    }
  }, [stop])

  useEffect(() => stop, [stop])

  return { error, start, stop, stream }
}
