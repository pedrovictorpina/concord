import { useState } from 'react'
import { AuthScreen } from './features/auth/AuthScreen'
import { useAuth } from './features/auth/useAuth'
import { WorkspaceShell } from './features/workspace/WorkspaceShell'

function App() {
  const { loading, session, signOut } = useAuth()
  const [demoMode, setDemoMode] = useState(false)

  if (loading) {
    return (
      <main className="app-loading" aria-live="polite">
        <span>D</span>
        <p>Sintonizando identidade...</p>
      </main>
    )
  }

  if (session || demoMode) {
    const exitWorkspace = async () => {
      if (session) await signOut()
      setDemoMode(false)
    }

    return <WorkspaceShell onExit={exitWorkspace} />
  }

  return <AuthScreen onExplore={() => setDemoMode(true)} />
}

export default App
