import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Tooltip } from 'radix-ui'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './features/auth/AuthProvider'
import { ThemeProvider } from './theme/ThemeProvider'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { void navigator.serviceWorker.register('/service-worker.js') })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <Tooltip.Provider delayDuration={250}>
          <App />
        </Tooltip.Provider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
