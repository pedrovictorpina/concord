import { ThemeControls } from '../../../components/theme/ThemeControls'

export function AppearanceSettings() {
  return (
    <section className="appearance-settings">
      <h1>Aparência</h1>
      <p>Personalize como o Concord é exibido para você.</p>
      <div className="appearance-preview" aria-hidden="true">
        <span className="appearance-preview-brand">Concord</span>
        <div className="appearance-preview-message"><span># geral</span><p>mensagem</p></div>
      </div>
      <ThemeControls />
    </section>
  )
}
