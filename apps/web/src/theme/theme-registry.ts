import type { StyleThemeDefinition, StyleThemeId } from './theme-types'

export const defaultStyleTheme: StyleThemeId = 'concord'

export const styleThemes: readonly StyleThemeDefinition[] = [
  {
    id: 'concord',
    label: 'Concord Signal',
    description: 'Central de radio industrial com sinal verde e ambar.',
    available: true,
  },
]
