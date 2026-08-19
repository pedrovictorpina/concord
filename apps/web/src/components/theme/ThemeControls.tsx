import { Choice } from '../ui/Choice'
import { styleThemes } from '../../theme/theme-registry'
import { colorModes } from '../../theme/theme-types'
import type { ColorMode, StyleThemeId } from '../../theme/theme-types'
import { useTheme } from '../../theme/useTheme'
import './ThemeControls.css'

const modeLabels: Record<ColorMode, string> = {
  system: 'Sistema',
  light: 'Claro',
  dark: 'Escuro',
}

type ThemeControlsProps = {
  compact?: boolean
}

export function ThemeControls({ compact = false }: ThemeControlsProps) {
  const { colorMode, resolvedColorMode, setColorMode, setStyleTheme, styleTheme } = useTheme()

  return (
    <section className={compact ? 'theme-controls compact' : 'theme-controls'} aria-label="Aparencia">
      <Choice
        className="theme-style-field"
        label="Estilo"
        onChange={(value: StyleThemeId) => setStyleTheme(value)}
        options={styleThemes.map((theme) => ({ value: theme.id, label: theme.label, disabled: !theme.available }))}
        value={styleTheme}
      />

      <div className="mode-selector" aria-label="Modo de cor">
        {colorModes.map((mode) => (
          <button
            className={colorMode === mode ? 'active' : ''}
            key={mode}
            type="button"
            aria-pressed={colorMode === mode}
            onClick={() => setColorMode(mode)}
          >
            {modeLabels[mode]}
          </button>
        ))}
      </div>

      {!compact ? (
        <p>Modo aplicado: <strong>{resolvedColorMode === 'dark' ? 'escuro' : 'claro'}</strong></p>
      ) : null}
    </section>
  )
}
