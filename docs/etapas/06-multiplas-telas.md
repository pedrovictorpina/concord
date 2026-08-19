# Etapa 06 - Multiplas telas simultaneas na live

## Objetivo

Permitir que um canal de voz mostre varias transmissoes de tela ao mesmo tempo. Antes, o
workspace guardava uma unica faixa de video (`screenTrack`), entao a segunda pessoa que
compartilhava substituia a primeira na tela de quem assistia.

## Dependencias

- `useLiveRoom` (LiveKit) e `useVoiceSession`;
- `LivePanel` e `WorkspaceShell.css`;
- ADR 0003 (modo custo zero), que previa uma tela por canal.

## Riscos

- egress do LiveKit Cloud cresce com o numero de telas assistidas ao mesmo tempo;
- CPU do cliente sobe com varios videos decodificando em paralelo;
- `adaptiveStream` precisa continuar ativo para reduzir a camada dos videos pequenos.

## Criterios de aceite

1. Duas ou mais pessoas compartilhando tela no mesmo canal aparecem juntas, em grade.
2. Cada transmissao mostra de quem e e tem botao proprio de tela cheia.
3. Clicar em uma transmissao coloca ela em destaque e reduz as demais a miniaturas;
   clicar de novo volta a grade.
4. O botao TELA do dock so aparece como "parar" quando quem esta transmitindo sou eu
   (antes ele virava "parar" quando outra pessoa compartilhava).
5. Quando alguem para de transmitir ou sai do canal, so a transmissao dela some.
6. Funciona nos tres temas, nos dois modos de cor e no mobile.

## Como testar

- QA manual com duas contas em navegadores diferentes: `docs/qa/06-multiplas-telas.md`.
- `pnpm check` e `pnpm lint`.
- Playwright no modo demonstracao (a demo simula apenas a tela local).

## Antes

- `useLiveRoom` guardava `screenTrack: LocalTrack | RemoteTrack | null`. Cada nova faixa de tela
  assinada sobrescrevia a anterior, entao so a ultima transmissao aparecia.
- `LivePanel` tinha um unico `<video>` e um unico botao de tela cheia.
- `sharing` era `Boolean(liveRoom.screenTrack)`: quando outra pessoa compartilhava, o botao TELA
  do dock ja aparecia como "parar" para todo mundo, e a presenca marcava a pessoa errada como
  transmitindo.

## Depois

- `useLiveRoom` expoe `screenShares: ScreenShareView[]` (`screen-shares.ts`), alimentado por
  `TrackSubscribed`, `TrackUnsubscribed`, `LocalTrackPublished`, `LocalTrackUnpublished` e
  `ParticipantDisconnected`. Cada item guarda id da publicacao, apelido, se e local e a faixa.
- `useVoiceSession` unifica a lista real com o stream do modo demonstracao e passa a derivar
  `sharing` de `screenShares.some((share) => share.isLocal)`.
- `LivePanel` renderiza `ScreenShareTile` por transmissao, em grade de duas colunas; clicar em
  DESTACAR coloca uma delas em tamanho grande e reduz as outras a miniaturas; cada tile tem seu
  proprio botao de tela cheia e o rotulo com o autor.
- `adaptiveStream` continua ligado, entao as miniaturas caem para uma camada menor sozinhas.

## Validacoes executadas

- `pnpm check` - build e tsc sem erro;
- `pnpm lint` - oxlint sem aviso;
- `pnpm test:e2e` - 20/20 jornadas Playwright no modo demonstracao;
- QA com duas contas reais: pendente, roteiro em `docs/qa/06-multiplas-telas.md`.
