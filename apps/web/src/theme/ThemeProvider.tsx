import { useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { ThemeContext } from './ThemeContext'
import { defaultStyleTheme, styleThemes } from './theme-registry'
import { colorModes } from './theme-types'
import type { ColorMode, ResolvedColorMode, StyleThemeId } from './theme-types'

const STORAGE_KEY = 'concord.theme.v1'

type StoredTheme = {
  styleTheme: StyleThemeId
  colorMode: ColorMode
}

const readStoredTheme = (): StoredTheme => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (!value) return { styleTheme: defaultStyleTheme, colorMode: 'system' }

    const parsed = JSON.parse(value) as Partial<StoredTheme>
    const colorMode = colorModes.includes(parsed.colorMode as ColorMode)
      ? (parsed.colorMode as ColorMode)
      : 'system'

    const styleTheme = styleThemes.some((theme) => theme.id === parsed.styleTheme)
      ? parsed.styleTheme as StyleThemeId
      : defaultStyleTheme
    return { styleTheme, colorMode }
  } catch {
    return { styleTheme: defaultStyleTheme, colorMode: 'system' }
  }
}

const getSystemMode = (): ResolvedColorMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

export function ThemeProvider({ children }: PropsWithChildren) {
  const [storedTheme, setStoredTheme] = useState<StoredTheme>(readStoredTheme)
  const [systemMode, setSystemMode] = useState<ResolvedColorMode>(getSystemMode)
  const resolvedColorMode = storedTheme.colorMode === 'system'
    ? systemMode
    : storedTheme.colorMode

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemMode = () => setSystemMode(mediaQuery.matches ? 'dark' : 'light')

    updateSystemMode()
    mediaQuery.addEventListener('change', updateSystemMode)
    return () => mediaQuery.removeEventListener('change', updateSystemMode)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.styleTheme = storedTheme.styleTheme
    root.dataset.colorMode = resolvedColorMode
    root.style.colorScheme = resolvedColorMode
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedTheme))
  }, [resolvedColorMode, storedTheme])

  const value = useMemo(() => ({
    styleTheme: storedTheme.styleTheme,
    colorMode: storedTheme.colorMode,
    resolvedColorMode,
    setStyleTheme: (styleTheme: StyleThemeId) => {
      setStoredTheme((current) => ({ ...current, styleTheme }))
    },
    setColorMode: (colorMode: ColorMode) => {
      setStoredTheme((current) => ({ ...current, colorMode }))
    },
  }), [resolvedColorMode, storedTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}
