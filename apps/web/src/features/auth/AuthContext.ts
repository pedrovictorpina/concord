import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export type AuthCredentials = {
  email: string
  password: string
}

export type SignUpCredentials = AuthCredentials & {
  nickname: string
}

export type AuthResult = {
  ok: boolean
  message: string
}

export type AuthContextValue = {
  configured: boolean
  loading: boolean
  session: Session | null
  signIn: (credentials: AuthCredentials) => Promise<AuthResult>
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
