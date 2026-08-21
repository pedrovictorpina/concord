import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ChannelSummary } from '@concord/contracts'
import { Choice } from '../../../components/ui/Choice'
import { HashIcon, SpeakerIcon } from '../WorkspaceIcons'

type Result = { ok: boolean; message: string }

type ChannelSettingsProps = {
  categories: Array<{ id: string; name: string }>
  channels: ChannelSummary[]
  initialChannelKind: ChannelSummary['kind']
  onCreateCategory: (name: string) => Promise<Result>
  onDeleteChannel: (channelId: string) => Promise<Result>
  onSaveChannel: (channel: { id?: string; name: string; kind: ChannelSummary['kind'] }) => Promise<Result>
  owner: boolean
}

export function ChannelSettings({ categories, channels, initialChannelKind, onCreateCategory, onDeleteChannel, onSaveChannel, owner }: ChannelSettingsProps) {
  const [channelName, setChannelName] = useState('')
  const [channelKind, setChannelKind] = useState<ChannelSummary['kind']>(initialChannelKind)
  const [editingChannelId, setEditingChannelId] = useState<string | undefined>()
  const [categoryName, setCategoryName] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const run = async (action: () => Promise<Result>) => {
    setSubmitting(true)
    setFeedback('')
    const result = await action()
    setSubmitting(false)
    setFeedback(result.message)
    return result
  }

  const startEdit = (channel: ChannelSummary) => {
    setChannelName(channel.name)
    setChannelKind(channel.kind)
    setEditingChannelId(channel.id)
  }

  const cancelEdit = () => {
    setEditingChannelId(undefined)
    setChannelName('')
    setChannelKind('text')
  }

  const submitChannel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void run(async () => {
      const result = await onSaveChannel({ id: editingChannelId, name: channelName, kind: channelKind })
      if (result.ok) cancelEdit()
      return result
    })
  }

  const submitCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void run(async () => {
      const result = await onCreateCategory(categoryName)
      if (result.ok) setCategoryName('')
      return result
    })
  }

  const textChannels = channels.filter((channel) => channel.kind === 'text')
  const voiceChannels = channels.filter((channel) => channel.kind === 'voice')

  return (
    <section className="channel-settings">
      <h1>Canais</h1>
      <p>Gerencie a estrutura do servidor.</p>

      {owner ? (
        <form className="settings-card" onSubmit={submitChannel}>
          <h2>{editingChannelId ? 'Editar canal' : 'Criar canal'}</h2>
          <label className="settings-field">
            <span>Nome do canal</span>
            <input required value={channelName} onChange={(event) => setChannelName(event.target.value)} placeholder="reunião-diária" />
          </label>
          <Choice label="Tipo" onChange={setChannelKind} options={[{ value: 'text', label: 'Texto' }, { value: 'voice', label: 'Voz' }]} value={channelKind} />
          <div className="settings-card-actions">
            <button className="settings-button" disabled={submitting} type="submit">{editingChannelId ? 'Salvar canal' : 'Criar canal'}</button>
            {editingChannelId ? <button className="settings-button subdued" type="button" onClick={cancelEdit}>Cancelar edição</button> : null}
          </div>
        </form>
      ) : null}

      {owner ? (
        <form className="settings-card" onSubmit={submitCategory}>
          <h2>Categorias</h2>
          <p className="settings-card-hint">{categories.length > 0 ? categories.map((category) => category.name).join(' · ') : 'Sem categorias ainda.'}</p>
          <label className="settings-field">
            <span>Nova categoria</span>
            <input required value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Geral" />
          </label>
          <button className="settings-button subdued" type="submit">Criar categoria</button>
        </form>
      ) : null}

      <div className="channel-settings-list">
        {textChannels.length > 0 ? (
          <div className="channel-settings-group">
            <h3>Canais de texto</h3>
            {textChannels.map((channel) => (
              <div className="channel-settings-row" key={channel.id}>
                <span><HashIcon />{channel.name}</span>
                {owner ? <div className="channel-settings-row-actions"><button type="button" onClick={() => startEdit(channel)}>Editar</button><button className="danger" type="button" onClick={() => void run(() => onDeleteChannel(channel.id))}>Remover</button></div> : null}
              </div>
            ))}
          </div>
        ) : null}
        {voiceChannels.length > 0 ? (
          <div className="channel-settings-group">
            <h3>Canais de voz</h3>
            {voiceChannels.map((channel) => (
              <div className="channel-settings-row" key={channel.id}>
                <span><SpeakerIcon />{channel.name}</span>
                {owner ? <div className="channel-settings-row-actions"><button type="button" onClick={() => startEdit(channel)}>Editar</button><button className="danger" type="button" onClick={() => void run(() => onDeleteChannel(channel.id))}>Remover</button></div> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {feedback ? <p className="settings-feedback" role="status">{feedback}</p> : null}
    </section>
  )
}
