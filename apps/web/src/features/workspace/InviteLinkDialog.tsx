import { useState } from 'react'

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
  return <div className="server-dialog-backdrop" role="presentation"><section className="server-dialog" role="dialog" aria-modal="true" aria-labelledby="invite-link-title"><button className="dialog-close" type="button" aria-label="Fechar convite por link" onClick={onClose}>×</button><span className="eyebrow">CONVITE PRIVADO</span><h2 id="invite-link-title">Entrar no<br />servidor?</h2><p>Você recebeu um convite por link. Confirme antes de entrar na comunidade.</p><button className="dialog-submit" disabled={submitting} type="button" onClick={() => void accept()}>{submitting ? 'ENTRANDO...' : 'ACEITAR CONVITE'}</button>{feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}</section></div>
}
