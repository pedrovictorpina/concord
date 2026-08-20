# Progresso

## Resumo

| Etapa | Estado | Ultima atualizacao |
| --- | --- | --- |
| 00 - Fundacao | Concluida e publicada | 2026-08-17 |
| 01 - Identidade e temas | Concluida e publicada | 2026-08-17 |
| 02 - Comunidades e texto | Concluida e publicada | 2026-08-19 |
| 03 - Voz e compartilhamento | Em andamento | 2026-08-20 |
| 04 - Aplicativos | Nao iniciada | - |
| 05 - Qualidade e lancamento | Nao iniciada | - |

## Proxima acao

Configurar o projeto LiveKit Cloud e os segredos da Edge Function para validar voz multiusuário real com duas contas autenticadas. A lista priorizada, critérios de aceite e caminhos de QA estão em `docs/PROXIMOS_PASSOS.md`.

Branch atual: `main`.

## Historico

### 2026-08-17

- stack multiplataforma consolidada;
- compartilhamento de tela promovido a requisito central;
- infraestrutura propria descartada; Supabase Hosted e LiveKit Cloud registrados;
- modo custo zero definido com cotas rigidas para desenvolvimento e piloto;
- fundacao do monorepo criada;
- documentacao inicial registrada;
- cliente web inicial implementado;
- build, lint e interacoes essenciais validados no navegador;
- publicacao bloqueada preventivamente porque a sessao GitHub ativa pertence a outra conta.
- conta pessoal `pedrovictorpina` autenticada sem remover a conta corporativa;
- repositorio privado criado em `pedrovictorpina/darkcord` e posteriormente renomeado para `pedrovictorpina/concord`;
- frontend separado em modulos de identidade, workspace e temas;
- modos sistema, claro e escuro implementados com preferencia persistente;
- camada de Auth Supabase e migration de perfis preparadas;
- suite Playwright adicionada com cinco jornadas aprovadas no Chromium;
- projeto Supabase Concord configurado localmente e conexao de Auth validada sem versionar credenciais;
- produto renomeado de Darkcord para Concord em codigo, pacotes, documentacao e infraestrutura.
- Supabase CLI autenticado na organizacao do Concord e projeto remoto vinculado;
- migration inicial aplicada e schema remoto aprovado no lint;
- confirmacao de e-mail desativada para permitir entrada imediata no MVP;
- repositorio GitHub renomeado para `pedrovictorpina/concord`, preservando historico e PR.
- perfil autenticado e identificador unico conectados ao workspace;
- recuperacao e atualizacao de senha implementadas no cliente;
- seis jornadas Playwright aprovadas;
- integracao remota aprovou cadastro, trigger de perfil, login, troca de senha e isolamento RLS com dois usuarios por execucao;
- URL `http://localhost:5173/**` adicionada e verificada na lista de redirecionamentos permitidos do Supabase;
- quatro usuarios QA das duas execucoes de integracao foram removidos por UUID, com zero registros restantes em `auth.users` e `public.profiles`;
- projeto `concord-web` criado na Vercel com variaveis Supabase em Production e Preview;
- configuracao inicial incorreta em `packages/contracts` diagnosticada e corrigida para Vite em `apps/web`, com build `pnpm build` e saida `dist`;
- redeploy da `main` aprovado em 11 segundos e dominio `https://concord-web-pi.vercel.app` validado com HTTP 200;
- Preview da branch publicado e validado em `https://concord-web-git-codex-etapa-01-128aa4-pedrovictorpinas-projects.vercel.app`;
- URL do Preview adicionada e verificada na lista de redirecionamentos permitidos do Supabase;
- recuperacao real validada com entrega no Outlook, abertura do link, atualizacao da senha e novo login;
- precedencia da tela de nova senha sobre o workspace corrigida apos o teste real revelar o desvio;
- conta temporaria `Pedro QA` removida, com zero registros restantes em `auth.users` e `public.profiles`;
- Edge Functions adiadas para a Etapa 03, quando serao usadas para emitir tokens seguros do LiveKit.
- PR #1 aprovado e integrado na `main` pelo merge commit `3df79ff`;
- deploy de producao `dpl_Hue2goUXh6yAq6h7cwBJKX3foTyp` concluido como Ready;
- dominio `https://concord-web-pi.vercel.app` validado com HTTP 200, configuracao Supabase, tema e demonstracao funcional;
- Site URL do Supabase alterado para o dominio de producao e retorno `https://concord-web-pi.vercel.app/**` permitido;
- varredura de runtime da Vercel nao encontrou erros apos a publicacao.

### 2026-08-18

