import { useState } from 'react'
import { Toast } from 'radix-ui'

type ErrorToastProps = {
  message: string | null
}

export function ErrorToast({ message }: ErrorToastProps) {
  const [dismissed, setDismissed] = useState('')

  if (!message || message === dismissed) return null

  return (
    <Toast.Provider duration={9000} swipeDirection="right">
      <Toast.Root
        className="workspace-error"
        open
        onOpenChange={(open) => { if (!open) setDismissed(message ?? '') }}
      >
        <Toast.Description>{message}</Toast.Description>
        <Toast.Close aria-label="Fechar aviso">×</Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="workspace-error-viewport" />
    </Toast.Provider>
  )
}
