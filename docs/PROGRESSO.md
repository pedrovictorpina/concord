# Progresso

## Resumo

| Etapa | Estado | Ultima atualizacao |
| --- | --- | --- |
| 00 - Fundacao | Concluida e publicada | 2026-08-17 |
| 01 - Identidade e temas | Concluida e publicada | 2026-08-17 |
| 02 - Comunidades e texto | Concluida e publicada | 2026-08-19 |
| 03 - Voz e compartilhamento | Em andamento | 2026-08-19 |
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
