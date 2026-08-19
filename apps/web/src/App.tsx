import { useState } from 'react'
import { AuthScreen } from './features/auth/AuthScreen'
import { useAuth } from './features/auth/useAuth'
import { WorkspaceShell } from './features/workspace/WorkspaceShell'

function App() {
  const { loading, profile, profileError, profileLoading, recoveryMode, session, signOut } = useAuth()
  const [demoMode, setDemoMode] = useState(false)

  if (loading || (session && profileLoading)) {
    return (
      <main className="app-loading" aria-live="polite">
        <span>C</span>
        <p>Sintonizando identidade...</p>
      </main>
    )
  }

  if (recoveryMode) {
    return <AuthScreen onExplore={() => setDemoMode(true)} />
  }

  if (session || demoMode) {
    const exitWorkspace = async () => {
      if (session) await signOut()
      setDemoMode(false)
    }

    const metadataNickname = session?.user.user_metadata.nickname
    const fallbackNickname = typeof metadataNickname === 'string' && metadataNickname.trim()
      ? metadataNickname.trim()
      : session?.user.email?.split('@')[0] || 'usuario'
    const nickname = demoMode ? 'Pedro' : profile?.nickname || fallbackNickname
    const username = demoMode ? 'fundador' : profile?.username || fallbackNickname.toLowerCase()
    const initials = nickname
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()

    return (
      <WorkspaceShell
        demoMode={demoMode}
        identity={{
          nickname,
          username,
          initials,
          connectionLabel: demoMode ? 'demonstracao local' : profileError ? 'perfil em contingencia' : 'identidade sincronizada',
        }}
        onExit={exitWorkspace}
        userId={session?.user.id}
      />
    )
  }

  return <AuthScreen onExplore={() => setDemoMode(true)} />
}

export default App
