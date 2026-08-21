import { useState } from 'react'
import type { ChannelPermission, ChannelSummary, PersonSummary, ServerMemberRole } from '@concord/contracts'
import { Choice } from '../../../components/ui/Choice'
import { Modal } from '../../../components/ui/Modal'
import { Toggle } from '../../../components/ui/Toggle'
import { HashIcon, SpeakerIcon } from '../WorkspaceIcons'

type Result = { ok: boolean; message: string }

type PermissionSettingsProps = {
  canModerate: boolean
  channelPermissions: ChannelPermission[]
  channels: ChannelSummary[]
  members: Array<PersonSummary & { role: ServerMemberRole }>
  onModerateMember: (memberId: string, action: 'ban' | 'timeout' | 'microphone' | 'audio') => Promise<Result>
  onSaveChannelPermissions: (channelId: string, role: 'moderator' | 'member', permissions: Omit<ChannelPermission, 'channelId' | 'role'>) => Promise<Result>
  onSetMemberRole: (memberId: string, role: ServerMemberRole) => Promise<Result>
  owner: boolean
  userId?: string
}

const roleOptions = [
  { value: 'owner' as const, label: 'Proprietário' },
  { value: 'moderator' as const, label: 'Moderador' },
  { value: 'member' as const, label: 'Membro' },
]

export function PermissionSettings({ canModerate, channelPermissions, channels, members, onModerateMember, onSaveChannelPermissions, onSetMemberRole, owner, userId }: PermissionSettingsProps) {
  const [feedback, setFeedback] = useState('')
  const [confirmBan, setConfirmBan] = useState<{ id: string; nickname: string } | null>(null)

  const permission = (channelId: string, role: 'moderator' | 'member') => channelPermissions.find((item) => item.channelId === channelId && item.role === role) ?? { channelId, role, canRead: true, canWrite: true, canSpeak: true }

  const run = async (action: () => Promise<Result>) => {
    const result = await action()
    setFeedback(result.message)
    return result
  }

  return (
    <section className="permission-settings">
      <h1>Permissões</h1>
      <p>Proprietário administra tudo. Moderador administra canais e membros comuns.</p>

      <div className="settings-card">
        <h2>Cargos</h2>
        <div className="permission-card">
          <strong>Proprietário</strong>
          <span>Controle completo do servidor.</span>
        </div>
        <div className="permission-card">
          <strong>Moderador</strong>
          <span>Pode administrar canais e membros permitidos.</span>
        </div>
        <div className="permission-card">
          <strong>Membro</strong>
          <span>Pode utilizar os canais liberados.</span>
        </div>
      </div>

      <div className="settings-card">
        <h2>Permissões por canal</h2>
        {channels.map((channel) => (
          <div className="channel-permission-row" key={channel.id}>
            <strong>{channel.kind === 'text' ? <HashIcon /> : <SpeakerIcon />} {channel.name}</strong>
            {(['moderator', 'member'] as const).map((role) => {
              const value = permission(channel.id, role)
              return (
                <div key={role}>
                  <small>{role === 'moderator' ? 'moderador' : 'membro'}</small>
                  <Toggle checked={value.canRead} className="permission-toggle" label="ver canal" onChange={(checked) => void run(() => onSaveChannelPermissions(channel.id, role, { ...value, canRead: checked }))} />
                  {channel.kind === 'text' ? (
                    <Toggle checked={value.canWrite} className="permission-toggle" label="enviar mensagens" onChange={(checked) => void run(() => onSaveChannelPermissions(channel.id, role, { ...value, canWrite: checked }))} />
                  ) : (
                    <Toggle checked={value.canSpeak} className="permission-toggle" label="falar" onChange={(checked) => void run(() => onSaveChannelPermissions(channel.id, role, { ...value, canSpeak: checked }))} />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {owner ? (
        <div className="settings-card">
          <h2>Cargos dos membros</h2>
          {members.filter((member) => member.id !== userId).map((member) => (
            <div className="role-row" key={member.id}>
              <span>{member.nickname}<small>@{member.username}</small></span>
              <Choice disabled={member.role === 'owner'} hideLabel label={`Cargo de ${member.nickname}`} onChange={(role) => void run(() => onSetMemberRole(member.id, role))} options={roleOptions} value={member.role} />
            </div>
          ))}
        </div>
      ) : null}

      {canModerate ? (
        <div className="settings-card">
          <h2>Moderação</h2>
          {members.filter((member) => member.id !== userId && member.role !== 'owner' && (owner || member.role === 'member')).map((member) => (
            <div className="member-moderation-row" key={member.id}>
              <span><strong>{member.nickname}</strong><small>@{member.username}</small></span>
              <button type="button" onClick={() => void run(() => onModerateMember(member.id, 'microphone'))}>Microfone</button>
              <button type="button" onClick={() => void run(() => onModerateMember(member.id, 'audio'))}>Áudio</button>
              <button type="button" onClick={() => void run(() => onModerateMember(member.id, 'timeout'))}>Timeout</button>
              <button className="danger" type="button" onClick={() => setConfirmBan({ id: member.id, nickname: member.nickname })}>Banir</button>
            </div>
          ))}
        </div>
      ) : null}

      {feedback ? <p className="settings-feedback" role="status">{feedback}</p> : null}

      {confirmBan ? (
        <Modal
          closeLabel="Fechar confirmação"
          description="A pessoa não consegue voltar nem por convite ou link."
          onClose={() => setConfirmBan(null)}
          title={`Banir ${confirmBan.nickname}?`}
        >
          <div className="dialog-actions">
            <button type="button" onClick={() => setConfirmBan(null)}>Cancelar</button>
            <button className="danger" type="button" onClick={() => { const target = confirmBan; setConfirmBan(null); if (target) void run(() => onModerateMember(target.id, 'ban')) }}>Banir</button>
          </div>
        </Modal>
      ) : null}
    </section>
  )
}
