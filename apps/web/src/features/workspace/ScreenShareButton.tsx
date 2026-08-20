import { useState } from 'react'
import { Popover } from 'radix-ui'
import { screenShareQualities } from './screen-quality'
import type { ScreenShareQuality } from './screen-quality'

type ScreenShareButtonProps = {
  onStart: (quality: ScreenShareQuality) => void
  onStop: () => void
  sharing: boolean
}

export function ScreenShareButton({ onStart, onStop, sharing }: ScreenShareButtonProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [quality, setQuality] = useState<ScreenShareQuality>('automatic')
  const available = Boolean(navigator.mediaDevices?.getDisplayMedia)

  const start = (nextQuality: ScreenShareQuality) => {
    if (!available) return
    setQuality(nextQuality)
    setPickerOpen(false)
    onStart(nextQuality)
  }

  return (
    <Popover.Root open={pickerOpen} onOpenChange={setPickerOpen}>
      <Popover.Anchor asChild>
        <button
          aria-label={available ? sharing ? 'Parar de transmitir a tela' : 'TELA' : 'Tela indisponível neste dispositivo'}
          className={sharing || !available ? 'disabled' : ''}
          disabled={!available}
          title={available ? undefined : 'Compartilhamento de tela indisponível nesta PWA móvel'}
          type="button"
          onClick={() => sharing ? onStop() : setPickerOpen(true)}
        >
          <span>{sharing ? '■' : '▣'}</span>TELA
        </button>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content align="center" aria-label="Qualidade da transmissao" className="quality-picker" side="top" sideOffset={12}>
          <header><strong>QUALIDADE DA TELA</strong><Popover.Close aria-label="Fechar seletor de qualidade">×</Popover.Close></header>
          <p>Escolha como quer transmitir antes de selecionar a tela.</p>
          <div>{(Object.keys(screenShareQualities) as ScreenShareQuality[]).map((option) => (
            <button className={quality === option ? 'active' : ''} key={option} type="button" onClick={() => start(option)}>
              <strong>{screenShareQualities[option].label}</strong><small>{screenShareQualities[option].detail}</small>
            </button>
          ))}</div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
