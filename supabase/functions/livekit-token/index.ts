import { createClient } from 'npm:@supabase/supabase-js@2'
import { AccessToken } from 'npm:livekit-server-sdk@2.18.0'

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return new Response('Metodo nao permitido.', { status: 405, headers: corsHeaders })

  const authorization = request.headers.get('Authorization')
  if (!authorization) return new Response('Autenticacao obrigatoria.', { status: 401, headers: corsHeaders })

  const { channelId } = await request.json().catch(() => ({ channelId: null })) as { channelId: string | null }
  if (!channelId) return new Response('Canal obrigatorio.', { status: 400, headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const publishableKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const userClient = createClient(supabaseUrl, publishableKey, { global: { headers: { Authorization: authorization } } })
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return new Response('Sessao invalida.', { status: 401, headers: corsHeaders })

  const admin = createClient(supabaseUrl, serviceRoleKey)
  const { data: channel } = await admin
    .from('channels')
    .select('id, server_id')
    .eq('id', channelId)
    .eq('kind', 'voice')
    .maybeSingle()
  if (!channel) return new Response('Canal de voz nao encontrado.', { status: 404, headers: corsHeaders })

  const { data: membership } = await admin
    .from('server_members')
    .select('user_id, role')
    .eq('server_id', channel.server_id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!membership) return new Response('Sem permissao para este canal.', { status: 403, headers: corsHeaders })

  if (membership.role !== 'owner') {
    const { data: permissions } = await admin
      .from('channel_permissions')
      .select('role, can_speak')
      .eq('channel_id', channel.id)
    if ((permissions ?? []).length > 0 && !permissions?.some((permission) => permission.role === membership.role && permission.can_speak)) {
      return new Response('Sem permissao para falar neste canal.', { status: 403, headers: corsHeaders })
    }
  }

  const { data: profile } = await admin.from('profiles').select('nickname').eq('id', user.id).maybeSingle()
  const accessToken = new AccessToken(Deno.env.get('LIVEKIT_API_KEY')!, Deno.env.get('LIVEKIT_API_SECRET')!, {
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

  return Response.json({ serverUrl: Deno.env.get('LIVEKIT_URL'), token: await accessToken.toJwt() }, { headers: corsHeaders })
})
