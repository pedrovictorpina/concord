# Etapa 10 - Supressao de ruido e teste de microfone

## Objetivo

Dar controle sobre o tratamento do microfone e uma forma de conferir a captura antes de falar.

## Antes

- o microfone era publicado com as opcoes padrao do navegador (`setMicrophoneEnabled(true)`, sem
  `AudioCaptureOptions`), entao nao havia escolha nem previsibilidade;
- nao existia teste de microfone: so dava para saber se o audio estava bom perguntando a outra
  pessoa na chamada.

## Depois

- `voice-preferences.ts` guarda supressao de ruido, cancelamento de eco, ganho automatico e
  isolamento de voz em `concord.voice.v1`, e monta o `AudioCaptureOptions` a partir disso;
- `useLiveRoom` publica o microfone com essas opcoes na entrada do canal e ao religar o
  microfone, e aplica mudanca em chamada com `LocalAudioTrack.restartTrack`, que troca as
  constraints sem despublicar a faixa;
- aba **Voz** nas configuracoes, com os quatro controles e um teste de microfone que mostra o
  nivel captado - o teste usa exatamente as mesmas opcoes da chamada, entao o que aparece na
  barra e o que os outros vao ouvir;
- isolamento de voz so fica habilitado onde o navegador declara suportar a constraint
  (`getSupportedConstraints().voiceIsolation`); nos demais aparece desligado e explicado.

## Decisao sobre o filtro

A supressao usada e a do proprio navegador. Filtros dedicados como o Krisp, que o Discord usa,
sao licenciados e exigem processamento adicional - ficam fora do modo custo zero da ADR 0003. Se
um dia isso mudar, o caminho no LiveKit e um `TrackProcessor` em `AudioCaptureOptions.processor`.

## Criterios de aceite

1. Alternar a supressao muda a captura sem derrubar a chamada.
2. A supressao de ruido volta ligada a cada abertura do Concord, mesmo que tenha sido desligada
   na sessao anterior; os demais controles seguem o que foi salvo.
3. O teste de microfone mostra o nivel e para ao sair da aba.
4. Isolamento de voz aparece desabilitado quando o navegador nao suporta.
5. Funciona nos tres temas, nos dois modos de cor e no mobile.

## Validacoes

- `pnpm check`, `pnpm lint`, `pnpm test:e2e` 24/24, com jornada nova que desliga a supressao e
  confere a persistencia depois de recarregar;
- efeito sonoro real depende de conferencia manual com duas contas.
