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

  const { data: server, error: serverError } = await clientA
    .from('servers')
    .insert({ owner_id: accountA.userId, name: `Servidor QA ${runId}`, description: 'Validacao remota da etapa 02.' })
    .select('id, name')
    .single()
  assert(!serverError && server, `O proprietario deve conseguir criar um servidor. ${serverError?.message ?? ''}`)

  const { data: ownerMembership, error: ownerMembershipError } = await clientA
    .from('server_members')
    .select('role')
    .eq('server_id', server.id)
    .eq('user_id', accountA.userId)
    .single()
  assert(!ownerMembershipError && ownerMembership?.role === 'owner', 'A criacao do servidor deve incluir o proprietario como membro.')

  const { data: defaultChannel, error: defaultChannelError } = await clientA
    .from('channels')
    .select('id, name, kind')
    .eq('server_id', server.id)
    .eq('name', 'geral')
    .single()
  assert(!defaultChannelError && defaultChannel?.kind === 'text', 'A criacao do servidor deve incluir o canal de texto geral.')

  const { data: blockedServerRead, error: blockedServerReadError } = await clientB
    .from('servers')
    .select('id')
    .eq('id', server.id)
  assert(!blockedServerReadError && blockedServerRead?.length === 0, 'Nao membro nao deve visualizar o servidor.')

  const { error: addMemberError } = await clientA
    .from('server_members')
    .insert({ server_id: server.id, user_id: accountB.userId })
  assert(!addMemberError, 'O proprietario deve conseguir adicionar um membro.')

  const { data: visibleServer, error: visibleServerError } = await clientB
    .from('servers')
    .select('id')
    .eq('id', server.id)
    .single()
  assert(!visibleServerError && visibleServer?.id === server.id, 'Membro deve visualizar o servidor.')

  const realtimeMessage = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Realtime nao entregou a mensagem do canal a tempo.')), 10000)
    const realtimeChannel = clientB
      .channel(`qa-messages-${runId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${defaultChannel.id}` }, (payload) => {
        clearTimeout(timeout)
        void clientB.removeChannel(realtimeChannel)
        resolve(payload.new)
      })
      .subscribe(async (status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          clearTimeout(timeout)
          void clientB.removeChannel(realtimeChannel)
          reject(new Error(`Realtime nao conseguiu assinar o canal: ${status}.`))
          return
        }
        if (status !== 'SUBSCRIBED') return
        const { error: messageError } = await clientA.from('messages').insert({
          channel_id: defaultChannel.id,
          author_id: accountA.userId,
          body: 'Mensagem QA em tempo real.',
        })
        if (messageError) {
          clearTimeout(timeout)
          void clientB.removeChannel(realtimeChannel)
          reject(messageError)
        }
      })
  })
  const receivedMessage = await realtimeMessage
  assert(receivedMessage?.body === 'Mensagem QA em tempo real.', 'Membro deve receber mensagem pelo Realtime.')

  const { data: request, error: requestError } = await clientA
    .from('friend_requests')
    .insert({ sender_id: accountA.userId, recipient_id: accountB.userId })
    .select('id')
    .single()
  assert(!requestError && request, 'Usuario deve conseguir enviar solicitacao de amizade.')

  const { error: acceptError } = await clientB
    .from('friend_requests')
    .update({ status: 'accepted' })
    .eq('id', request.id)
  assert(!acceptError, 'Destinatario deve conseguir aceitar solicitacao de amizade.')

  const { data: friendship, error: friendshipError } = await clientA
    .from('friendships')
    .select('id')
    .or(`user_a_id.eq.${accountA.userId},user_b_id.eq.${accountA.userId}`)
    .single()
  assert(!friendshipError && friendship, 'Aceitar solicitacao deve criar a amizade canonica.')

  const { data: inviteOnlyServer, error: inviteOnlyServerError } = await clientA
    .from('servers')
    .insert({ owner_id: accountA.userId, name: `Convite QA ${runId}`, description: 'Validacao de convite direto.' })
    .select('id')
    .single()
  assert(!inviteOnlyServerError && inviteOnlyServer, 'O proprietario deve conseguir criar o servidor usado no convite.')

  const { data: serverInvite, error: serverInviteError } = await clientA
    .from('server_invites')
    .insert({ server_id: inviteOnlyServer.id, sender_id: accountA.userId, recipient_id: accountB.userId })
    .select('id')
    .single()
  assert(!serverInviteError && serverInvite, 'O proprietario deve conseguir enviar convite de servidor.')

  const { error: acceptInviteError } = await clientB
    .from('server_invites')
    .update({ status: 'accepted' })
    .eq('id', serverInvite.id)
  assert(!acceptInviteError, 'O destinatario deve conseguir aceitar convite de servidor.')

  const { data: invitedMembership, error: invitedMembershipError } = await clientB
    .from('server_members')
    .select('role')
    .eq('server_id', inviteOnlyServer.id)
    .eq('user_id', accountB.userId)
    .single()
  assert(!invitedMembershipError && invitedMembership?.role === 'member', 'Aceitar convite deve adicionar o destinatario ao servidor.')

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
    checks: ['signup', 'profile-trigger', 'login', 'password-update', 'authenticated-read', 'own-update', 'foreign-update-blocked', 'anonymous-read-blocked', 'server-create', 'owner-membership', 'default-channel', 'non-member-server-blocked', 'member-server-read', 'realtime-message', 'friend-request', 'friendship-accept', 'server-invite', 'server-invite-accept'],
    cleanupManifest: '.qa/supabase-test-users.json',
  }))
} finally {
  persistManifest()
  await Promise.allSettled([clientA.auth.signOut(), clientB.auth.signOut()])
  clientA.realtime.disconnect()
  clientB.realtime.disconnect()
  anonymousClient.realtime.disconnect()
}
