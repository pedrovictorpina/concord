import type { StyleThemeDefinition, StyleThemeId } from './theme-types'

export const defaultStyleTheme: StyleThemeId = 'concord'

export const styleThemes: readonly StyleThemeDefinition[] = [
  {
    id: 'concord',
    label: 'Concord Neo',
    description: 'Neo-brutalismo em indigo, amarelo e alto contraste.',
    available: true,
  },
  {
    id: 'ios',
    label: 'iOS Glass',
    description: 'Superfícies translúcidas, cantos suaves e acentos azuis.',
    available: true,
  },
  {
    id: 'brutal',
    label: 'Brutal Signal',
    description: 'Blocos fortes, bordas retas e amarelo de alta energia.',
    available: true,
  },
]
