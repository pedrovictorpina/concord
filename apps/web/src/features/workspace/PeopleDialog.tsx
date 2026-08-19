import { useState } from 'react'
import type { FormEvent } from 'react'
import type { FriendRequestSummary, PersonSummary, ServerInviteSummary, ServerSummary } from '@concord/contracts'

type ActionResult = { ok: boolean; message: string }

type PeopleDialogProps = {
  friendRequests: FriendRequestSummary[]
  friends: PersonSummary[]
  onAcceptFriendRequest: (requestId: string) => Promise<ActionResult>
  onAcceptServerInvite: (invite: ServerInviteSummary) => Promise<ActionResult>
  onClose: () => void
  onSendFriendRequest: (username: string) => Promise<ActionResult>
  onSendServerInvite: (serverId: string, username: string) => Promise<ActionResult>
  server: ServerSummary | null
  serverInvites: ServerInviteSummary[]
}

export function PeopleDialog({ friendRequests, friends, onAcceptFriendRequest, onAcceptServerInvite, onClose, onSendFriendRequest, onSendServerInvite, server, serverInvites }: PeopleDialogProps) {
  const [friendUsername, setFriendUsername] = useState('')
  const [inviteUsername, setInviteUsername] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const run = async (action: () => Promise<ActionResult>) => {
    setSubmitting(true)
    setFeedback('')
    const result = await action()
    setSubmitting(false)
    setFeedback(result.message)
  }

  const sendFriend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void run(async () => {
      const result = await onSendFriendRequest(friendUsername)
      if (result.ok) setFriendUsername('')
      return result
    })
  }

  const sendInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!server) return
    void run(async () => {
      const result = await onSendServerInvite(server.id, inviteUsername)
      if (result.ok) setInviteUsername('')
      return result
    })
  }

  return (
    <div className="server-dialog-backdrop" role="presentation">
      <section className="server-dialog people-dialog" role="dialog" aria-modal="true" aria-labelledby="people-dialog-title">
        <button className="dialog-close" type="button" aria-label="Fechar pessoas e convites" onClick={onClose}>×</button>
        <span className="eyebrow">CONEXOES PRIVADAS</span>
        <h2 id="people-dialog-title">Pessoas<br />em sintonia.</h2>

        <form className="people-form" onSubmit={sendFriend}>
          <label><span>Adicionar amigo por identificador</span><input required value={friendUsername} onChange={(event) => setFriendUsername(event.target.value)} placeholder="@nome" /></label>
          <button className="dialog-submit" type="submit" disabled={submitting}>ENVIAR PEDIDO →</button>
        </form>

        {server?.role === 'owner' ? <form className="people-form" onSubmit={sendInvite}>
          <label><span>Convidar para {server.name}</span><input required value={inviteUsername} onChange={(event) => setInviteUsername(event.target.value)} placeholder="@nome" /></label>
          <button className="dialog-submit subdued" type="submit" disabled={submitting}>ENVIAR CONVITE →</button>
        </form> : null}

        <section className="people-list" aria-label="Pedidos recebidos">
          <p>PEDIDOS RECEBIDOS</p>
          {friendRequests.filter((request) => request.direction === 'received').map((request) => <div className="person-row" key={request.id}><span className="avatar avatar-amber">{request.person.nickname.slice(0, 2).toUpperCase()}</span><strong>{request.person.nickname}<small>@{request.person.username}</small></strong><button type="button" disabled={submitting} onClick={() => void run(() => onAcceptFriendRequest(request.id))}>ACEITAR</button></div>)}
          {!friendRequests.some((request) => request.direction === 'received') ? <small>Nenhum pedido pendente.</small> : null}
        </section>

        <section className="people-list" aria-label="Convites recebidos">
          <p>CONVITES DE SERVIDOR</p>
          {serverInvites.map((invite) => <div className="person-row" key={invite.id}><span className="avatar avatar-green">{invite.serverName.slice(0, 2).toUpperCase()}</span><strong>{invite.serverName}<small>por @{invite.sender.username}</small></strong><button type="button" disabled={submitting} onClick={() => void run(() => onAcceptServerInvite(invite))}>ENTRAR</button></div>)}
          {!serverInvites.length ? <small>Nenhum convite pendente.</small> : null}
        </section>

        <section className="people-list" aria-label="Amigos">
          <p>AMIGOS</p>
          {friends.map((friend) => <div className="person-row" key={friend.id}><span className="avatar avatar-green">{friend.nickname.slice(0, 2).toUpperCase()}</span><strong>{friend.nickname}<small>@{friend.username}</small></strong><small>ONLINE</small></div>)}
          {!friends.length ? <small>Nenhuma amizade ativa.</small> : null}
        </section>

        {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
      </section>
    </div>
  )
}
