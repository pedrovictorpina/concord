import { useState } from 'react'
import type { FormEvent } from 'react'
import { Avatar } from '../../../components/ui/Avatar'
import type { WorkspaceIdentity } from '../workspace-types'

type Result = { ok: boolean; message: string }

type AccountSettingsProps = {
  identity: WorkspaceIdentity
  onSaveProfile?: (profile: Pick<WorkspaceIdentity, 'nickname' | 'username' | 'avatarUrl'>) => Promise<Result>
  onUploadAvatar?: (file: File) => Promise<{ ok: boolean; message: string; url?: string }>
}

export function AccountSettings({ identity, onSaveProfile, onUploadAvatar }: AccountSettingsProps) {
  const [nickname, setNickname] = useState(identity.nickname)
  const [username, setUsername] = useState(identity.username)
  const [avatarUrl, setAvatarUrl] = useState(identity.avatarUrl ?? '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [editing, setEditing] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSaveProfile) return
    setSubmitting(true)
    setFeedback('')
    void (async () => {
      let nextAvatarUrl = avatarUrl
      if (avatarFile && onUploadAvatar) {
        const upload = await onUploadAvatar(avatarFile)
        if (!upload.ok || !upload.url) {
          setSubmitting(false)
          setFeedback(upload.message)
          return
        }
        nextAvatarUrl = upload.url
        setAvatarUrl(upload.url)
      }
      const result = await onSaveProfile({ nickname, username, avatarUrl: nextAvatarUrl || null })
      setSubmitting(false)
      setFeedback(result.message)
      if (result.ok) setEditing(false)
    })()
  }

  return (
    <section className="account-settings">
      <h1>Minha conta</h1>
      <p>Gerencie como você aparece no Concord.</p>

      <form className="account-card" onSubmit={submit}>
        <div className="account-card-identity">
          <Avatar alt="Foto de perfil" initials={identity.initials} url={avatarUrl || undefined} />
          {editing ? (
            <div className="account-avatar-edit">
              <label className="settings-button subdued">
                Alterar foto
                <input accept="image/jpeg,image/png,image/webp" hidden type="file" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} />
              </label>
              <label className="account-avatar-url">
                <span>Ou URL da foto</span>
                <input placeholder="https://..." type="url" value={avatarUrl} onChange={(event) => { setAvatarUrl(event.target.value); setAvatarFile(null) }} />
              </label>
            </div>
          ) : null}
        </div>

        <div className="account-card-fields">
          <label className="account-field">
            <span className="account-field-label">Nome de exibição</span>
            {editing ? <input required minLength={3} maxLength={32} value={nickname} onChange={(event) => setNickname(event.target.value)} /> : <span className="account-field-value">{identity.nickname}</span>}
          </label>
          <label className="account-field">
            <span className="account-field-label">Nome de usuário</span>
            {editing ? <input required minLength={3} maxLength={32} value={username} onChange={(event) => setUsername(event.target.value)} /> : <span className="account-field-value">@{identity.username}</span>}
          </label>
        </div>

        <div className="account-card-actions">
          {editing ? (
            <>
              <button className="settings-button" disabled={submitting || !onSaveProfile} type="submit">{submitting ? 'Salvando...' : 'Salvar alterações'}</button>
              <button className="settings-button subdued" type="button" onClick={() => { setEditing(false); setNickname(identity.nickname); setUsername(identity.username); setAvatarUrl(identity.avatarUrl ?? ''); setAvatarFile(null) }}>Cancelar</button>
            </>
          ) : (
            <button className="settings-button subdued" type="button" onClick={() => setEditing(true)}>Editar</button>
          )}
        </div>
      </form>
      {feedback ? <p className="settings-feedback" role="status">{feedback}</p> : null}
    </section>
  )
}
