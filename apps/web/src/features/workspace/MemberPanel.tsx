import type { PersonSummary, ServerMemberRole, ServerSummary, VoiceParticipant } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { initialsFrom } from './voice-participants'

type ServerMember = PersonSummary & { role: ServerMemberRole }

type MemberPanelProps = {
  members: ServerMember[]
  server: ServerSummary
  userId?: string
  voiceParticipantsByChannel: Record<string, VoiceParticipant[]>
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

export function MemberPanel({ members, server, userId, voiceParticipantsByChannel }: MemberPanelProps) {
  const inVoice = new Set(Object.values(voiceParticipantsByChannel).flat().map((participant) => participant.userId))

  return (
    <aside className="member-panel" aria-label="Membros do servidor">
      <header><strong>Membros</strong><small>{members.length} NO SERVIDOR</small></header>
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
                  <Avatar initials={initialsFrom(member.nickname)} tone={member.role === 'member' ? 'amber' : 'green'} />
                  <div>
                    <strong>{member.nickname}{member.id === userId ? ' (você)' : ''}</strong>
                    <small>@{member.username} · {roleLabels[member.role]}</small>
                  </div>
                  {inVoice.has(member.id) ? <i aria-label="Em voz">◖</i> : null}
                </div>
              ))}
            </section>
          )
        })}
      </div>
    </aside>
  )
}
