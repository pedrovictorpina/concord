import type { StyleThemeDefinition, StyleThemeId } from './theme-types'

export const defaultStyleTheme: StyleThemeId = 'darkcord'

export const styleThemes: readonly StyleThemeDefinition[] = [
  {
    id: 'darkcord',
    label: 'Darkcord Signal',
    description: 'Central de radio industrial com sinal verde e ambar.',
    available: true,
  },
]
