import type { ChannelSummary } from '@concord/contracts'

export type LocalMessage = {
  id: number
  author: string
  time: string
  body: string
  system?: boolean
}

export const channels: ChannelSummary[] = [
  { id: 'geral', name: 'geral', kind: 'text' },
  { id: 'ideias', name: 'ideias-do-produto', kind: 'text' },
  { id: 'madrugada', name: 'sala-da-madrugada', kind: 'voice' },
]

export const initialMessages: LocalMessage[] = [
  {
    id: 1,
    author: 'Concord Relay',
    time: 'agora',
    body: 'Fundacao sincronizada. O primeiro sinal da rede esta no ar.',
    system: true,
  },
  {
    id: 2,
    author: 'Produto',
    time: '16:42',
    body: 'A prioridade e direta: texto rapido, voz limpa e tela compartilhada sem atrito.',
  },
]
