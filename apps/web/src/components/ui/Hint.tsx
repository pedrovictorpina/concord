import { Tooltip } from 'radix-ui'
import type { ReactNode } from 'react'

type HintProps = {
  children: ReactNode
  label: string
}

export function Hint({ children, label }: HintProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="hint" side="top" sideOffset={7}>
          {label}
          <Tooltip.Arrow className="hint-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
