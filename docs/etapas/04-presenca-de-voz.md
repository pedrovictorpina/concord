# Etapa 04 - Presenca de voz e sessao persistente

## Objetivo

Fazer a voz se comportar como no Discord em dois pontos que hoje falham:

1. quem entra em um canal de voz fica visivel para os outros membros do servidor, com indicacao de microfone, tela e fala;
2. a conexao de voz sobrevive a navegacao entre canais, servidores e a tela inicial de mensagens.

## Estado antes

- `ChannelPanel` mostrava um unico participante: o proprio usuario, a partir de `voiceParticipantChannelId`, um `useState` local do `WorkspaceShell` alimentado pelo callback `onConnectionChange` do `LivePanel`. Nada era publicado nem lido de nenhum servico, entao nenhum membro via os demais.
- `useLiveRoom` escutava apenas `TrackSubscribed`, `TrackUnsubscribed` e `Disconnected`. Nao lia `room.remoteParticipants` nem escutava `ParticipantConnected`, `ParticipantDisconnected` ou `ActiveSpeakersChanged`, portanto a sala LiveKit nunca produzia lista de participantes.
- `LivePanel` exibia o texto fixo `Ninguem esta em voz` e o stage so mostrava o nome do canal.
- `useLiveRoom` recebia `channelId` por argumento e desconectava em um efeito sempre que esse id mudava; como o `LivePanel` era desmontado ao abrir um canal de texto, sair da tela do canal derrubava a chamada.
- o microfone permanecia despublicado apos entrar: era preciso clicar em MIC para que alguem pudesse ouvir.

## Estado depois

- `useVoicePresence` publica e le presenca de voz por servidor com Supabase Realtime Presence (canal `voice-presence:<serverId>`, chave de presenca igual ao id do usuario). Nao ha tabela nova nem migration: presenca e efemera e o proprio Realtime remove o registro quando o socket cai.
- `useLiveRoom` mantem a lista de participantes da sala (local e remotos) sincronizada por evento e expoe microfone, tela e fala de cada um; passa a receber o canal em `join(channelId)` em vez de por argumento do hook, o que remove o efeito que desconectava ao navegar.
- `useVoiceSession` orquestra LiveKit, presenca, restricoes de moderacao e o modo demonstracao, e vive no `WorkspaceShell`. A sessao nao depende mais da montagem do `LivePanel`.
- para o canal em que o usuario esta conectado, os dados do LiveKit tem precedencia sobre a presenca (fala e mudo reais); para os outros canais, a lista vem da presenca.
- `VoiceDock` foi extraido do `LivePanel` e fica ancorado enquanto houver conexao, em qualquer tela, com nome do canal, controles e seletor de qualidade.
- ao entrar, o microfone e publicado automaticamente, exceto quando a moderacao restringe ou o navegador nega a permissao.

## Decisoes

- Presenca em canal Realtime publico, coerente com o uso atual de `postgres_changes`. Qualquer usuario autenticado pode ouvir o topico do servidor; os dados expostos sao apelido, identificador, avatar e estado de midia, os mesmos que a lista de membros ja mostra. Restringir exigiria Realtime Authorization com politicas em `realtime.messages`, fora deste recorte.
- Fala (`speaking`) nao entra no payload de presenca: mudaria varias vezes por segundo e esbarraria no limite de eventos do Realtime. O indicador de fala vem do LiveKit e portanto aparece apenas no canal em que o usuario esta conectado, que e onde o Discord tambem o mostra.
- A presenca e observada no servidor ativo e publicada no servidor da conexao. Quando os dois diferem, o hook mantem dois canais Realtime, para que o usuario continue visivel no canal de origem enquanto navega por outro servidor.

## Criterios de aceite

1. Duas contas autenticadas no mesmo servidor: ao entrar em um canal de voz, cada uma aparece na lista daquele canal para a outra, sem recarregar a pagina.
2. Sair da chamada ou fechar a aba remove o participante da lista das outras sessoes.
3. Abrir um canal de texto durante a chamada mantem a conexao, o dock ancorado e o participante na lista do canal de voz.
4. Trocar de servidor durante a chamada mantem a conexao e o dock; ao voltar, o participante continua listado no canal.
5. Falar destaca o participante para quem esta no mesmo canal; desligar o microfone mostra o estado mudo para todos.
6. Membro com microfone restrito pela moderacao entra sem publicar audio e aparece como mudo.
7. Modo demonstracao continua funcionando sem Supabase: o usuario aparece somente no canal em que confirmou a entrada.

## Validacao

- `pnpm check`
- `pnpm lint`
- `pnpm test:e2e`
- QA manual com duas contas descrito em `docs/qa/04-presenca-de-voz.md`.

## Fora deste recorte

- Realtime Authorization com politicas em `realtime.messages`.
- aplicar no LiveKit as acoes de moderacao ja persistidas no Supabase (corte remoto de microfone).
- volume individual, selecao de dispositivo e audio de sistema.
- vaga limite por canal e reordenacao de participantes por tempo de entrada.
