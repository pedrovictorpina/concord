import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../../components/ui/Modal'

type CreateServerDialogProps = {
  onClose: () => void
  onCreate: (name: string, description: string) => Promise<{ ok: boolean; message: string }>
}

export function CreateServerDialog({ onClose, onCreate }: CreateServerDialogProps) {
  const nameRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback('')
    setSubmitting(true)
    const result = await onCreate(name, description)
    setSubmitting(false)
    if (result.ok) onClose()
    else setFeedback(result.message)
  }

  return (
    <Modal
      closeLabel="Fechar criacao de servidor"
      description={<>Você será o dono. O Concord abre <strong>#geral</strong> assim que o servidor nascer.</>}
      eyebrow="NOVA FREQUENCIA"
      initialFocusRef={nameRef}
      onClose={onClose}
      title={<>Dê um nome<br />ao seu lugar.</>}
    >
      <form onSubmit={submit}>
        <label>
          <span>Nome do servidor</span>
          <input ref={nameRef} required minLength={3} maxLength={48} value={name} onChange={(event) => setName(event.target.value)} placeholder="Equipe de produto" />
        </label>
        <label>
          <span>Descrição <small>opcional</small></span>
          <textarea maxLength={160} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Para quem está construindo junto." />
        </label>
        {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
        <button className="dialog-submit" type="submit" disabled={submitting}>{submitting ? 'ABRINDO...' : 'CRIAR SERVIDOR →'}</button>
      </form>
    </Modal>
  )
}
