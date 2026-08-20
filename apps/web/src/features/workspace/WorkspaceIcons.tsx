const iconProps = {
  'aria-hidden': true,
  fill: 'none',
  focusable: false,
  height: 15,
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: 2,
  viewBox: '0 0 24 24',
  width: 15,
}

export function SearchIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M19 19l-4.3-4.3" />
    </svg>
  )
}

export function PinIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M12 12v9" />
    </svg>
  )
}

export function BellIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6 16v-5a6 6 0 0 1 12 0v5" />
      <path d="M4 16h16" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function PeopleIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <circle cx="17.5" cy="8.5" r="2.4" />
      <path d="M15.5 13.6c2.4.2 4.7 2.2 4.7 5.4" />
    </svg>
  )
}

export function HomeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 11.5L12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  )
}

export function ThreadIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </svg>
  )
}

export function CompassIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 9l-2 6-6 2 2-6z" />
    </svg>
  )
}

export function GiftIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="9" width="18" height="11" rx="1.2" />
      <path d="M3 13h18" />
      <path d="M12 9v11" />
      <path d="M8 9c-1.8 0-3-1.2-3-2.6C5 4.9 6.2 4 7.5 4 9.5 4 11 6 12 9" />
      <path d="M16 9c1.8 0 3-1.2 3-2.6C19 4.9 17.8 4 16.5 4 14.5 4 13 6 12 9" />
    </svg>
  )
}

export function EmojiIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 10.2h.01" />
      <path d="M15.5 10.2h.01" />
      <path d="M8.3 14.5a4 4 0 0 0 7.4 0" />
    </svg>
  )
}

export function MessageIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 5.5h16v11H9.5L5 20v-3.5H4z" />
    </svg>
  )
}

export function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 4.5c0-1 .8-1.8 1.8-1.8h1.6c.5 0 .9.3 1 .8l.9 3.1c.1.4 0 .9-.3 1.2L8.4 9.3a13 13 0 0 0 6.3 6.3l1.5-1.6c.3-.3.8-.4 1.2-.3l3.1.9c.5.1.8.5.8 1v1.6c0 1-.8 1.8-1.8 1.8h-.7C10.4 19 5 13.6 5 5.2z" />
    </svg>
  )
}

export function VideoIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="6.5" width="13" height="11" rx="1.6" />
      <path d="M16.5 10.2l4-2.6v9l-4-2.6z" />
    </svg>
  )
}

export function MoreIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="5.5" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="18.5" r="1.4" />
    </svg>
  )
}

export function SendIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4.5 12L19 5l-6 14-2.3-6.3z" />
      <path d="M13 12.7L19 5" />
    </svg>
  )
}

export function BackIcon() {
  return (
    <svg {...iconProps}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}
