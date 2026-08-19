import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export type AuthCredentials = {
  email: string
  password: string
  keepSession?: boolean
}

export type SignUpCredentials = AuthCredentials & {
  nickname: string
}

export type AuthResult = {
  ok: boolean
  message: string
}

export type ConcordProfile = {
  id: string
  nickname: string
  username: string
  avatarUrl: string | null
  status: 'online' | 'away' | 'busy' | 'offline'
}

export type AuthContextValue = {
  configured: boolean
  loading: boolean
  profile: ConcordProfile | null
  profileError: string | null
  profileLoading: boolean
  recoveryMode: boolean
  session: Session | null
  requestPasswordReset: (email: string) => Promise<AuthResult>
  signIn: (credentials: AuthCredentials) => Promise<AuthResult>
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
  updatePassword: (password: string) => Promise<AuthResult>
  updateProfile: (profile: Pick<ConcordProfile, 'nickname' | 'username' | 'avatarUrl'>) => Promise<AuthResult>
  uploadAvatar: (file: File) => Promise<{ ok: boolean; message: string; url?: string }>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
