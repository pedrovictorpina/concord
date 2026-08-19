import { useState } from 'react'
import type { FormEvent } from 'react'
import { ThemeControls } from '../../components/theme/ThemeControls'
import { useAuth } from './useAuth'
import './AuthScreen.css'

type EntryMode = 'sign-in' | 'sign-up' | 'forgot-password'
type FormMode = EntryMode | 'update-password'

type AuthScreenProps = {
  onExplore: () => void
}

const presentation: Record<FormMode, { eyebrow: string; heading: string; description: string }> = {
  'sign-in': {
    eyebrow: 'RETOMAR CONEXAO',
    heading: 'Bom ter você de volta.',
    description: 'Use suas credenciais para entrar.',
  },
  'sign-up': {
    eyebrow: 'NOVO REGISTRO',
    heading: 'Abra sua frequência.',
    description: 'Nickname, e-mail e senha. Só o essencial.',
  },
  'forgot-password': {
    eyebrow: 'RECUPERAR ACESSO',
    heading: 'Reative seu sinal.',
    description: 'Enviaremos um link seguro se o e-mail estiver cadastrado.',
  },
  'update-password': {
    eyebrow: 'NOVA CREDENCIAL',
    heading: 'Defina uma nova senha.',
    description: 'Use pelo menos oito caracteres e não repita a senha anterior.',
  },
}

export function AuthScreen({ onExplore }: AuthScreenProps) {
  const {
    configured,
    loading,
    recoveryMode,
    requestPasswordReset,
    signIn,
    signUp,
    updatePassword,
  } = useAuth()
  const [mode, setMode] = useState<EntryMode>('sign-in')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepSession, setKeepSession] = useState(true)
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null)
  const formMode: FormMode = recoveryMode ? 'update-password' : mode
  const copy = presentation[formMode]

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(null)

    if (formMode === 'update-password' && password !== passwordConfirmation) {
      setFeedback({ ok: false, message: 'As senhas precisam ser iguais.' })
      return
    }

    setSubmitting(true)
    let result
    if (formMode === 'sign-up') {
      result = await signUp({ email: email.trim(), nickname: nickname.trim(), password })
    } else if (formMode === 'sign-in') {
      result = await signIn({ email: email.trim(), password, keepSession })
    } else if (formMode === 'forgot-password') {
      result = await requestPasswordReset(email.trim())
    } else {
      result = await updatePassword(password)
    }

    setFeedback(result)
    setSubmitting(false)
  }

  const changeMode = (nextMode: EntryMode) => {
    setMode(nextMode)
    setFeedback(null)
    setPassword('')
    setPasswordConfirmation('')
  }

  const submitLabel = submitting
    ? 'TRANSMITINDO...'
    : formMode === 'sign-in'
      ? 'ENTRAR NA REDE'
      : formMode === 'sign-up'
        ? 'CRIAR IDENTIDADE'
        : formMode === 'forgot-password'
          ? 'ENVIAR LINK SEGURO'
          : 'ATUALIZAR SENHA'

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-labelledby="auth-title">
        <div className="auth-brand"><span>C</span><strong>CONCORD</strong><small>ALPHA 01</small></div>
        <div className="auth-story-copy">
          <span className="eyebrow">IDENTIDADE / SINAL PRIVADO</span>
          <h1 id="auth-title">Entre.<br />Fale.<br /><em>Permaneça.</em></h1>
          <p>Comunicação direta para grupos que preferem presença a excesso de recursos.</p>
        </div>
        <div className="auth-frequency" aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i /><i /><i />
        </div>
        <footer>
          <span>WEB</span><span>WINDOWS</span><span>ANDROID</span><span>IOS</span>
        </footer>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-inner">
          <header className="auth-panel-header">
            <div>
              <span className={configured ? 'config-dot ready' : 'config-dot'} />
              {configured ? 'REDE CONFIGURADA' : 'MODO LOCAL / SEM SUPABASE'}
            </div>
            <ThemeControls compact />
          </header>

          <div className="auth-card">
            {formMode === 'sign-in' || formMode === 'sign-up' ? (
              <div className="auth-tabs" role="tablist" aria-label="Acesso">
                <button
                  className={formMode === 'sign-in' ? 'active' : ''}
                  type="button"
                  role="tab"
                  aria-selected={formMode === 'sign-in'}
                  onClick={() => changeMode('sign-in')}
                >
                  Entrar
                </button>
                <button
                  className={formMode === 'sign-up' ? 'active' : ''}
                  type="button"
                  role="tab"
                  aria-selected={formMode === 'sign-up'}
                  onClick={() => changeMode('sign-up')}
                >
                  Criar conta
                </button>
              </div>
            ) : null}

            <div className="auth-heading">
              <span className="eyebrow">{copy.eyebrow}</span>
              <h2>{copy.heading}</h2>
              <p>{copy.description}</p>
            </div>

            <form onSubmit={submit}>
              {formMode === 'sign-up' ? (
                <label>
                  <span>Nickname</span>
                  <input
                    required
                    minLength={3}
                    maxLength={32}
                    autoComplete="nickname"
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    placeholder="Como devemos chamar voce?"
                  />
                </label>
              ) : null}

              {formMode !== 'update-password' ? (
                <label>
                  <span>E-mail</span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@exemplo.com"
                  />
                </label>
              ) : null}

              {formMode !== 'forgot-password' ? (
                <label>
                  <span>{formMode === 'update-password' ? 'Nova senha' : 'Senha'}</span>
                  <input
                    required
                    type="password"
                    minLength={8}
                    autoComplete={formMode === 'sign-in' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimo de 8 caracteres"
                  />
                </label>
              ) : null}

              {formMode === 'update-password' ? (
                <label>
                  <span>Confirmar nova senha</span>
                  <input
                    required
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                    placeholder="Repita a nova senha"
                  />
                </label>
              ) : null}

              {formMode === 'sign-in' ? (
                <div className="auth-login-options">
                  <label className="auth-keep-session">
                    <input
                      checked={keepSession}
                      type="checkbox"
                      onChange={(event) => setKeepSession(event.target.checked)}
                    />
                    <span>Manter conectado</span>
                  </label>
                  <button className="auth-secondary-action" type="button" onClick={() => changeMode('forgot-password')}>
                    Esqueci minha senha
                  </button>
                </div>
              ) : null}

              {feedback ? (
                <p className={feedback.ok ? 'auth-feedback success' : 'auth-feedback'} role="status">
                  {feedback.message}
                </p>
              ) : null}

              <button className="auth-submit" type="submit" disabled={submitting || loading}>
                <span>{submitLabel}</span>
                <i>→</i>
              </button>
            </form>

            {formMode === 'forgot-password' ? (
              <button className="demo-link" type="button" onClick={() => changeMode('sign-in')}>
                Voltar para o login
              </button>
            ) : null}

            {!recoveryMode && formMode !== 'forgot-password' ? (
              <button className="demo-link" type="button" onClick={onExplore}>
                Explorar demonstração local
              </button>
            ) : null}
          </div>

          <footer className="auth-theme-note">
            <span>ESTILO ATIVO</span>
            <strong>Concord Neo</strong>
            <small>O modo do dispositivo continua ativo; novos estilos entram pelo registro de temas.</small>
          </footer>
        </div>
      </section>
    </main>
  )
}
