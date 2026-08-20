import { useEffect, useRef } from 'react'
import type { ScreenShareView } from './screen-shares'

type ScreenShareTileProps = {
  focused: boolean
  muted: boolean
  onSetVolume: (volume: number) => void
  onStopWatching: () => void
  onToggleFocus: () => void
  onToggleSound: () => void
  share: ScreenShareView
  volume: number
}

export function ScreenShareTile({ focused, muted, onSetVolume, onStopWatching, onToggleFocus, onToggleSound, share, volume }: ScreenShareTileProps) {
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
  const soundLabel = share.hasAudio ? muted ? ' · SEM SOM' : ' · COM SOM' : ''

  return (
    <li className={focused ? 'voice-stage-share focused' : 'voice-stage-share'}>
      <video ref={videoRef} autoPlay muted playsInline />
      <span className="capture-label">{author.toUpperCase()} · TRANSMITINDO{soundLabel}</span>

      <div className="voice-stage-bar">
        {share.isLocal || !share.hasAudio ? <span /> : (
          <div className="voice-stage-volume">
            <button
              aria-label={muted ? `Ativar o som da tela de ${author}` : `Mutar o som da tela de ${author}`}
              aria-pressed={muted}
              type="button"
              onClick={onToggleSound}
            >
              {muted ? '◌' : '◖'}
            </button>
            <input
              aria-label={`Volume da tela de ${author}`}
              max={1}
              min={0}
              step={0.02}
              type="range"
              value={muted ? 0 : volume}
              onChange={(event) => onSetVolume(Number(event.target.value))}
            />
            <small>{muted ? 'MUDO' : `${Math.round(volume * 100)}%`}</small>
          </div>
        )}

        <div className="voice-stage-bar-actions">
          <button
            aria-label={focused ? `Voltar ${author} para a grade` : `Destacar a tela de ${author}`}
            aria-pressed={focused}
            type="button"
            onClick={onToggleFocus}
          >
            {focused ? '❐' : '⬒'} <span>{focused ? 'GRADE' : 'DESTACAR'}</span>
          </button>
          {share.isLocal ? null : (
            <button aria-label={`Parar de ver a tela de ${author}`} type="button" onClick={onStopWatching}>
              ✕ <span>PARAR DE VER</span>
            </button>
          )}
          <button
            aria-label={`Ver a tela de ${author} em tela cheia`}
            type="button"
            onClick={() => void videoRef.current?.requestFullscreen()}
          >
            ⛶ <span>TELA CHEIA</span>
          </button>
        </div>
      </div>
    </li>
  )
}
