import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, setKeepSession, supabase } from '../../lib/supabase'
import { AuthContext } from './AuthContext'
import type { AuthCredentials, AuthResult, ConcordProfile, SignUpCredentials } from './AuthContext'

const notConfigured: AuthResult = {
  ok: false,
  message: 'Supabase ainda nao configurado. Use a demonstracao local ou adicione o .env.',
}

const translateAuthError = (message: string) => {
  const normalized = message.toLowerCase()
  if (normalized.includes('invalid login credentials')) return 'E-mail ou senha invalidos.'
  if (normalized.includes('user already registered')) return 'Este e-mail ja esta cadastrado.'
  if (normalized.includes('password should be')) return 'A senha nao atende aos requisitos minimos.'
  if (normalized.includes('same password')) return 'A nova senha deve ser diferente da atual.'
  if (normalized.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos.'
  return 'Nao foi possivel concluir a operacao. Tente novamente.'
}

const mapProfile = (row: {
  id: string
  nickname: string
  username: string
  avatar_url: string | null
  status: ConcordProfile['status']
}): ConcordProfile => ({
  id: row.id,
  nickname: row.nickname,
  username: row.username,
  avatarUrl: row.avatar_url,
  status: row.status,
})

const hasRecoveryQuery = () => new URL(window.location.href).searchParams.has('recovery')

const clearRecoveryQuery = () => {
  const url = new URL(window.location.href)
  if (!url.searchParams.has('recovery')) return
  url.searchParams.delete('recovery')
  window.history.replaceState({}, '', `${url.pathname}${url.search}`)
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [profile, setProfile] = useState<ConcordProfile | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [recoveryMode, setRecoveryMode] = useState(false)
  const loadedProfileUserId = useRef<string | null>(null)

  const loadProfile = useCallback(async (userId: string | null) => {
    loadedProfileUserId.current = userId

    if (!supabase || !userId) {
      setProfile(null)
      setProfileError(null)
      setProfileLoading(false)
      return
    }

    setProfileLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nickname, username, avatar_url, status')
      .eq('id', userId)
      .maybeSingle()

    if (error || !data) {
      setProfile(null)
      setProfileError('Perfil indisponivel. Tente entrar novamente.')
    } else {
      setProfile(mapProfile(data))
      setProfileError(null)
    }
    setProfileLoading(false)
  }, [])

  useEffect(() => {
    const client = supabase
    if (!client) {
      setLoading(false)
      return
    }

    let mounted = true
    let profileTimer: ReturnType<typeof setTimeout> | undefined

    void client.auth.getSession().then(async ({ data }) => {
      if (mounted) {
        setSession(data.session)
        setRecoveryMode(hasRecoveryQuery() && Boolean(data.session))
        await loadProfile(data.session?.user.id ?? null)
        setLoading(false)
      }
    })

    const { data: { subscription } } = client.auth.onAuthStateChange((event, nextSession) => {
      setSession((current) => current?.access_token === nextSession?.access_token ? current : nextSession)
      setLoading(false)
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true)
      if (event === 'SIGNED_OUT') {
        setRecoveryMode(false)
        clearRecoveryQuery()
      }

      const nextUserId = nextSession?.user.id ?? null
      if (event !== 'USER_UPDATED' && nextUserId === loadedProfileUserId.current) return

      if (profileTimer) clearTimeout(profileTimer)
      profileTimer = setTimeout(() => {
        void loadProfile(nextUserId)
      }, 0)
    })

    return () => {
      mounted = false
      if (profileTimer) clearTimeout(profileTimer)
      subscription.unsubscribe()
    }
  }, [loadProfile])

  const value = useMemo(() => ({
    configured: isSupabaseConfigured,
    loading,
    profile,
    profileError,
    profileLoading,
    recoveryMode,
    session,
    requestPasswordReset: async (email: string): Promise<AuthResult> => {
      if (!supabase) return notConfigured
      const redirectTo = import.meta.env.VITE_AUTH_REDIRECT_URL?.trim() || `${window.location.origin}/?recovery=1`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) return { ok: false, message: translateAuthError(error.message) }
      return { ok: true, message: 'Se o e-mail estiver cadastrado, enviaremos as instrucoes de recuperacao.' }
    },
    signIn: async ({ email, password, keepSession = true }: AuthCredentials): Promise<AuthResult> => {
      if (!supabase) return notConfigured
      setKeepSession(keepSession)
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
    updatePassword: async (password: string): Promise<AuthResult> => {
      if (!supabase) return notConfigured
      const { error } = await supabase.auth.updateUser({ password })
      if (error) return { ok: false, message: translateAuthError(error.message) }
      setRecoveryMode(false)
      clearRecoveryQuery()
      return { ok: true, message: 'Senha atualizada. Sua identidade esta segura.' }
    },
    updateProfile: async ({ nickname, username, avatarUrl }: Pick<ConcordProfile, 'nickname' | 'username' | 'avatarUrl'>): Promise<AuthResult> => {
      if (!supabase || !session) return notConfigured
      const { data, error } = await supabase
        .from('profiles')
        .update({ nickname: nickname.trim(), username: username.trim().toLowerCase(), avatar_url: avatarUrl?.trim() || null })
        .eq('id', session.user.id)
        .select('id, nickname, username, avatar_url, status')
        .single()
      if (error || !data) return { ok: false, message: 'Nao foi possivel atualizar o perfil. Verifique o identificador escolhido.' }
      setProfile(mapProfile(data))
      return { ok: true, message: 'Perfil atualizado.' }
    },
    uploadAvatar: async (file: File) => {
      if (!supabase || !session) return notConfigured
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
        return { ok: false, message: 'Use uma imagem JPG, PNG ou WEBP de até 2 MB.' }
      }
      const extension = file.type.split('/')[1]
      const path = `${session.user.id}/avatar.${extension}`
      const { error } = await supabase.storage.from('avatars').upload(path, file, { cacheControl: '3600', contentType: file.type, upsert: true })
      if (error) return { ok: false, message: 'Não foi possível enviar a foto.' }
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      return { ok: true, message: 'Foto enviada.', url: `${data.publicUrl}?v=${Date.now()}` }
    },
  }), [loading, profile, profileError, profileLoading, recoveryMode, session])

  return <AuthContext value={value}>{children}</AuthContext>
}
