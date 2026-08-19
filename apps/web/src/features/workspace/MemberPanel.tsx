import { useState } from 'react'
import { DropdownMenu } from 'radix-ui'
import type { PersonSummary, ServerMemberRole, ServerSummary, VoiceParticipant } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { Modal } from '../../components/ui/Modal'
import { initialsFrom } from './voice-participants'

type ServerMember = PersonSummary & { role: ServerMemberRole }

type ActionResult = { ok: boolean; message: string }

type MemberPanelProps = {
  members: ServerMember[]
  onModerateMember: (memberId: string, action: 'ban' | 'timeout' | 'microphone' | 'audio') => Promise<ActionResult>
  onRemoveMember: (memberId: string) => Promise<ActionResult>
  onSetMemberRole: (memberId: string, role: ServerMemberRole) => Promise<ActionResult>
  onTransferOwnership: (memberId: string) => Promise<ActionResult>
  server: ServerSummary
  userId?: string
  voiceParticipantsByChannel: Record<string, VoiceParticipant[]>
}

type PendingAction = {
  member: ServerMember
  kind: 'ban' | 'remove' | 'transfer'
}

const groups: ReadonlyArray<readonly [ServerMemberRole, string]> = [
  ['owner', 'PROPRIETARIO'],
  ['moderator', 'MODERADORES'],
  ['member', 'MEMBROS'],
]

const roleLabels: Record<ServerMemberRole, string> = {
  owner: 'proprietário',
  moderator: 'moderador',
  member: 'membro',
}

const confirmCopy: Record<PendingAction['kind'], { title: string; description: string; action: string }> = {
  ban: { title: 'Banir do servidor', description: 'A pessoa sai do servidor e não consegue voltar nem por convite ou link.', action: 'BANIR' },
  remove: { title: 'Remover do servidor', description: 'A pessoa sai do servidor, mas pode voltar com um novo convite.', action: 'REMOVER' },
  transfer: { title: 'Transferir o servidor', description: 'A outra pessoa passa a ser a proprietária e você continua como moderador.', action: 'TRANSFERIR' },
}

export function MemberPanel({ members, onModerateMember, onRemoveMember, onSetMemberRole, onTransferOwnership, server, userId, voiceParticipantsByChannel }: MemberPanelProps) {
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [feedback, setFeedback] = useState('')
  const inVoice = new Set(Object.values(voiceParticipantsByChannel).flat().map((participant) => participant.userId))

  const isOwner = server.role === 'owner'
  const canModerate = (member: ServerMember) => member.id !== userId && (
    (isOwner && member.role !== 'owner') || (server.role === 'moderator' && member.role === 'member')
  )

  const run = async (result: Promise<ActionResult>) => {
    const outcome = await result
    setFeedback(outcome.message)
    window.setTimeout(() => setFeedback(''), 4000)
  }

  const confirmPending = async () => {
    if (!pending) return
    const { kind, member } = pending
    setPending(null)
    if (kind === 'ban') await run(onModerateMember(member.id, 'ban'))
    if (kind === 'remove') await run(onRemoveMember(member.id))
    if (kind === 'transfer') await run(onTransferOwnership(member.id))
  }

  return (
    <aside className="member-panel" aria-label="Membros do servidor">
      <header><strong>Membros</strong><small>{members.length} NO SERVIDOR</small></header>
      {feedback ? <p className="member-feedback" role="status">{feedback}</p> : null}
      <div>
        {members.length === 0 ? <p className="member-panel-empty">Carregando membros de {server.name}…</p> : null}
        {groups.map(([role, label]) => {
          const group = members.filter((member) => member.role === role)
          if (group.length === 0) return null
          return (
            <section className="member-group" key={role}>
              <p>{label} — {group.length}</p>
              {group.map((member) => (
                <div className={inVoice.has(member.id) ? 'member-row in-voice' : 'member-row'} key={member.id}>
                  <Avatar initials={initialsFrom(member.nickname)} tone={member.role === 'member' ? 'amber' : 'green'} url={member.avatarUrl} />
                  <div>
                    <strong>{member.nickname}{member.id === userId ? ' (você)' : ''}</strong>
                    <small>@{member.username} · {roleLabels[member.role]}</small>
                  </div>
                  {inVoice.has(member.id) ? <i aria-label="Em voz">◖</i> : null}
                  {canModerate(member) ? (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger aria-label={`Administrar ${member.nickname}`} className="member-menu-trigger">⋮</DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content align="end" className="server-menu-content" sideOffset={6}>
                          {isOwner ? (
                            member.role === 'member'
                              ? <DropdownMenu.Item onSelect={() => void run(onSetMemberRole(member.id, 'moderator'))}>Promover a moderador</DropdownMenu.Item>
                              : <DropdownMenu.Item onSelect={() => void run(onSetMemberRole(member.id, 'member'))}>Rebaixar a membro</DropdownMenu.Item>
                          ) : null}
                          {isOwner ? <DropdownMenu.Item onSelect={() => setPending({ kind: 'transfer', member })}>Transferir o servidor</DropdownMenu.Item> : null}
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item onSelect={() => void run(onModerateMember(member.id, 'microphone'))}>Cortar microfone</DropdownMenu.Item>
                          <DropdownMenu.Item onSelect={() => void run(onModerateMember(member.id, 'audio'))}>Cortar áudio</DropdownMenu.Item>
                          <DropdownMenu.Item onSelect={() => void run(onModerateMember(member.id, 'timeout'))}>Timeout de 10 minutos</DropdownMenu.Item>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item className="danger" onSelect={() => setPending({ kind: 'remove', member })}>Remover do servidor</DropdownMenu.Item>
                          <DropdownMenu.Item className="danger" onSelect={() => setPending({ kind: 'ban', member })}>Banir do servidor</DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  ) : null}
                </div>
              ))}
            </section>
          )
        })}
      </div>
      {pending ? (
        <Modal
          closeLabel="Fechar confirmação"
          description={confirmCopy[pending.kind].description}
          eyebrow={pending.member.nickname}
          onClose={() => setPending(null)}
          title={confirmCopy[pending.kind].title}
        >
          <div className="dialog-actions">
            <button type="button" onClick={() => setPending(null)}>CANCELAR</button>
            <button className="danger" type="button" onClick={() => void confirmPending()}>{confirmCopy[pending.kind].action}</button>
          </div>
        </Modal>
      ) : null}
    </aside>
  )
}
