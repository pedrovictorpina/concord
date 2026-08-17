import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import WebSocket from 'ws'

const parseEnv = (content) => Object.fromEntries(
  content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const separator = line.indexOf('=')
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')]
    }),
)

const envPath = fileURLToPath(new URL('../../.env.local', import.meta.url))
const qaArtifactsDir = fileURLToPath(new URL('../../../../.qa', import.meta.url))
const manifestPath = fileURLToPath(new URL('../../../../.qa/supabase-test-users.json', import.meta.url))
const env = parseEnv(readFileSync(envPath, 'utf8'))
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY em apps/web/.env.local.')
}

const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
const runId = `${Date.now()}-${randomUUID().slice(0, 8)}`
const previousManifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8'))
  : { createdUsers: [] }
const createdUsers = previousManifest.projectRef && previousManifest.projectRef !== projectRef
  ? []
  : [...previousManifest.createdUsers]
const currentRunUsers = []

const createTestClient = () => createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
  realtime: { transport: WebSocket },
})

const persistManifest = () => {
  mkdirSync(qaArtifactsDir, { recursive: true })
  writeFileSync(manifestPath, JSON.stringify({ projectRef, runId, createdUsers }, null, 2))
}

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const waitForProfile = async (client, userId) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const { data, error } = await client
      .from('profiles')
      .select('id, nickname, username, status')
      .eq('id', userId)
      .maybeSingle()

    if (!error && data) return data
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error('O perfil automatico nao ficou disponivel a tempo.')
}

const registerTestUser = async (client, label, nickname) => {
  const email = `concord.qa.${label}.${runId}@example.com`
  const password = `Concord!${randomUUID()}Aa9`
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  })

  if (error) throw error
  assert(data.user, `O usuario QA ${label} nao foi criado.`)
  assert(data.session, 'O cadastro nao iniciou sessao. Confirme que a verificacao de e-mail esta desativada.')

  const createdUser = { id: data.user.id, email, label, runId }
  createdUsers.push(createdUser)
  currentRunUsers.push(createdUser)
  persistManifest()
  return { email, password, userId: data.user.id }
}

const clientA = createTestClient()
const clientB = createTestClient()
const anonymousClient = createTestClient()

try {
  const accountA = await registerTestUser(clientA, 'alpha', 'QA Alpha')
  const accountB = await registerTestUser(clientB, 'beta', 'QA Beta')
  const profileA = await waitForProfile(clientA, accountA.userId)
  const profileB = await waitForProfile(clientB, accountB.userId)

  assert(profileA.nickname === 'QA Alpha', 'O nickname do perfil Alpha nao corresponde ao cadastro.')
  assert(profileB.nickname === 'QA Beta', 'O nickname do perfil Beta nao corresponde ao cadastro.')
  assert(/^[a-z0-9][a-z0-9._-]{2,31}$/.test(profileA.username), 'O username Alpha nao segue o contrato.')
  assert(profileA.username !== profileB.username, 'Os usernames precisam ser unicos.')

  const { data: visibleProfile, error: visibilityError } = await clientB
    .from('profiles')
    .select('id')
    .eq('id', accountA.userId)
    .single()
  assert(!visibilityError && visibleProfile?.id === accountA.userId, 'Usuario autenticado deve visualizar outros perfis.')

  const { data: ownUpdate, error: ownUpdateError } = await clientA
    .from('profiles')
    .update({ nickname: 'QA Alpha Atualizado' })
    .eq('id', accountA.userId)
    .select('nickname')
    .single()
  assert(!ownUpdateError && ownUpdate?.nickname === 'QA Alpha Atualizado', 'Usuario deve atualizar o proprio perfil.')

  const { data: foreignUpdate, error: foreignUpdateError } = await clientA
    .from('profiles')
    .update({ nickname: 'Alteracao bloqueada' })
    .eq('id', accountB.userId)
    .select('id')
  assert(!foreignUpdateError && foreignUpdate?.length === 0, 'RLS deve bloquear a alteracao do perfil de outro usuario.')

  const { data: anonymousProfiles, error: anonymousReadError } = await anonymousClient.from('profiles').select('id').limit(1)
  assert(!anonymousReadError && anonymousProfiles?.length === 0, 'RLS deve ocultar perfis de usuarios anonimos.')

  await clientA.auth.signOut()
  const { data: signedInAgain, error: signInError } = await clientA.auth.signInWithPassword({
    email: accountA.email,
    password: accountA.password,
  })
  assert(!signInError && signedInAgain.session, 'Login com senha deve restaurar uma sessao valida.')

  const nextPassword = `Concord!${randomUUID()}Bb8`
  const { error: passwordError } = await clientA.auth.updateUser({ password: nextPassword })
  assert(!passwordError, 'A troca de senha autenticada deve funcionar.')
  await clientA.auth.signOut()

  const { data: passwordSignIn, error: passwordSignInError } = await clientA.auth.signInWithPassword({
    email: accountA.email,
    password: nextPassword,
  })
  assert(!passwordSignInError && passwordSignIn.session, 'A nova senha deve iniciar sessao.')

  console.log(JSON.stringify({
    ok: true,
    projectRef,
    usersCreated: currentRunUsers.length,
    usersPendingCleanup: createdUsers.length,
    checks: ['signup', 'profile-trigger', 'login', 'password-update', 'authenticated-read', 'own-update', 'foreign-update-blocked', 'anonymous-read-blocked'],
    cleanupManifest: '.qa/supabase-test-users.json',
  }))
} finally {
  persistManifest()
  await Promise.allSettled([clientA.auth.signOut(), clientB.auth.signOut()])
}
