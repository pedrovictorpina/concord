const iconProps = {
  'aria-hidden': true,
  fill: 'none',
  focusable: false,
  height: 14,
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: 2,
  viewBox: '0 0 24 24',
  width: 14,
}

export function MicIcon() {
  return (
    <svg {...iconProps}>
      <rect x="9" y="2.5" width="6" height="10.5" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3.5" />
    </svg>
  )
}

export function MicOffIcon() {
  return (
    <svg {...iconProps}>
      <rect x="9" y="2.5" width="6" height="10.5" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3.5" />
      <path d="M3.5 3.5l17 17" />
    </svg>
  )
}

export function AudioIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 14.5v-2.5a8 8 0 0 1 16 0v2.5" />
      <rect x="2" y="13.5" width="5" height="7" rx="2" />
      <rect x="17" y="13.5" width="5" height="7" rx="2" />
    </svg>
  )
}

export function AudioOffIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 14.5v-2.5a8 8 0 0 1 16 0v2.5" />
      <rect x="2" y="13.5" width="5" height="7" rx="2" />
      <rect x="17" y="13.5" width="5" height="7" rx="2" />
      <path d="M3.5 3.5l17 17" />
    </svg>
  )
}

export function ScreenIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M9 20.5h6" />
    </svg>
  )
}

type VoiceStateFlagsProps = {
  microphoneEnabled: boolean
  outputEnabled: boolean
  sharingScreen: boolean
}

export function VoiceStateFlags({ microphoneEnabled, outputEnabled, sharingScreen }: VoiceStateFlagsProps) {
  return (
    <span className="voice-flags">
      {sharingScreen ? <i className="voice-flag" aria-label="Compartilhando tela"><ScreenIcon /></i> : null}
      {outputEnabled ? null : <i className="voice-flag off" aria-label="Áudio mutado"><AudioOffIcon /></i>}
      {microphoneEnabled ? null : <i className="voice-flag off" aria-label="Microfone mutado"><MicOffIcon /></i>}
    </span>
  )
}
