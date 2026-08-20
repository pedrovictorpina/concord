import { ScreenShareButton } from './ScreenShareButton'
import { AudioIcon, AudioOffIcon, MicIcon, MicOffIcon } from './VoiceStateIcons'
import type { ScreenShareQuality } from './screen-quality'

type VoiceDockProps = {
  audioBlocked: boolean
  channelName: string
  demoMode: boolean
  error: string
  floating: boolean
  microphoneDisabled: boolean
  microphoneEnabled: boolean
  notice: string
  onEnableAudioPlayback: () => void
  onLeave: () => void
  onOpenChannel: () => void
  onStartScreenShare: (quality: ScreenShareQuality) => void
  onStopScreenShare: () => void
  onToggleMicrophone: () => void
  onToggleOutput: () => void
  outputDisabled: boolean
  outputEnabled: boolean
  serverName: string
  sharing: boolean
}

export function VoiceDock({ audioBlocked, channelName, demoMode, error, floating, microphoneDisabled, microphoneEnabled, notice, onEnableAudioPlayback, onLeave, onOpenChannel, onStartScreenShare, onStopScreenShare, onToggleMicrophone, onToggleOutput, outputDisabled, outputEnabled, serverName, sharing }: VoiceDockProps) {
  const screenShareAvailable = Boolean(navigator.mediaDevices?.getDisplayMedia)
  const microphoneOff = microphoneDisabled || !microphoneEnabled
  const outputOff = outputDisabled || !outputEnabled

  return (
    <aside className={floating ? 'voice-dock joined floating' : 'voice-dock joined'} aria-label="Conexao de voz">
      <button className="voice-dock-channel" type="button" onClick={onOpenChannel}>
        <span className="live-pulse" />
        <div><strong>{channelName}</strong><small>{serverName}</small></div>
        {sharing ? <i aria-label="Transmitindo tela">▣</i> : null}
        {microphoneOff || outputOff ? <span className="voice-dock-flags">{outputOff ? <i className="voice-flag off" aria-label="Seu áudio está mutado"><AudioOffIcon /></i> : null}{microphoneOff ? <i className="voice-flag off" aria-label="Seu microfone está mutado"><MicOffIcon /></i> : null}</span> : null}
      </button>
      {error ? <p className="share-error" role="status">{error}</p> : null}
      {notice ? <p className="voice-capability-note" role="status">{notice}</p> : null}
      {audioBlocked ? <button className="voice-unblock-audio" type="button" onClick={onEnableAudioPlayback}>◖ Tocar o som da chamada</button> : null}
      {!screenShareAvailable ? <p className="voice-capability-note" role="status">Compartilhar tela não é suportado nesta PWA móvel. Use o Concord no desktop.</p> : null}
      <div className="voice-dock-status"><strong>Voz conectada</strong><small>{demoMode ? 'REDE LOCAL · 28 ms' : 'REDE ESTÁVEL · WEBRTC'}</small></div>
      <footer className="voice-controls">
        <button aria-label={microphoneDisabled ? 'Microfone desativado pela moderação' : microphoneOff ? 'Microfone mutado' : 'Microfone ligado'} aria-pressed={microphoneOff} className={microphoneOff ? 'disabled' : ''} disabled={microphoneDisabled} type="button" onClick={onToggleMicrophone}><span>{microphoneOff ? <MicOffIcon /> : <MicIcon />}</span>MIC</button>
        <button aria-label={outputDisabled ? 'Áudio desativado pela moderação' : outputOff ? 'Áudio mutado' : 'Áudio ligado'} aria-pressed={outputOff} className={outputOff ? 'disabled' : ''} disabled={outputDisabled} type="button" onClick={onToggleOutput}><span>{outputOff ? <AudioOffIcon /> : <AudioIcon />}</span>ÁUDIO</button>
        <ScreenShareButton onStart={onStartScreenShare} onStop={onStopScreenShare} sharing={sharing} />
        <button className="leave-voice" type="button" onClick={onLeave}><span>×</span>SAIR</button>
      </footer>
    </aside>
  )
}
