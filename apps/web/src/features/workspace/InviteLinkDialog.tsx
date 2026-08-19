import { useEffect, useState } from 'react'
import { Modal } from '../../components/ui/Modal'

type InviteLinkDialogProps = {
  code: string
  onAccept: (code: string) => Promise<{ ok: boolean; message: string }>
  onClose: () => void
  onInspect: (code: string) => Promise<{ server_id: string; server_name: string } | null>
}

export function InviteLinkDialog({ code, onAccept, onClose, onInspect }: InviteLinkDialogProps) {
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [serverName, setServerName] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let active = true
    void onInspect(code).then((invite) => {
      if (!active) return
      setServerName(invite?.server_name ?? null)
      setChecked(true)
    })
    return () => { active = false }
  }, [code, onInspect])

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
      description={checked && !serverName ? 'Este link é inválido, expirou ou foi revogado.' : 'Você recebeu um convite por link. Confirme antes de entrar na comunidade.'}
      eyebrow="CONVITE PRIVADO"
      onClose={onClose}
      title={serverName ? <>Entrar em{' '}<br />{serverName}?</> : <>Entrar no{' '}<br />servidor?</>}
    >
      <button className="dialog-submit" disabled={submitting || (checked && !serverName)} type="button" onClick={() => void accept()}>{submitting ? 'ENTRANDO...' : 'ACEITAR CONVITE'}</button>
      {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
    </Modal>
  )
}
