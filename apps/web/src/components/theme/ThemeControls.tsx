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
      <div className="theme-style-field">
        <label htmlFor={compact ? 'style-theme-compact' : 'style-theme'}>Estilo</label>
        <select
          id={compact ? 'style-theme-compact' : 'style-theme'}
          value={styleTheme}
          onChange={(event) => setStyleTheme(event.target.value as StyleThemeId)}
        >
          {styleThemes.map((theme) => (
            <option key={theme.id} value={theme.id} disabled={!theme.available}>
              {theme.label}
            </option>
          ))}
        </select>
      </div>

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