- primeiro recorte da Etapa 02 implementado: comunidades privadas, membros, canal inicial `#geral`, mensagens persistentes e Realtime;
- migrations de comunidades e mensagens aplicadas ao Supabase, incluindo o ajuste de RLS que permite retornar o servidor criado;
- integracao remota aprovou criacao, isolamento por RLS, associacao de membro, Realtime e amizade aceita;
- seis jornadas Playwright, typecheck, lint e verificacao de migrations aprovados;
- dez contas temporarias de QA e seus dados dependentes foram removidos no Supabase; a verificacao retornou zero registros em `auth.users` e `public.profiles`.

### 2026-08-19

- interface de amizades entregue: busca por `@identificador`, pedidos recebidos, aceite e lista de amigos;
- convites diretos para servidores implementados com aceite explicito antes de criar a membresia;
- migration de convites aplicada ao Supabase e aprovada no lint;
- integracao remota aprovou envio e aceite de convite, incluindo a criacao segura de membro;
- seis jornadas Playwright, build e lint aprovados;
- quatro contas temporarias de QA e seus dados dependentes foram removidos; a verificacao retornou zero registros em `auth.users` e `public.profiles`.
- Etapa 03 iniciada: canal de voz padrao, cliente LiveKit carregado sob demanda e Edge Function segura versionada;
- ativacao remota pendente da criacao do projeto LiveKit Cloud e de tres segredos no Supabase.
- central de configurações adicionada: perfil, URL de avatar, temas, servidor, canais, notificações e permissões simples;
- proprietário agora administra múltiplos canais de texto e voz; membros permanecem sem acesso administrativo;
- silenciamento individual por servidor, contadores locais de não lidas/menções e controle de áudio recebido foram implementados;
- temas iOS Glass e Brutal Signal foram adicionados ao registro persistente;
- convites por link foram registrados como próximo item, com aceite explícito e revogação obrigatórios.
- migration de administração aplicada: links revogáveis, leitura persistente, cargos de moderador, permissões de canal e bucket de avatars;
- upload de avatar, aceite explícito de convite por link e controles de cargo/permissão foram implementados;
- notificações push permanecem bloqueadas até existir chave VAPID e cliente instalável em HTTPS.
- manifesto e service worker adicionados para permitir instalação como PWA em navegadores compatíveis.
- navegação móvel revisada: barra inferior persistente para canais, pessoas e perfil; lista de canais agora abre como painel lateral em vez de desaparecer em telas pequenas.
- seletor de tema removido da lateral de canais; temas permanecem exclusivamente na central de configurações, aberta pelo ícone na barra de servidores; proprietários também criam canais de texto ou voz pelos botões `+` com dica visual.
- central de configurações passa a listar servidores para gerenciamento; o proprietário pode excluir o servidor atual mediante confirmação.
- service worker ajustado para sempre buscar a página de navegação na rede e invalidar o cache anterior, evitando tela branca após deploy; bootstrap de tema sem exceção de escopo.
- entrada em canal de voz agora bloqueia novos cliques e indica carregamento até a confirmação da conexão.
- compartilhamento de tela em PWA móvel identificado como indisponível pela ausência de `getDisplayMedia`; transmissão móvel real permanece dependente do app Android nativo com MediaProjection.
- entrada em canal de voz simplificada para um clique direto no canal; estado de conexão e controles foram movidos para o rodapé da lista de canais, acima do perfil do usuário.
- participantes fictícios removidos da lista de voz; o usuário conectado agora é exibido somente dentro do canal de voz em que a conexão foi confirmada.
- tela inicial de mensagens adicionada: lista de amigos, pedidos recebidos e atalho para adicionar amigo, acessível pelo ícone inicial e pela barra móvel.
- fluxo móvel de amizades revisado com tela de mensagens e adição por identificador em tela cheia; ações sem suporte real, como sincronização de contatos, permanecem fora da interface.
- mensagens privadas entre amigos confirmados implementadas com conversas isoladas por RLS, persistência e atualização em tempo real.
- canais de voz agora abrem em uma tela dedicada, com entrada explícita, chat lateral e painel de conexão ancorado acima do perfil; o menu do servidor reúne convite, configurações e criação de canais.
- migration de mensagens privadas aplicada ao Supabase e confirmada no histórico remoto.
- banimento, timeout de 10 minutos e restrições de microfone/áudio foram adicionados para proprietário e moderadores, com migration aplicada e políticas que impedem moderador de agir sobre proprietário ou outro moderador.
- links e convites diretos agora recusam o retorno de uma pessoa banida ao servidor.
- Radix UI definido como base incremental de componentes acessíveis, preservando os temas e o CSS próprios do Concord.
- presenca de voz corrigida: quem entra em um canal de voz passa a ser visto pelos outros membros do servidor, com contador no canal, apelido, avatar e estado de microfone, tela e fala. Antes a lista mostrava apenas o proprio usuario, a partir de estado local do React que nunca saia do navegador; a lista agora vem do Supabase Realtime Presence (`voice-presence:<serverId>`, sem tabela nova) combinada com os participantes reais da sala LiveKit.
- `useLiveRoom` passou a acompanhar `ParticipantConnected`, `ParticipantDisconnected`, `ActiveSpeakersChanged`, publicacoes e mudos, e a expor a lista de participantes; o microfone agora e publicado ao entrar, exceto quando a moderacao restringe ou o navegador nega a permissao.
- conexao de voz deixou de depender da tela do canal: `useVoiceSession` vive no `WorkspaceShell` e o novo `VoiceDock` fica ancorado ao navegar entre canais, servidores e a tela de mensagens. Antes, abrir um canal de texto desmontava o `LivePanel` e derrubava a chamada.
- retorno para a aba deixou de remontar o workspace: `TOKEN_REFRESHED` recarregava o perfil e a tela voltava para `Sintonizando identidade...`, descartando estado e conexoes; o perfil agora e recarregado somente quando o usuario muda ou em `USER_UPDATED`.
- validacoes: `pnpm check`, `pnpm lint` e `pnpm test:e2e` (15 jornadas, incluindo a nova cobertura de voz persistente no modo demonstracao). Presenca multiusuario depende do roteiro manual em `docs/qa/04-presenca-de-voz.md`, ainda nao executado.
- front migrado para Radix Primitives (pacote `radix-ui`): diálogos, menu do servidor, abas das configurações, seletores, checkboxes, avatares, tooltips e o aviso de erro passaram a usar primitivos acessíveis, com foco preso, `Esc`, devolução de foco e navegação por teclado que o markup feito à mão não tinha. Aparência inalterada — o CSS e os tokens do Concord seguem sendo a única fonte visual.
- primitivos encapsulados em `apps/web/src/components/ui/` (`Modal`, `Choice`, `Toggle`, `Avatar`, `Hint`, `ErrorToast`); `DropdownMenu`, `Tabs` e `Popover` usados direto onde há uma única ocorrência. Decisão em `docs/decisoes/0008-radix-ui-como-base-de-componentes.md`.
- assercões Playwright atualizadas: `selectOption` em `<select>` nativo deu lugar a `combobox` + `option`, abas viraram `role=tab` e o checkbox de sessão virou `role=checkbox`.
- validações: `pnpm check`, `pnpm lint` e `pnpm test:e2e` (15/15) após cada onda; capturas conferidas nos temas `concord` e `ios`, em desktop e em viewport móvel de 390px.
- entrada em canal de voz pela web estava sempre recusada com `401 Sessao invalida.`: a Edge Function `livekit-token` validava a sessao com `auth.getUser()` sem passar o token, o que depende de sessao local inexistente no servidor. Token agora e extraido do header e passado explicitamente, o supabase-js foi fixado em 2.112.3 (antes `@2`, sem pin, mudando de comportamento entre reinicios) e a chave de validacao tem fallback para projetos sem as chaves legadas.
- falhas de entrada em voz deixaram de ser silenciosas: a chamada do token e o import do livekit-client ficavam fora de try e o join nao tinha finally, prendendo o botao em "Entrando na chamada" sem mensagem nem rastro no console. Agora cada etapa tem mensagem propria e `console.error` com o detalhe tecnico.
- painel de membros adicionado na coluna direita, que ficava vazia fora dos canais de voz: lista agrupada por cargo (proprietário, moderadores, membros) com avatar, apelido, identificador e marcação de quem está em voz. Some abaixo de 1120px, junto com o chat lateral de voz, e no canal de voz cede lugar ao painel da chamada.
- autor das mensagens aparecia sempre como "Membro": o embed `profiles!messages_author_id_fkey(nickname)` é uma relação muitos-para-um e retorna objeto, mas o mapeamento lia `profiles[0]`. Corrigido com leitura tolerante a objeto e a array.
- modo demonstração passou a ter três membros com cargos distintos, para o painel e o teste de jornada terem o que exibir.
- convite de amigos ganhou fluxo dedicado, no formato do Discord: atalho no cabecalho do servidor e item do menu abrem um dialogo com busca de amigos, lista com botao CONVIDAR por pessoa, marcacao de quem ja e membro e, no rodape, o link do servidor com copiar e aviso de expiracao. Antes, convidar exigia digitar o identificador na mao no dialogo de pessoas e o link vivia so na aba Servidor das configuracoes.
- mensagem de erro ao gerar link deixou de dizer "somente o proprietario" quando o caso real era falta de sessao.
- titulos de dialogo com quebra de linha ganharam espaco explicito: o nome acessivel saia grudado ("Convidarpara Concord."), o que o leitor de tela anunciava errado.
- modo demonstracao ganhou um segundo amigo que nao e membro do servidor, para exercitar os dois estados da lista de convite.
- encerrar sessao saiu do cabecalho da lista de canais para a aba Perfil das configuracoes, em uma secao Sessao com o motivo explicito. O `x` no cabecalho ficava ao lado das acoes do servidor, convidava ao clique acidental e nao existia na tela inicial de mensagens; as configuracoes sao alcancaveis pela barra de servidores e pela barra movel em qualquer tela. O rotulo acompanha o contexto: SAIR DA CONTA quando autenticado, SAIR DA DEMONSTRACAO no modo local.
- canal de voz passou a exibir varias transmissoes de tela ao mesmo tempo. Antes, `useLiveRoom` guardava uma unica faixa (`screenTrack`) e cada nova tela assinada substituia a anterior, entao so uma live aparecia; agora o hook mantem `screenShares` por publicacao (`TrackSubscribed`, `LocalTrackPublished`, `TrackUnsubscribed`, `LocalTrackUnpublished` e `ParticipantDisconnected`) e o `LivePanel` monta uma grade com o autor em cada tile, botao de destaque e tela cheia por transmissao.
- estado `sharing` deixou de ser do canal e passou a ser da pessoa: era `Boolean(screenTrack)`, entao o botao TELA do dock virava "parar" quando outro membro compartilhava e a presenca marcava quem nao estava transmitindo. Agora deriva de `screenShares.some((share) => share.isLocal)`.
- ADR 0003 revisado: o limite de 1 tela por canal deu lugar a uma tela por participante, todas assistiveis ao mesmo tempo, com o teto pratico de 8 participantes.
- validacoes: `pnpm check`, `pnpm lint` e `pnpm test:e2e` (20/20). Cenario multiusuario depende do roteiro manual em `docs/qa/06-multiplas-telas.md`, ainda nao executado.
- estado de voz ficou visivel para os outros membros: `VoiceParticipant` ganhou `outputEnabled` no Realtime Presence e a lista do canal, os cartoes do canal de voz e o dock passaram a mostrar icones de microfone e fone riscados (SVG com `currentColor`, so quando o estado e negativo). Antes havia um unico glifo por participante, que misturava tela e microfone e nunca indicava audio mutado.
- mutar o audio passou a mutar o microfone junto, com restauracao do estado anterior ao religar; ligar o microfone com o audio mutado religa o audio. `useLiveRoom` trocou os toggles por `setMicrophone`/`setOutput` para permitir a regra.
- validacoes: `pnpm check`, `pnpm lint` e `pnpm test:e2e` (21/21, com jornada nova para o mudo combinado).
- transmissao de tela passou a levar o som junto. A captura pedia `systemAudio: 'include'` sem a chave `audio`, e o LiveKit monta o `getDisplayMedia` com `audio: options.audio ?? false` — ou seja, o som nunca era capturado e a dica de audio do sistema nao tinha efeito. Agora a captura pede audio sem processamento de voz (`autoGainControl`, `echoCancellation` e `noiseSuppression` desligados) e publica com `AudioPresets.musicHighQualityStereo`, `dtx: false` e `red: false`, adequados a musica e jogo.
- faixa de audio da tela virou informacao visivel: `ScreenShareView` ganhou `participantId` e `hasAudio`, o tile mostra `COM SOM` e o dock avisa quando o navegador devolve a tela sem audio, lembrando de marcar "Compartilhar audio" na janela de selecao.
- reproducao bloqueada por autoplay deixou de ser silenciosa: `AudioPlaybackStatusChanged` e a falha de `play()` acendem o botao "Tocar o som da chamada", que chama `room.startAudio()` dentro do clique.
- validacoes: `pnpm check`, `pnpm lint` e `pnpm test:e2e` (21/21). O som em si depende do roteiro manual em `docs/qa/08-audio-na-transmissao.md`, ainda nao executado.
- o cliente passou a abrir na home. Antes, `loadServers` selecionava o primeiro servidor da lista e a tela de amigos so aparecia ao clicar no icone inicial; agora `activeServerId` comeca nulo e so muda por escolha explicita.
- home reescrita no formato do Discord: coluna de conversas (`HomeSidebar`) com busca, atalhos de Amigos e Solicitacoes, lista de mensagens diretas e rodape de identidade; centro com as abas Disponivel, Todos, Pendente e Adicionar amigo, busca e acoes por pessoa; coluna `Ativo agora` com quem esta em chamada.
- presenca online passou a existir: `useFriendPresence` publica estado e canal de voz atual em um canal Realtime unico e alimenta as bolinhas de status, a aba Disponivel e o `Ativo agora`. `PersonSummary` ganhou `avatarUrl`, entao amigos, pedidos, convites e membros exibem foto real.
- validacoes: `pnpm check`, `pnpm lint` e `pnpm test:e2e` (21/21, com as jornadas de home reescritas).
- menu do servidor saiu da setinha isolada e passou a ocupar o cabecalho inteiro: nome, papel de quem le e seta abrem o mesmo menu, agora com convidar pessoas, configuracoes, cargos e permissoes, criar canal, silenciar, marcar como lido e sair do servidor. Antes o menu tinha tres itens e o resto so existia na central de configuracoes.
- criar canal deixou de ser exclusivo do dono na interface: moderador ja podia pelo RLS (`can_manage_channels`) e agora ve os mesmos atalhos.
- painel de membros deixou de ser so leitura: cada membro tem menu com promover, rebaixar, cortar microfone, cortar audio, timeout, remover e banir, dentro do que o cargo de quem le permite. Antes tudo isso vivia apenas na aba Permissoes da central de configuracoes.
- transferencia de propriedade passou a existir de verdade. Escolher `owner` no seletor antigo so mudava `server_members.role` e deixava `servers.owner_id` apontando para o dono antigo, criando dois donos; a RPC `transfer_server_ownership` move o dono, promove o alvo e rebaixa quem transferiu a moderador. Migration `20260819234500_add_member_administration.sql`, ainda nao aplicada no Supabase.
- remover sem banir passou a existir (`remove_server_member`), e moderador agora administra canais tambem na interface, direito que o RLS (`can_manage_channels`) ja concedia.
- convidar deixou de exigir amizade: o dialogo busca perfis no banco por apelido ou identificador parcial e mostra uma secao de outras pessoas convidaveis. Antes a busca so filtrava a lista de amigos ja carregada, e quem nao era amigo so podia ser convidado pelo dono, digitando o identificador exato em outro dialogo.
- moderador passou a convidar e a gerar links (migration `20260819235500_allow_moderator_invites.sql`), o link ganhou validade e limite de usos na criacao, e o convidado ve o nome do servidor antes de aceitar, via `inspect_server_invite_link`, que existia no banco e nao era usada.
- clicar em um canal de voz passou a entrar na chamada direto, como no Discord. Antes abria a tela do canal e ainda exigia o botao `Entrar na chamada de voz`, que agora so aparece quando a conexao nao aconteceu.
- clique com o botao direito passou a abrir um menu por pessoa, no painel de membros e na lista do canal de voz: mensagem, copiar identificador, volume individual com silenciar so para mim, cargos, silenciar voz no servidor, desativar audio, timeout, remover e banir, cada item aparecendo conforme o cargo de quem clica.
- volume por participante usa `RemoteParticipant.setVolume` do LiveKit, entao e um ajuste local de quem escuta e nao altera nada para os outros. `Desconectar` do menu do Discord ficou de fora: derrubar alguem da sala exige a API de servidor do LiveKit, que hoje nao temos.
- nao lidas ficaram confiaveis no essencial: o canal aberto passa a gravar `last_read_at` a cada mensagem recebida com a aba visivel (antes so gravava ao trocar de canal, entao um canal aberto em segundo plano reabria marcado), e a mencao virou regex com fronteira, que impede `@ana` casar dentro de `@anabela`. A contagem inicial deixou de fazer duas consultas por canal e passou a uma so, com teto de 99 e badge `99+`.
- microfone ganhou tratamento configuravel: supressao de ruido, cancelamento de eco, ganho automatico e isolamento de voz na nova aba Voz das configuracoes, guardados em `concord.voice.v1`. Antes o microfone era publicado com as opcoes padrao do navegador, sem escolha nem forma de conferir. Mudanca em chamada usa `LocalAudioTrack.restartTrack`, que troca as constraints sem despublicar a faixa.
- teste de microfone com medidor de nivel entrou junto, usando as mesmas opcoes da chamada. O filtro e o do navegador: solucoes licenciadas como o Krisp ficam fora do modo custo zero, e o caminho futuro seria um `TrackProcessor` do LiveKit.
- dock de voz flutuante deixou de cobrir o perfil na tela inicial: ele usava `bottom: 16px` e ocupava exatamente o rodape da coluna de conversas. Agora fica ancorado acima do perfil, com teste de regressao que compara as posicoes dos dois.
- passou a existir `PARAR DE VER` em cada transmissao: o tile some e a assinatura da faixa e cancelada (`setSubscribed(false)`), entao o video tambem deixa de ser baixado. Quem esta transmitindo continua listado com um botao `Ver a tela de <nome>` para voltar a assistir.
- volume por pessoa passou a funcionar de fato. Antes so chamava `participant.setVolume`, que nao alcancava os elementos de audio criados pelo proprio app; agora o volume e guardado por participante e aplicado direto nesses elementos, inclusive nos que chegam depois, e o controle vai de 0 a 100%, que e o intervalo que o elemento aceita.
- a tela do canal de voz ganhou os controles que so existiam no dock (microfone, audio, tela e sair), o botao de tela virou componente unico usado nos dois lugares, e os cartoes de participante abrem o menu por pessoa com o botao direito.
- chat do canal de voz passou a funcionar: abrir um canal de voz tambem o define como canal ativo, entao a coluna lateral carrega e envia mensagens daquele canal em tempo real, no lugar do texto fixo `O chat deste canal aparece aqui`.
- audio da tela deixou de capturar o proprio Concord: a captura pede `restrictOwnAudio`, `suppressLocalAudioPlayback` e `selfBrowserSurface: 'exclude'`, entao as vozes da chamada nao voltam pela transmissao. Onde o navegador ignora as constraints, o aviso lembra de usar fone.
- cada transmissao ganhou mudo proprio: o botao SOM no tile silencia so o audio daquela tela, sem mexer na voz de quem transmite nem no audio geral. Antes o unico controle era o volume da pessoa, que abrangia voz e tela juntas e nao permitia calar so a live. O estado sobrevive a novas faixas do mesmo participante e ao ligar e desligar o audio geral, e o rotulo do tile passa a mostrar `SEM SOM`.
- a barra de microfone, audio, tela e sair no palco do canal saiu: era a mesma do dock, que ja fica visivel na tela do canal, entao virava dois controles para a mesma acao. O palco fica so com o botao de entrar quando a conexao ainda nao aconteceu.
- supressao de ruido passou a comecar sempre ligada: desligar vale so ate a proxima abertura do Concord. Os outros controles de voz continuam persistindo normalmente, e o texto do controle avisa da regra.
- volume por transmissao passou a existir, e o caminho de audio foi reescrito para WebAudio. `element.volume` sobre faixa de WebRTC e ignorado por alguns navegadores, entao cada faixa remota agora vai para um `GainNode` proprio ligado a um ganho mestre: volume da voz, volume da tela e o mudo geral passaram a ser ganho, com queda para o elemento quando o `AudioContext` nao existe. Isso tambem permitiu passar de 0 a 200%, que o elemento sozinho nao alcanca.
- controles da transmissao viraram uma barra no rodape do video, visivel ao passar o mouse ou ao focar por teclado, no formato de player: mudo com barra de volume a esquerda; destacar, parar de ver e tela cheia a direita. Antes os botoes ficavam sempre visiveis sobre a imagem. Em telas sem hover a barra fica sempre aberta.
- nao foi usada nenhuma biblioteca de player: Video.js e Plyr resolvem arquivo e HLS, nao `MediaStream` de WebRTC, e o controle por participante e justamente o `GainNode` nativo.
- audio duplicado corrigido: a mixagem WebAudio propria criava um segundo caminho de reproducao junto com o elemento anexado, entao cada voz tocava duas vezes. O `RemoteAudioTrack` do livekit ja tem contexto, `gainNode` e `setVolume` internos, entao a sala passou a usar `webAudioMix: true` e o volume passou a ser aplicado pela propria faixa, com um unico caminho de som.
- faixas do proprio participante deixaram de ser reproduzidas por garantia, e o volume passou a ir de 0 a 100% com curva quadratica, para o meio da barra soar como metade em vez de quase igual.
- aviso ao transmitir com som ficou especifico: quando a captura e de tela inteira (`displaySurface === 'monitor'`), o texto explica que o navegador leva tudo que sai das caixas, inclusive a chamada e outras janelas do Concord, e sugere fone ou compartilhar uma guia.
- aba Voz ganhou o formato do Discord: escolha de microfone e de saida de audio via `switchActiveDevice`, volume da chamada, perfis de entrada (Isolamento de voz, Estudio e Personalizado) e o nivel da supressao em lista, editavel so no perfil Personalizado. Antes existiam quatro interruptores soltos, sem dispositivo nem perfil.
- volume de entrada, sensibilidade e apertar para falar ficaram fora e viraram o item 4.9: os tres exigem um `TrackProcessor` no caminho de captura, nao apenas constraints do navegador.

