import { useState } from 'react'
import { Toggle } from '../../../components/ui/Toggle'

type Result = { ok: boolean; message: string }

type NotificationSettingsProps = {
  onSetMuted: (muted: boolean) => Promise<Result>
  serverHasContext: boolean
  serverMuted: boolean
}

export function NotificationSettings({ onSetMuted, serverHasContext, serverMuted }: NotificationSettingsProps) {
  const [feedback, setFeedback] = useState('')

  const toggle = async (checked: boolean) => {
    setFeedback('')
    const result = await onSetMuted(checked)
    setFeedback(result.message)
  }

  return (
    <section className="notification-settings">
      <h1>Notificações</h1>
      <p>Controle quando e como você é avisado sobre atividade no Concord.</p>
      {serverHasContext ? (
        <div className="settings-card">
          <h2>Notificações do servidor</h2>
          <Toggle checked={serverMuted} className="settings-toggle" description="Oculta alertas e contadores deste servidor." label="Silenciar servidor" onChange={(checked) => void toggle(checked)} />
        </div>
      ) : (
        <p className="settings-empty-hint">Selecione um servidor para ajustar as notificações dele.</p>
      )}
      {feedback ? <p className="settings-feedback" role="status">{feedback}</p> : null}
    </section>
  )
}
