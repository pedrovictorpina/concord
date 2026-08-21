import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ServerSummary } from '@concord/contracts'
import { Modal } from '../../../components/ui/Modal'
import { CopyIcon } from '../WorkspaceIcons'
import type { WorkspaceIdentity } from '../workspace-types'

type Result = { ok: boolean; message: string }

const roleLabel: Record<ServerSummary['role'], string> = {
  owner: 'Proprietário',
  moderator: 'Moderador',
  member: 'Membro',
}

type ServerSettingsProps = {
  identity: WorkspaceIdentity
  inviteLinks: Array<{ id: string; code: string; uses_count: number }>
  onCreateInviteLink: () => Promise<{ ok: boolean; message: string; url: string }>
  onDeleteServer: () => Promise<Result>
  onLeaveServer: () => Promise<Result>
  onMarkServerRead: () => Promise<Result>
  onRevokeInviteLink: (linkId: string) => Promise<Result>
  onSaveServer: (name: string, description: string) => Promise<Result>
  onSaveServerNickname: (nickname: string) => Promise<Result>
  server: ServerSummary | null
}

export function ServerSettings({ identity, inviteLinks, onCreateInviteLink, onDeleteServer, onLeaveServer, onMarkServerRead, onRevokeInviteLink, onSaveServer, onSaveServerNickname, server }: ServerSettingsProps) {
  const [name, setName] = useState(server?.name ?? '')
  const [description, setDescription] = useState(server?.description ?? '')
  const [nickname, setNickname] = useState('')
  const [createdInviteUrl, setCreatedInviteUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const owner = server?.role === 'owner'

  if (!server) return <section className="server-settings"><h1>Servidor atual</h1><p>Selecione um servidor em "Meus servidores" para administrá-lo.</p></section>

  const run = async (action: () => Promise<Result>) => {
    setSubmitting(true)
    setFeedback('')
    const result = await action()
    setSubmitting(false)
    setFeedback(result.message)
    return result
  }

  const submitServer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void run(() => onSaveServer(name, description))
  }

  const submitNickname = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void run(() => onSaveServerNickname(nickname))
  }

  const createLink = async () => {
    const result = await run(async () => {
      const outcome = await onCreateInviteLink()
      if (outcome.ok) setCreatedInviteUrl(outcome.url)
      return outcome
    })
    return result
  }

  const copyLink = async () => {
    if (!createdInviteUrl) return
    try {
      await navigator.clipboard.writeText(createdInviteUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch (caught) {
      console.error('[servidor] falha ao copiar o link de convite', caught)
      setFeedback('Copie o link manualmente: o navegador bloqueou a área de transferência.')
    }
  }

  return (
    <section className="server-settings">
      <h1>{server.name}</h1>
      <p>Configurações do servidor. Seu cargo: {roleLabel[server.role]}.</p>

      <form className="settings-card" onSubmit={submitServer}>
        <h2>Informações do servidor</h2>
        <p className="settings-card-hint">{owner ? 'Você é o proprietário deste espaço.' : 'Apenas o proprietário pode editar estes dados.'}</p>
        <label className="settings-field">
          <span>Nome</span>
          <input required minLength={3} maxLength={48} disabled={!owner} value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="settings-field">
          <span>Descrição</span>
          <textarea maxLength={160} disabled={!owner} value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        {owner ? <button className="settings-button" disabled={submitting} type="submit">Salvar servidor</button> : null}
      </form>

      <form className="settings-card" onSubmit={submitNickname}>
        <h2>Seu perfil neste servidor</h2>
        <label className="settings-field">
          <span>Apelido</span>
          <input placeholder={identity.nickname} value={nickname} onChange={(event) => setNickname(event.target.value)} />
        </label>
        <button className="settings-button subdued" disabled={submitting} type="submit">Salvar apelido</button>
      </form>

      {owner ? (
        <div className="settings-card">
          <h2>Links de convite</h2>
          <div className="invite-link-list">
            {inviteLinks.map((link) => (
              <div className="invite-link-row" key={link.id}>
                <span>{link.code}<small>{link.uses_count} usos</small></span>
                <button className="settings-button subdued danger" type="button" onClick={() => void run(() => onRevokeInviteLink(link.id))}>Revogar</button>
              </div>
            ))}
            {inviteLinks.length === 0 ? <p className="settings-empty-hint">Nenhum link de convite ativo.</p> : null}
          </div>
          {createdInviteUrl ? (
            <div className="invite-link-created">
              <span>Link criado</span>
              <input aria-label="Link de convite" readOnly value={createdInviteUrl} onFocus={(event) => event.currentTarget.select()} />
              <button className="settings-button subdued" type="button" onClick={() => void copyLink()}><CopyIcon />{copied ? 'Copiado' : 'Copiar'}</button>
            </div>
          ) : null}
          <button className="settings-button subdued" disabled={submitting} type="button" onClick={() => void createLink()}>Gerar novo link</button>
        </div>
      ) : null}

      <button className="settings-link-button" type="button" onClick={() => void run(onMarkServerRead)}>Marcar servidor como lido</button>

      <div className="settings-danger-zone">
        <h2>Zona de perigo</h2>
        {owner ? (
          <button className="settings-button danger" type="button" onClick={() => setConfirmDelete(true)}>Excluir servidor</button>
        ) : (
          <button className="settings-button danger" type="button" onClick={() => void run(onLeaveServer)}>Sair do servidor</button>
        )}
      </div>

      {feedback ? <p className="settings-feedback" role="status">{feedback}</p> : null}

      {confirmDelete ? (
        <Modal
          closeLabel="Fechar confirmação"
          description="Esta ação não pode ser desfeita."
          onClose={() => setConfirmDelete(false)}
          title={`Excluir ${server.name}?`}
        >
          <div className="dialog-actions">
            <button type="button" onClick={() => setConfirmDelete(false)}>Cancelar</button>
            <button className="danger" type="button" onClick={() => { setConfirmDelete(false); void run(onDeleteServer) }}>Excluir servidor</button>
          </div>
        </Modal>
      ) : null}
    </section>
  )
}
