import type { StyleThemeDefinition, StyleThemeId } from './theme-types'

export const defaultStyleTheme: StyleThemeId = 'concord'

export const styleThemes: readonly StyleThemeDefinition[] = [
  {
    id: 'concord',
    label: 'Concord Neo',
    description: 'Neo-brutalismo em indigo, amarelo e alto contraste.',
    available: true,
  },
]
