import { useEffect, useState } from 'react'
import type { DirectMessageSummary, PersonSummary } from '@concord/contracts'
import { supabase } from '../../lib/supabase'
import type { WorkspaceIdentity } from './workspace-types'

type DirectMessagePanelProps = { demoMode: boolean; friend: PersonSummary; identity: WorkspaceIdentity; onBack: () => void; userId?: string }
type DirectMessageRow = { id: string; author_id: string; body: string; created_at: string; profiles: Array<{ nickname: string }> | null }
const formatTime = (value: string) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))

export function DirectMessagePanel({ demoMode, friend, identity, onBack, userId }: DirectMessagePanelProps) {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<DirectMessageSummary[]>([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (demoMode) { setConversationId(`demo-${friend.id}`); setMessages([]); return }
    const client = supabase
    if (!client) return
    void client.rpc('get_or_create_direct_conversation', { peer_id: friend.id }).then(({ data, error: requestError }) => {
      if (requestError || !data) { setError('Não foi possível abrir esta conversa.'); return }
      setConversationId(data)
    })
  }, [demoMode, friend.id])

  useEffect(() => {
    const client = supabase
    if (!conversationId || demoMode || !client) return
    const load = () => client.from('direct_messages').select('id, author_id, body, created_at, profiles!direct_messages_author_id_fkey(nickname)').eq('conversation_id', conversationId).order('created_at').then(({ data }) => setMessages(((data ?? []) as unknown as DirectMessageRow[]).map((message) => ({ id: message.id, authorId: message.author_id, authorNickname: message.profiles?.[0]?.nickname ?? 'Membro', body: message.body, createdAt: message.created_at }))))
    void load()
    const channel = client.channel(`direct:${conversationId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'direct_messages', filter: `conversation_id=eq.${conversationId}` }, () => { void load() }).subscribe()
    return () => { void client.removeChannel(channel) }
  }, [conversationId, demoMode])

  const send = async () => {
    const body = draft.trim()
    if (!body || !conversationId) return
    if (demoMode) setMessages((current) => [...current, { id: String(Date.now()), authorId: 'demo-user', authorNickname: identity.nickname, body, createdAt: new Date().toISOString() }])
    else if (supabase && userId) {
      const { error: requestError } = await supabase.from('direct_messages').insert({ conversation_id: conversationId, author_id: userId, body })
      if (requestError) { setError('Não foi possível enviar a mensagem.'); return }
    }
    setDraft('')
  }

  return <section className="direct-message"><header><button type="button" aria-label="Voltar para mensagens" onClick={onBack}>←</button><span className="avatar avatar-green">{friend.nickname.slice(0, 2).toUpperCase()}</span><div><strong>{friend.nickname}</strong><small>@{friend.username}</small></div></header><div className="direct-message-list">{!messages.length ? <div className="direct-empty"><span>◌</span><strong>Conversa com {friend.nickname}</strong><p>Envie o primeiro sinal privado.</p></div> : messages.map((message) => <article className={message.authorId === userId || demoMode && message.authorId === 'demo-user' ? 'direct-bubble own' : 'direct-bubble'} key={message.id}><strong>{message.authorNickname}</strong><p>{message.body}</p><small>{formatTime(message.createdAt)}</small></article>)}</div>{error ? <p className="composer-feedback" role="status">{error}</p> : null}<form className="direct-composer" onSubmit={(event) => { event.preventDefault(); void send() }}><button type="button" aria-label="Adicionar anexo">+</button><input aria-label="Mensagem privada" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Conversar com @${friend.username}`} /><button type="submit" disabled={!draft.trim()}>↑</button></form></section>
}
