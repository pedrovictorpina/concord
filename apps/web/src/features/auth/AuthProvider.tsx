import { useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import { AuthContext } from './AuthContext'
import type { AuthCredentials, AuthResult, SignUpCredentials } from './AuthContext'

const notConfigured: AuthResult = {
  ok: false,
  message: 'Supabase ainda nao configurado. Use a demonstracao local ou adicione o .env.',
}

const translateAuthError = (message: string) => {
  const normalized = message.toLowerCase()
  if (normalized.includes('invalid login credentials')) return 'E-mail ou senha invalidos.'
  if (normalized.includes('user already registered')) return 'Este e-mail ja esta cadastrado.'
  if (normalized.includes('password should be')) return 'A senha nao atende aos requisitos minimos.'
  return 'Nao foi possivel concluir a operacao. Tente novamente.'
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    const client = supabase
    if (!client) {
      setLoading(false)
      return
    }

    let mounted = true
    void client.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session)
        setLoading(false)
      }
    })

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    configured: isSupabaseConfigured,
    loading,
    session,
    signIn: async ({ email, password }: AuthCredentials): Promise<AuthResult> => {
      if (!supabase) return notConfigured
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { ok: false, message: translateAuthError(error.message) }
      return { ok: true, message: 'Sessao iniciada.' }
    },
    signUp: async ({ email, nickname, password }: SignUpCredentials): Promise<AuthResult> => {
      if (!supabase) return notConfigured
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname } },
      })
      if (error) return { ok: false, message: translateAuthError(error.message) }
      return { ok: true, message: 'Conta criada. Bem-vindo ao Concord.' }
    },
    signOut: async (): Promise<AuthResult> => {
      if (!supabase) return notConfigured
      const { error } = await supabase.auth.signOut()
      if (error) return { ok: false, message: translateAuthError(error.message) }
      return { ok: true, message: 'Sessao encerrada.' }
    },
  }), [loading, session])

  return <AuthContext value={value}>{children}</AuthContext>
}
