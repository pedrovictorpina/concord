import { createClient } from 'npm:@supabase/supabase-js@2.112.3'
import { AccessToken } from 'npm:livekit-server-sdk@2.18.0'

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
}

const fail = (message: string, status: number, code: string) =>
  Response.json({ error: message, code }, { status, headers: corsHeaders })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return fail('Metodo nao permitido.', 405, 'method_not_allowed')

  const authorization = request.headers.get('Authorization')
  if (!authorization) return fail('Autenticacao obrigatoria.', 401, 'missing_authorization')

  const { channelId } = await request.json().catch(() => ({ channelId: null })) as { channelId: string | null }
  if (!channelId) return fail('Canal obrigatorio.', 400, 'missing_channel')

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const callerKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY')
    ?? Deno.env.get('SUPABASE_ANON_KEY')
    ?? serviceRoleKey

  const token = authorization.replace(/^Bearer\s+/i, '').trim()
  const authClient = createClient(supabaseUrl, callerKey)
  const { data: caller, error: authError } = await authClient.auth.getUser(token)
  const user = caller?.user
  if (authError || !user) {
    console.error('[livekit-token] sessao rejeitada', authError)
    return fail('Sessao invalida.', 401, 'invalid_session')
  }

  const admin = createClient(supabaseUrl, serviceRoleKey)
  const { data: channel, error: channelError } = await admin
    .from('channels')
    .select('id, server_id')
    .eq('id', channelId)
    .eq('kind', 'voice')
    .maybeSingle()
  if (channelError) {
    console.error('[livekit-token] falha ao ler o canal', channelError)
    return fail('Nao foi possivel validar o canal.', 500, 'channel_lookup_failed')
  }
  if (!channel) return fail('Canal de voz nao encontrado.', 404, 'channel_not_found')

  const { data: membership, error: membershipError } = await admin
    .from('server_members')
    .select('user_id, role')
    .eq('server_id', channel.server_id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (membershipError) {
    console.error('[livekit-token] falha ao ler a membresia', membershipError)
    return fail('Nao foi possivel validar sua membresia.', 500, 'membership_lookup_failed')
  }
  if (!membership) return fail('Sem permissao para este canal.', 403, 'not_a_member')

  if (membership.role !== 'owner') {
    const { data: permissions } = await admin
      .from('channel_permissions')
      .select('role, can_speak')
      .eq('channel_id', channel.id)
    if ((permissions ?? []).length > 0 && !permissions?.some((permission) => permission.role === membership.role && permission.can_speak)) {
      return fail('Sem permissao para falar neste canal.', 403, 'cannot_speak')
    }
  }

  const livekitUrl = Deno.env.get('LIVEKIT_URL')
  const livekitApiKey = Deno.env.get('LIVEKIT_API_KEY')
  const livekitApiSecret = Deno.env.get('LIVEKIT_API_SECRET')
  if (!livekitUrl || !livekitApiKey || !livekitApiSecret) {
    console.error('[livekit-token] segredos LIVEKIT_* ausentes')
    return fail('Voz indisponivel nesta instalacao.', 503, 'livekit_not_configured')
  }

  const { data: profile } = await admin.from('profiles').select('nickname').eq('id', user.id).maybeSingle()
  const accessToken = new AccessToken(livekitApiKey, livekitApiSecret, {
    identity: user.id,
    name: profile?.nickname ?? 'Membro',
    ttl: '10m',
  })
  accessToken.addGrant({
    room: `channel-${channel.id}`,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  })

  return Response.json({ serverUrl: livekitUrl, token: await accessToken.toJwt() }, { headers: corsHeaders })
})
