import { useState } from 'react'
import type { FormEvent } from 'react'

type CreateServerDialogProps = {
  onClose: () => void
  onCreate: (name: string, description: string) => Promise<{ ok: boolean; message: string }>
}

export function CreateServerDialog({ onClose, onCreate }: CreateServerDialogProps) {
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
    <div className="server-dialog-backdrop" role="presentation">
      <section className="server-dialog" role="dialog" aria-modal="true" aria-labelledby="create-server-title">
        <button className="dialog-close" type="button" aria-label="Fechar criacao de servidor" onClick={onClose}>×</button>
        <span className="eyebrow">NOVA FREQUENCIA</span>
        <h2 id="create-server-title">Dê um nome<br />ao seu lugar.</h2>
        <p>Você será o dono. O Concord abre <strong>#geral</strong> assim que o servidor nascer.</p>
        <form onSubmit={submit}>
          <label>
            <span>Nome do servidor</span>
            <input required minLength={3} maxLength={48} autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Equipe de produto" />
          </label>
          <label>
            <span>Descrição <small>opcional</small></span>
            <textarea maxLength={160} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Para quem está construindo junto." />
          </label>
          {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
          <button className="dialog-submit" type="submit" disabled={submitting}>{submitting ? 'ABRINDO...' : 'CRIAR SERVIDOR →'}</button>
        </form>
      </section>
    </div>
  )
}
