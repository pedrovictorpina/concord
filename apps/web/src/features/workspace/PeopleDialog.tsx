import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { FriendRequestSummary, PersonSummary, ServerInviteSummary, ServerSummary } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { Modal } from '../../components/ui/Modal'

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
  const addFriendRef = useRef<HTMLInputElement>(null)
  const [friendUsername, setFriendUsername] = useState('')
  const [inviteUsername, setInviteUsername] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

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

  if (showAddForm) {
    return (
      <Modal
        className="people-dialog mobile-add-form"
        closeLabel="Voltar para adicionar amigos"
        hideClose
        initialFocusRef={addFriendRef}
        onClose={onClose}
        title="Adicionar via nome de usuário"
      >
        <button className="mobile-back" type="button" aria-label="Voltar para adicionar amigos" onClick={() => setShowAddForm(false)}>←</button>
        <form className="people-form" onSubmit={sendFriend}>
          <label><span>Quem você quer adicionar como amigo?</span><input ref={addFriendRef} required value={friendUsername} onChange={(event) => setFriendUsername(event.target.value)} placeholder="Insira um nome de usuário" /></label>
          <button className="dialog-submit" type="submit" disabled={submitting || !friendUsername.trim()}>ENVIAR PEDIDO DE AMIZADE</button>
        </form>
        {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
      </Modal>
    )
  }

  return (
    <Modal
      className="people-dialog"
      closeLabel="Fechar pessoas e convites"
      eyebrow="CONEXOES PRIVADAS"
      onClose={onClose}
      title={<>Pessoas{' '}<br />em sintonia.</>}
    >

        <section className="mobile-add-friend" aria-label="Adicionar amigos">
          <header><button type="button" aria-label="Fechar adicionar amigos" onClick={onClose}>←</button><h2>Adicionar amigos</h2></header>
          <button className="mobile-add-option" type="button" onClick={() => setShowAddForm(true)}><span>@</span><strong>Adicionar via nome de usuário</strong><i>›</i></button>
          <div className="mobile-friends-signal" aria-hidden="true"><span>◌</span><span>+</span><span>◖</span></div>
          <h3>Encontre sua turma</h3>
          <p>Envie um pedido usando o identificador do seu amigo. Quando ele aceitar, a conexão aparece aqui.</p>
        </section>

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
          {friendRequests.filter((request) => request.direction === 'received').map((request) => <div className="person-row" key={request.id}><Avatar initials={request.person.nickname.slice(0, 2).toUpperCase()} tone="amber" /><strong>{request.person.nickname}<small>@{request.person.username}</small></strong><button type="button" disabled={submitting} onClick={() => void run(() => onAcceptFriendRequest(request.id))}>ACEITAR</button></div>)}
          {!friendRequests.some((request) => request.direction === 'received') ? <small>Nenhum pedido pendente.</small> : null}
        </section>

        <section className="people-list" aria-label="Convites recebidos">
          <p>CONVITES DE SERVIDOR</p>
          {serverInvites.map((invite) => <div className="person-row" key={invite.id}><Avatar initials={invite.serverName.slice(0, 2).toUpperCase()} /><strong>{invite.serverName}<small>por @{invite.sender.username}</small></strong><button type="button" disabled={submitting} onClick={() => void run(() => onAcceptServerInvite(invite))}>ENTRAR</button></div>)}
          {!serverInvites.length ? <small>Nenhum convite pendente.</small> : null}
        </section>

        <section className="people-list" aria-label="Amigos">
          <p>AMIGOS</p>
          {friends.map((friend) => <div className="person-row" key={friend.id}><Avatar initials={friend.nickname.slice(0, 2).toUpperCase()} /><strong>{friend.nickname}<small>@{friend.username}</small></strong><small>ONLINE</small></div>)}
          {!friends.length ? <small>Nenhuma amizade ativa.</small> : null}
        </section>

      {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
    </Modal>
  )
}
