import { Dialog } from 'radix-ui'
import type { ReactNode, RefObject } from 'react'

type ModalProps = {
  children: ReactNode
  className?: string
  closeLabel: string
  description?: ReactNode
  eyebrow?: string
  hideClose?: boolean
  initialFocusRef?: RefObject<HTMLElement | null>
  onClose: () => void
  title: ReactNode
}

export function Modal({ children, className, closeLabel, description, eyebrow, hideClose = false, initialFocusRef, onClose, title }: ModalProps) {
  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="server-dialog-backdrop">
          <Dialog.Content
            aria-describedby={description ? undefined : ''}
            className={className ? `server-dialog ${className}` : 'server-dialog'}
            onOpenAutoFocus={initialFocusRef ? (event) => { event.preventDefault(); initialFocusRef.current?.focus() } : undefined}
          >
            {hideClose ? null : <Dialog.Close aria-label={closeLabel} className="dialog-close">×</Dialog.Close>}
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <Dialog.Title>{title}</Dialog.Title>
            {description ? <Dialog.Description>{description}</Dialog.Description> : null}
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
