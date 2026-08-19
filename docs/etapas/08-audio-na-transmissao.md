# Etapa 08 - Audio junto com a transmissao de tela

## Objetivo

Fazer o compartilhamento de tela levar o som junto. As transmissoes chegavam mudas para quem
assistia: so o video era publicado.

## Causa

`useLiveRoom` chamava `setScreenShareEnabled` com `{ contentHint, resolution, systemAudio:
'include', video: true }`. O LiveKit monta as opcoes do `getDisplayMedia` em
`screenCaptureToDisplayMediaStreamOptions`, e essa funcao faz `audio: options.audio ?? false`.
Sem a chave `audio`, a captura era pedida sem faixa de som e o `systemAudio: 'include'` nao tinha
efeito nenhum - ele apenas diz *como* capturar o audio do sistema quando o audio foi pedido.

## Depois

- a captura passa a pedir `audio` com `autoGainControl`, `echoCancellation` e `noiseSuppression`
  desligados: o alvo e som de jogo, video ou musica, nao voz, e o processamento de voz degrada
  esse material;
- a publicacao usa `audioPreset: AudioPresets.musicHighQualityStereo` com `dtx: false` e
  `red: false`. DTX corta trechos "silenciosos" e RED duplica pacotes; ambos ajudam a fala e
  atrapalham musica;
- `ScreenShareView` ganhou `participantId` e `hasAudio`, entao a faixa de audio da tela
  (`Track.Source.ScreenShareAudio`) e correlacionada com o video do mesmo participante e o tile
  mostra `COM SOM`;
- se o navegador nao devolver faixa de audio, o dock avisa que a tela foi compartilhada sem som e
  lembra de marcar "Compartilhar audio" na janela de selecao - o Chrome so oferece a opcao para
  aba e para tela inteira, e no Firefox e no Safari ela nao existe;
- reproducao bloqueada por autoplay deixou de ser silenciosa: `AudioPlaybackStatusChanged` e a
  falha de `play()` acendem um botao "Tocar o som da chamada" que chama `room.startAudio()` dentro
  do clique, como a politica dos navegadores exige.

O audio da propria tela nao e reproduzido localmente - so as faixas remotas sao anexadas, entao
quem transmite nao ouve a si mesmo em eco.

## Criterios de aceite

1. Quem assiste ouve o som da tela transmitida, alem de ver o video.
2. O tile mostra `COM SOM` quando a transmissao tem audio.
3. Compartilhar sem marcar o audio no navegador mostra o aviso no dock, e a tela continua indo.
4. Quem transmite nao ouve a propria tela.
5. O botao ÁUDIO do dock continua silenciando tudo, inclusive o som das telas.
6. Funciona nos tres temas, nos dois modos de cor e no mobile.

## Validacoes

- `pnpm check`, `pnpm lint`, `pnpm test:e2e` 21/21;
- QA manual com duas contas: `docs/qa/08-audio-na-transmissao.md`, ainda nao executado.
