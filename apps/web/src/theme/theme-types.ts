export const colorModes = ['system', 'light', 'dark'] as const

export type ColorMode = (typeof colorModes)[number]
export type ResolvedColorMode = Exclude<ColorMode, 'system'>
export type StyleThemeId = 'darkcord'

export type StyleThemeDefinition = {
  id: StyleThemeId
  label: string
  description: string
  available: boolean
}

export type ThemeContextValue = {
  styleTheme: StyleThemeId
  colorMode: ColorMode
  resolvedColorMode: ResolvedColorMode
  setStyleTheme: (theme: StyleThemeId) => void
  setColorMode: (mode: ColorMode) => void
}
