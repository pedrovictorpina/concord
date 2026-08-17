import { useState } from 'react'
import type { FormEvent } from 'react'
import { ThemeControls } from '../../components/theme/ThemeControls'
import { useAuth } from './useAuth'
import './AuthScreen.css'

type AuthMode = 'sign-in' | 'sign-up'

type AuthScreenProps = {
  onExplore: () => void
}

export function AuthScreen({ onExplore }: AuthScreenProps) {
  const { configured, loading, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    const result = mode === 'sign-up'
      ? await signUp({ email: email.trim(), nickname: nickname.trim(), password })
      : await signIn({ email: email.trim(), password })

    setFeedback(result)
    setSubmitting(false)
  }

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setFeedback(null)
  }

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
            <div className="auth-tabs" role="tablist" aria-label="Acesso">
              <button
                className={mode === 'sign-in' ? 'active' : ''}
                type="button"
                role="tab"
                aria-selected={mode === 'sign-in'}
                onClick={() => changeMode('sign-in')}
              >
                Entrar
              </button>
              <button
                className={mode === 'sign-up' ? 'active' : ''}
                type="button"
                role="tab"
                aria-selected={mode === 'sign-up'}
                onClick={() => changeMode('sign-up')}
              >
                Criar conta
              </button>
            </div>

            <div className="auth-heading">
              <span className="eyebrow">{mode === 'sign-in' ? 'RETOMAR CONEXAO' : 'NOVO REGISTRO'}</span>
              <h2>{mode === 'sign-in' ? 'Bom ter você de volta.' : 'Abra sua frequência.'}</h2>
              <p>{mode === 'sign-in' ? 'Use suas credenciais para entrar.' : 'Nickname, e-mail e senha. Só o essencial.'}</p>
            </div>

            <form onSubmit={submit}>
              {mode === 'sign-up' ? (
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

              <label>
                <span>Senha</span>
                <input
                  required
                  type="password"
                  minLength={8}
                  autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimo de 8 caracteres"
                />
              </label>

              {feedback ? (
                <p className={feedback.ok ? 'auth-feedback success' : 'auth-feedback'} role="status">
                  {feedback.message}
                </p>
              ) : null}

              <button className="auth-submit" type="submit" disabled={submitting || loading}>
                <span>{submitting ? 'TRANSMITINDO...' : mode === 'sign-in' ? 'ENTRAR NA REDE' : 'CRIAR IDENTIDADE'}</span>
                <i>→</i>
              </button>
            </form>

            <button className="demo-link" type="button" onClick={onExplore}>
              Explorar demonstração local
            </button>
          </div>

          <footer className="auth-theme-note">
            <span>ESTILO ATIVO</span>
            <strong>Concord Signal</strong>
            <small>iOS e neo-brutalismo serão adicionados pelo registro de temas.</small>
          </footer>
        </div>
      </section>
    </main>
  )
}
