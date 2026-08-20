import type { ReactNode } from 'react'
import { ContextMenu } from 'radix-ui'
import type { ServerMemberRole } from '@concord/contracts'

export type MemberContextTarget = {
  userId: string
  nickname: string
  username: string
  role?: ServerMemberRole
}

type MemberContextMenuProps = {
  canModerate: boolean
  canSetRole: boolean
  children: ReactNode
  inVoice: boolean
  isSelf: boolean
  onMessage?: () => void
  onModerate?: (action: 'ban' | 'timeout' | 'microphone' | 'audio') => unknown
  onRemove?: () => void
  onSetRole?: (role: ServerMemberRole) => unknown
  onSetVolume?: (volume: number) => void
  target: MemberContextTarget
  volume?: number
}

export function MemberContextMenu({ canModerate, canSetRole, children, inVoice, isSelf, onMessage, onModerate, onRemove, onSetRole, onSetVolume, target, volume = 1 }: MemberContextMenuProps) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="server-menu-content member-context" aria-label={`Opções de ${target.nickname}`}>
          <ContextMenu.Label>{target.nickname}</ContextMenu.Label>
          {onMessage ? <ContextMenu.Item onSelect={onMessage}>Mensagem</ContextMenu.Item> : null}
          <ContextMenu.Item onSelect={() => void navigator.clipboard?.writeText(`@${target.username}`)}>Copiar identificador</ContextMenu.Item>
          {inVoice && !isSelf && onSetVolume ? (
            <div className="member-context-volume">
              <span>Volume da pessoa · {Math.round(volume * 100)}%</span>
              <input
                aria-label={`Volume de ${target.nickname}`}
                max={1}
                min={0}
                step={0.02}
                type="range"
                value={volume}
                onChange={(event) => onSetVolume(Number(event.target.value))}
                onClick={(event) => event.stopPropagation()}
              />
              <button type="button" onClick={() => onSetVolume(volume === 0 ? 1 : 0)}>{volume === 0 ? 'REATIVAR' : 'SILENCIAR PARA MIM'}</button>
            </div>
          ) : null}
          {canSetRole && onSetRole && target.role ? (
            <>
              <ContextMenu.Separator />
              <ContextMenu.Label>Cargos</ContextMenu.Label>
              {target.role === 'member'
                ? <ContextMenu.Item onSelect={() => void onSetRole('moderator')}>Promover a moderador</ContextMenu.Item>
                : <ContextMenu.Item onSelect={() => void onSetRole('member')}>Rebaixar a membro</ContextMenu.Item>}
            </>
          ) : null}
          {canModerate && onModerate ? (
            <>
              <ContextMenu.Separator />
              <ContextMenu.Item onSelect={() => void onModerate('microphone')}>Silenciar voz no servidor</ContextMenu.Item>
              <ContextMenu.Item onSelect={() => void onModerate('audio')}>Desativar áudio no servidor</ContextMenu.Item>
              <ContextMenu.Item onSelect={() => void onModerate('timeout')}>Timeout de 10 minutos</ContextMenu.Item>
              {onRemove ? <ContextMenu.Item className="danger" onSelect={onRemove}>Remover do servidor</ContextMenu.Item> : null}
              <ContextMenu.Item className="danger" onSelect={() => void onModerate('ban')}>Banir do servidor</ContextMenu.Item>
            </>
          ) : null}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}
