import { useEffect, useRef } from 'react'
import type { ScreenShareView } from './screen-shares'

type ScreenShareTileProps = {
  focused: boolean
  muted: boolean
  onStopWatching: () => void
  onToggleFocus: () => void
  onToggleSound: () => void
  share: ScreenShareView
}

export function ScreenShareTile({ focused, muted, onStopWatching, onToggleFocus, onToggleSound, share }: ScreenShareTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (share.stream) {
      video.srcObject = share.stream
      return () => {
        video.srcObject = null
      }
    }
    const track = share.track
    if (!track) {
      video.srcObject = null
      return
    }
    track.attach(video)
    return () => {
      track.detach(video)
    }
  }, [share.stream, share.track])

  const author = share.isLocal ? 'Sua tela' : share.nickname

  return (
    <li className={focused ? 'voice-stage-share focused' : 'voice-stage-share'}>
      <video ref={videoRef} autoPlay muted playsInline />
      <span className="capture-label">{author.toUpperCase()} · TRANSMITINDO{share.hasAudio ? muted ? ' · SEM SOM' : ' · COM SOM' : ''}</span>
      <div className="voice-stage-share-actions">
        <button
          aria-label={focused ? `Voltar ${author} para a grade` : `Destacar a tela de ${author}`}
          aria-pressed={focused}
          className="voice-stage-focus"
          type="button"
          onClick={onToggleFocus}
        >
          {focused ? '❐' : '⬒'} <span>{focused ? 'GRADE' : 'DESTACAR'}</span>
        </button>
        {share.isLocal || !share.hasAudio ? null : (
          <button
            aria-label={muted ? `Ativar o som da tela de ${author}` : `Mutar o som da tela de ${author}`}
            aria-pressed={muted}
            className="voice-stage-sound"
            type="button"
            onClick={onToggleSound}
          >
            {muted ? '🔇' : '🔊'} <span>{muted ? 'SEM SOM' : 'SOM'}</span>
          </button>
        )}
        {share.isLocal ? null : (
          <button
            aria-label={`Parar de ver a tela de ${author}`}
            className="voice-stage-close"
            type="button"
            onClick={onStopWatching}
          >
            ✕ <span>PARAR DE VER</span>
          </button>
        )}
        <button
          aria-label={`Ver a tela de ${author} em tela cheia`}
          className="voice-stage-fullscreen"
          type="button"
          onClick={() => void videoRef.current?.requestFullscreen()}
        >
          ⛶ <span>TELA CHEIA</span>
        </button>
      </div>
    </li>
  )
}
