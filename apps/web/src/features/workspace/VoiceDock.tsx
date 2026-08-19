import { useState } from 'react'
import { Popover } from 'radix-ui'
import { screenShareQualities } from './screen-quality'
import { AudioIcon, AudioOffIcon, MicIcon, MicOffIcon } from './VoiceStateIcons'
import type { ScreenShareQuality } from './screen-quality'

type VoiceDockProps = {
  channelName: string
  demoMode: boolean
  error: string
  floating: boolean
  microphoneDisabled: boolean
  microphoneEnabled: boolean
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

export function VoiceDock({ channelName, demoMode, error, floating, microphoneDisabled, microphoneEnabled, onLeave, onOpenChannel, onStartScreenShare, onStopScreenShare, onToggleMicrophone, onToggleOutput, outputDisabled, outputEnabled, serverName, sharing }: VoiceDockProps) {
  const [qualityPickerOpen, setQualityPickerOpen] = useState(false)
  const [quality, setQuality] = useState<ScreenShareQuality>('automatic')
  const screenShareAvailable = Boolean(navigator.mediaDevices?.getDisplayMedia)
  const microphoneOff = microphoneDisabled || !microphoneEnabled
  const outputOff = outputDisabled || !outputEnabled

  const startScreenShare = (nextQuality: ScreenShareQuality) => {
    if (!screenShareAvailable) return
    setQuality(nextQuality)
    setQualityPickerOpen(false)
    onStartScreenShare(nextQuality)
  }

  return (
    <aside className={floating ? 'voice-dock joined floating' : 'voice-dock joined'} aria-label="Conexao de voz">
      <button className="voice-dock-channel" type="button" onClick={onOpenChannel}>
        <span className="live-pulse" />
        <div><strong>{channelName}</strong><small>{serverName}</small></div>
        {sharing ? <i aria-label="Transmitindo tela">▣</i> : null}
        {microphoneOff || outputOff ? <span className="voice-dock-flags">{outputOff ? <i className="voice-flag off" aria-label="Seu áudio está mutado"><AudioOffIcon /></i> : null}{microphoneOff ? <i className="voice-flag off" aria-label="Seu microfone está mutado"><MicOffIcon /></i> : null}</span> : null}
      </button>
      {error ? <p className="share-error" role="status">{error}</p> : null}
      {!screenShareAvailable ? <p className="voice-capability-note" role="status">Compartilhar tela não é suportado nesta PWA móvel. Use o Concord no desktop.</p> : null}
      <div className="voice-dock-status"><strong>Voz conectada</strong><small>{demoMode ? 'REDE LOCAL · 28 ms' : 'REDE ESTÁVEL · WEBRTC'}</small></div>
      <footer className="voice-controls">
        <button aria-label={microphoneDisabled ? 'Microfone desativado pela moderação' : microphoneOff ? 'Microfone mutado' : 'Microfone ligado'} aria-pressed={microphoneOff} className={microphoneOff ? 'disabled' : ''} disabled={microphoneDisabled} type="button" onClick={onToggleMicrophone}><span>{microphoneOff ? <MicOffIcon /> : <MicIcon />}</span>MIC</button>
        <button aria-label={outputDisabled ? 'Áudio desativado pela moderação' : outputOff ? 'Áudio mutado' : 'Áudio ligado'} aria-pressed={outputOff} className={outputOff ? 'disabled' : ''} disabled={outputDisabled} type="button" onClick={onToggleOutput}><span>{outputOff ? <AudioOffIcon /> : <AudioIcon />}</span>ÁUDIO</button>
        <Popover.Root open={qualityPickerOpen} onOpenChange={setQualityPickerOpen}>
          <Popover.Anchor asChild>
            <button aria-label={screenShareAvailable ? 'TELA' : 'Tela indisponível neste dispositivo'} className={sharing || !screenShareAvailable ? 'disabled' : ''} disabled={!screenShareAvailable} title={screenShareAvailable ? undefined : 'Compartilhamento de tela indisponível nesta PWA móvel'} type="button" onClick={() => sharing ? onStopScreenShare() : setQualityPickerOpen(true)}><span>{sharing ? '■' : '▣'}</span>TELA</button>
          </Popover.Anchor>
          <Popover.Portal>
            <Popover.Content align="center" aria-label="Qualidade da transmissao" className="quality-picker" side="top" sideOffset={12}>
              <header><strong>QUALIDADE DA TELA</strong><Popover.Close aria-label="Fechar seletor de qualidade">×</Popover.Close></header>
              <p>Escolha como quer transmitir antes de selecionar a tela.</p>
              <div>{(Object.keys(screenShareQualities) as ScreenShareQuality[]).map((option) => (
                <button className={quality === option ? 'active' : ''} key={option} type="button" onClick={() => startScreenShare(option)}><strong>{screenShareQualities[option].label}</strong><small>{screenShareQualities[option].detail}</small></button>
              ))}</div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <button className="leave-voice" type="button" onClick={onLeave}><span>×</span>SAIR</button>
      </footer>
    </aside>
  )
}
