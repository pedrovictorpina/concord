import type { StyleThemeDefinition, StyleThemeId } from './theme-types'

export const defaultStyleTheme: StyleThemeId = 'concord'

export const styleThemes: readonly StyleThemeDefinition[] = [
  {
    id: 'concord',
    label: 'Concord',
    description: 'Fundos azulados escuros, verde da marca e superfícies em camadas.',
    available: true,
  },
  {
    id: 'neo',
    label: 'Neo Brutalism',
    description: 'Bordas fortes, sombras duras e alto contraste.',
    available: true,
  },
  {
    id: 'glass',
    label: 'Liquid Glass',
    description: 'Transparência, profundidade, blur e movimento fluido.',
    available: true,
  },
]
