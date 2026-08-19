import { Avatar as RadixAvatar } from 'radix-ui'

type AvatarProps = {
  alt?: string
  initials: string
  tone?: 'green' | 'amber' | 'signal'
  url?: string | null
}

export function Avatar({ alt = '', initials, tone = 'green', url }: AvatarProps) {
  return (
    <RadixAvatar.Root className={url ? `avatar avatar-${tone} has-photo` : `avatar avatar-${tone}`}>
      {url ? <RadixAvatar.Image alt={alt} className="avatar-photo" src={url} /> : null}
      <RadixAvatar.Fallback className="avatar-initials">{initials}</RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
