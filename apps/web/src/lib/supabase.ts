import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
const browserWindow = typeof window === 'undefined' ? null : window

let keepSession = true

const sessionStorage = {
  getItem: (key: string) => browserWindow?.sessionStorage.getItem(key) ?? browserWindow?.localStorage.getItem(key) ?? null,
  setItem: (key: string, value: string) => {
    const target = keepSession ? browserWindow?.localStorage : browserWindow?.sessionStorage
    const other = keepSession ? browserWindow?.sessionStorage : browserWindow?.localStorage
    other?.removeItem(key)
    target?.setItem(key, value)
  },
  removeItem: (key: string) => {
    browserWindow?.localStorage.removeItem(key)
    browserWindow?.sessionStorage.removeItem(key)
  },
}

export const setKeepSession = (value: boolean) => {
  keepSession = value
}

export const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: sessionStorage,
      },
    })
  : null

export const isSupabaseConfigured = supabase !== null
