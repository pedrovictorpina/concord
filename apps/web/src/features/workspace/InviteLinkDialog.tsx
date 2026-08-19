import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'

type InviteLinkDialogProps = {
  code: string
  onAccept: (code: string) => Promise<{ ok: boolean; message: string }>
  onClose: () => void
}

export function InviteLinkDialog({ code, onAccept, onClose }: InviteLinkDialogProps) {
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const accept = async () => {
    setSubmitting(true)
    const result = await onAccept(code)
    setSubmitting(false)
    setFeedback(result.message)
    if (result.ok) onClose()
  }

  return (
    <Modal
      closeLabel="Fechar convite por link"
      description="Você recebeu um convite por link. Confirme antes de entrar na comunidade."
      eyebrow="CONVITE PRIVADO"
      onClose={onClose}
      title={<>Entrar no{' '}<br />servidor?</>}
    >
      <button className="dialog-submit" disabled={submitting} type="button" onClick={() => void accept()}>{submitting ? 'ENTRANDO...' : 'ACEITAR CONVITE'}</button>
      {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
    </Modal>
  )
}
