import { useId } from 'react'
import { Select } from 'radix-ui'

type ChoiceOption<T extends string> = {
  disabled?: boolean
  label: string
  value: T
}

type ChoiceProps<T extends string> = {
  className?: string
  disabled?: boolean
  hideLabel?: boolean
  label: string
  onChange: (value: T) => void
  options: readonly ChoiceOption<T>[]
  value: T
}

export function Choice<T extends string>({ className, disabled = false, hideLabel = false, label, onChange, options, value }: ChoiceProps<T>) {
  const labelId = useId()

  return (
    <div className={className ? `choice ${className}` : 'choice'}>
      <span className={hideLabel ? 'sr-only' : 'choice-label'} id={labelId}>{label}</span>
      <Select.Root disabled={disabled} onValueChange={(next) => onChange(next as T)} value={value}>
        <Select.Trigger aria-labelledby={labelId} className="choice-trigger">
          <Select.Value />
          <Select.Icon>⌄</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="choice-content" position="popper" sideOffset={6}>
            <Select.Viewport>
              {options.map((option) => (
                <Select.Item className="choice-item" disabled={option.disabled} key={option.value} value={option.value}>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
