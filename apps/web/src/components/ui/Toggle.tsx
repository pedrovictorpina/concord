import { useId } from 'react'
import { Checkbox } from 'radix-ui'
import type { ReactNode } from 'react'

type ToggleProps = {
  checked: boolean
  className?: string
  description?: ReactNode
  disabled?: boolean
  label: ReactNode
  onChange: (checked: boolean) => void
}

export function Toggle({ checked, className, description, disabled = false, label, onChange }: ToggleProps) {
  const labelId = useId()

  return (
    <div className={className ? `toggle ${className}` : 'toggle'}>
      <span id={labelId}><strong>{label}</strong>{description ? <small>{description}</small> : null}</span>
      <Checkbox.Root
        aria-labelledby={labelId}
        checked={checked}
        className="toggle-box"
        disabled={disabled}
        onCheckedChange={(next) => onChange(next === true)}
      >
        <Checkbox.Indicator className="toggle-mark">✓</Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  )
}