### 2026-08-20

- painel de canais e coluna de membros cresciam alem da altura da tela quando havia muitos canais, salas de voz ou membros, escondendo o rodape e as opcoes de baixo. O `.app-shell` nao tinha `grid-template-rows` explicito, entao a linha crescia pelo conteudo em vez de travar em 100vh. Corrigido travando a linha do grid em `minmax(0, 1fr)`, com `min-height: 0` nas colunas e a lista de canais isolada em area propria com scroll interno, no mesmo formato do painel de membros.
- cabecalho da lista de canais ganhou busca por nome (`Buscar`, com dica `⌘K`) e uma navegacao Inicio/Mencoes/Threads/Explorar. Hoje so Inicio tem efeito; os demais sao visuais ("Em breve") ate existir mencao agregada, threads e descoberta de servidores publicos.
- cabecalho do canal ganhou icones de fixados e notificacoes (visuais por enquanto), um botao que alterna de verdade a exibicao da coluna de membros (o layout ocupa o espaco liberado sem sobrar coluna vazia), e busca que filtra as mensagens ja carregadas do canal.
- painel de membros ganhou busca por apelido ou identificador.
- barra de identidade do usuario ganhou icones de microfone, fone e configuracoes; o de configuracoes abre as configuracoes do servidor, microfone e fone ainda sao visuais.
- barra de envio ganhou botoes de presente, GIF e emoji (visuais) e um botao de enviar dedicado, alem do Enter.
- validacoes: `pnpm check` e `pnpm lint` aprovados; verificacao visual com Playwright nos temas claro e escuro, incluindo busca de canais, busca de membros e alternancia do painel de membros sem sobra de coluna vazia.
- supressao de ruido ganhou um segundo mecanismo: `NoiseSuppressionMode` (`off`/`webrtc`/`rnnoise`) substitui o antigo `suppressionLevel`/`voiceIsolation` guardados soltos, que permitiam combinacoes logicamente invalidas. Preferencias migraram de `concord.voice.v1` para `concord.voice.v2`, com leitura de compatibilidade (`v1 off` -> `off`, `v1 standard`/`high` -> `webrtc`, nunca convertendo automaticamente para `rnnoise`).
- modo Aprimorada roda RNNoise (`@sapphi-red/web-noise-suppressor`, MIT) inteiramente no cliente via `AudioWorklet`, carregado sob demanda (`import()`) so quando o usuario escolhe o modo; o build confirma o wasm e o worklet em chunks separados do bundle principal. `apps/web/src/features/workspace/audio/rnnoise-graph.ts` cria o grafo (fonte -> RNNoise -> destino) e e reutilizado tanto pelo `TrackProcessor` do LiveKit (`RnnoiseAudioProcessor.ts`) quanto pelo teste de microfone, garantindo que os dois usem o mesmo processamento.
- integracao com o LiveKit usa `LocalAudioTrack.setProcessor`/`stopProcessor`; confirmado no codigo instalado (`livekit-client@2.22.0`) que `restartTrack` ja re-executa `processor.restart()` sozinho, entao trocar de microfone ou ajustar outros filtros com RNNoise ativo nao exige logica extra de reanexacao.
- falha ao iniciar o RNNoise (WASM, worklet ou `AudioContext`) cai automaticamente para WebRTC sem derrubar a chamada, com aviso nao bloqueante; a faixa de audio da tela nunca passa pelo RNNoise.
- Vitest adicionado ao `apps/web` (antes o projeto so tinha `pnpm check`, lint e Playwright) para cobrir a logica pura de preferencias, migracao e constraints com 12 casos.
- validacoes: `pnpm test:unit` (12/12), `pnpm check` e `pnpm lint` aprovados. Qualidade real do RNNoise (voz cortada, som metalico, latencia, CPU) e o teste em Firefox/Safari/mobile dependem do roteiro manual, ainda nao executado.
- tela de mensagens diretas redesenhada: cabecalho mostra presenca real do amigo (reaproveitando o mesmo `statusLabel` da tela de Amigos, extraido para `presence.ts`), com espaco para chamada de voz/video/fixados (desabilitados, com dica "em breve"), busca nas mensagens carregadas e menu "Copiar identificador".
- mensagens passaram a ser agrupadas por autor em janelas de 5 minutos (sem repetir avatar/cabecalho) e ganharam separadores reais de data (Hoje/Ontem/data completa); mensagens recebidas usam estrutura aberta (avatar + texto) e mensagens proprias continuam em bubble, seguindo a referencia aprovada sem copiar as cores da imagem.
- composer virou textarea com crescimento automatico ate ~132px, Enter envia e Shift+Enter quebra linha; anexo, emoji e GIF ficam visiveis e desabilitados ("em breve") em vez de fingir suporte.
- lista de conversas na `HomeSidebar` passou a mostrar o status de presenca (Disponivel/Ausente/Em voz) no lugar do `@identificador`, e o campo de busca ganhou icone.
- estado vazio da conversa ganhou avatar grande, nome, identificador e o texto "Este e o comeco da sua conversa com @identificador", no lugar do simbolo generico anterior; erro ao abrir a conversa passou a ocupar o centro da tela e erro de envio ganha botao "Tentar novamente".
- scroll passou a fixar no fim da conversa e a mostrar "↓ Novas mensagens" quando o usuario esta lendo mensagens antigas e uma nova chega.
- envio otimista e reactions ficaram fora do escopo desta etapa, como o proprio documento da etapa permite.
- validacoes: `pnpm check`, `pnpm lint` e `pnpm test:e2e` (26/26, com o teste de mensagem privada atualizado para o novo estado vazio) aprovados; conferencia visual manual via Playwright em desktop, mobile (390px) e tema escuro.
- Home/Amigos redesenhada: as antigas abas Disponivel/Todos/Pendente/Adicionar viraram dois conceitos separados — filtro de presenca (Todos/Online/Ausentes/Offline, com contador por opcao) e navegacao (lista/solicitacoes/adicionar). Ocupado conta como online ate existir um filtro proprio, porque nada no app produz esse status hoje.
- lista de amigos agrupa por presenca (Online/Ausentes/Offline) e cada linha ganhou selecao: clicar no nome abre um painel de detalhes a direita (avatar grande, status, `Mensagem`, menu e atividade em voz quando existir); clicar no icone de mensagem continua abrindo a DM direto, sem exigir selecao primeiro.
- quando nenhum amigo esta selecionado, o painel direito volta a mostrar "Ativo agora" (recurso existente) mais um resumo das duas primeiras solicitacoes e dois primeiros convites de servidor, com "Ver todas" levando a tela cheia de Solicitacoes.
- no mobile, onde nao ha espaco para o painel lateral, selecionar um amigo abre um overlay dedicado (mesmo componente do painel de detalhes, so reposicionado por CSS) com botao de voltar, replicando o mockup aprovado.
- `presence.ts` criado com o mesmo `statusLabel`/`statusClass` que a tela de amigos ja usava, reaproveitado tambem pela nova logica de filtro/agrupamento por presenca.
- sugestoes de amizade, amigos em comum, jogo atual e recusar solicitacao ficaram de fora por decisao do proprio documento da etapa: nao existem dados reais para isso hoje.
- validacoes: `pnpm check`, `pnpm lint` e `pnpm test:e2e` (26/26, dois testes atualizados porque as antigas abas Disponivel/Pendente/Adicionar amigo viraram botoes) aprovados; conferencia visual manual via Playwright em desktop, mobile (390px) e tema escuro, incluindo lista, painel de detalhes, solicitacoes e adicionar amigo.
- redesign do servidor/canais/chat: navegacao Inicio/Mencoes/Threads/Explorar removida (nenhuma tinha efeito real, nem "Inicio"), o atalho `⌘K` saiu da busca de canais por nao existir de fato, e o cabecalho do servidor trocou "VOCE E O DONO"/"VOCE MODERA" por uma hierarquia mais simples (nome do servidor em destaque, cargo abaixo).
- categorias de canais (texto/voz) ganharam cabecalho recolhivel com seta; icones Unicode (`⌄`, `◖`, `⚙`) viraram SVG no mesmo sistema (`WorkspaceIcons`); botoes de microfone/fone no rodape da sidebar de canais foram removidos por nunca terem funcionado (o controle real ja existe no VoiceDock, evitando duplicar/confundir).
- cabecalho do chat perdeu a "descricao do canal" (que na verdade mostrava a descricao do servidor, sem relacao com o canal) e o badge fixo "REDE ESTAVEL"; notificacoes sem funcionalidade real foram removidas, fixar mensagens virou disabled + dica "em breve" em vez de parecer funcional.
- mensagens do chat do servidor ganharam agrupamento por autor/horario e separadores reais de data (Hoje/Ontem/data), substituindo o bloco fixo "ETAPA 02 / Em sintonia" por um estado vazio real por canal; composer virou textarea com Enter/Shift+Enter, e presente/GIF/emoji viraram disabled + "em breve".
- membros do servidor ganharam coroa no proprietario e o indicador de "em voz" trocou o glifo por SVG; nao foi criado agrupamento online/offline por presenca real ainda nao existir para membros do servidor (so para amigos), como o proprio documento da etapa pede para evitar.
- mobile ganhou uma terceira tela dedicada de Membros (antes o painel simplesmente desaparecia): o mesmo `MemberPanel` reaproveita a tecnica de gaveta deslizante ja usada pelos canais, entrando pela direita; o cabecalho do chat no mobile mostra so o icone de membros (pin e busca ficam ocultos para caber no espaco).
- validacoes: `pnpm check`, `pnpm lint` e `pnpm test:e2e` (26/26, ajustes por causa da troca do glifo `◖` por SVG e da remocao do banner "Em sintonia") aprovados; conferencia visual manual via Playwright em desktop, mobile (canais/chat/membros) e tema escuro.
