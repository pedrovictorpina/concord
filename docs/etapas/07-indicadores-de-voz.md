# Etapa 07 - Indicadores de microfone e audio na voz

## Objetivo

Deixar visivel, na lista do canal e no dock, quem esta com o microfone mutado e quem esta com o
audio mutado, e fazer o mudo de audio derrubar o microfone junto.

## Antes

- a lista de participantes tinha um unico glifo a direita (`▣`, `⌁` ou `×`), que servia para tela
  e microfone ao mesmo tempo e nao distinguia audio de microfone;
- o estado de audio mutado era so local: ninguem no canal via que a pessoa estava sem ouvir;
- mutar o audio nao mexia no microfone, entao dava para continuar falando sem ouvir ninguem.

## Depois

- `VoiceParticipant` ganhou `outputEnabled`, publicado no Realtime Presence junto com o restante
  do estado. Presenca antiga sem o campo e lida como audio ligado;
- `VoiceStateIcons` traz microfone, fone e tela em SVG com `currentColor`. `VoiceStateFlags`
  mostra apenas o que esta negativo (audio mutado, microfone mutado) mais a tela, entao o estado
  normal continua limpo;
- os mesmos icones aparecem na lista de canais, nos cartoes do canal de voz e nos botoes MIC e
  AUDIO do dock, que passaram a ter `aria-pressed` e rotulo de estado;
- mutar o audio muta o microfone e guarda o estado anterior; religar o audio devolve o microfone
  ao que ele era antes. Ligar o microfone enquanto o audio esta mutado religa o audio junto, para
  nao existir "falando sem ouvir";
- `useLiveRoom` trocou `toggleMicrophone`/`toggleOutput` por `setMicrophone`/`setOutput`, porque a
  regra acima precisa definir valor, nao alternar.

## Criterios de aceite

1. Quem esta com microfone mutado aparece com o icone de microfone riscado para os outros.
2. Quem esta com audio mutado aparece com o icone de fone riscado para os outros.
3. Mutar o audio muta o microfone; religar o audio devolve o microfone ao estado anterior.
4. Ligar o microfone com o audio mutado religa o audio.
5. Restricoes de moderacao continuam prevalecendo sobre a escolha do usuario.
6. Funciona nos tres temas, nos dois modos de cor e no mobile.

## Validacoes

- `pnpm check`, `pnpm lint`;
- `pnpm test:e2e` 21/21, com a jornada nova "mutar o áudio também muta o microfone";
- estados conferidos em captura no modo demonstracao (normal e mutado).
- QA multiusuario: `docs/qa/06-multiplas-telas.md` cobre a parte de tela; o indicador visto pelo
  outro lado depende de duas contas reais.
