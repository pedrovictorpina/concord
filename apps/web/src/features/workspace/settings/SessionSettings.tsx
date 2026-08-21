type SessionSettingsProps = {
  exitLabel: string
  onExit: () => void
}

export function SessionSettings({ exitLabel, onExit }: SessionSettingsProps) {
  return (
    <section className="account-session">
      <h1>Sessão</h1>
      <p>Encerrar a sessão apaga a identidade guardada neste navegador.</p>
      <button className="settings-button danger" type="button" onClick={onExit}>{exitLabel}</button>
    </section>
  )
}
