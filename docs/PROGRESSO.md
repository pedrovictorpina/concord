# Progresso

## Resumo

| Etapa | Estado | Ultima atualizacao |
| --- | --- | --- |
| 00 - Fundacao | Concluida e publicada | 2026-08-17 |
| 01 - Identidade e temas | Concluida e publicada | 2026-08-17 |
| 02 - Comunidades e texto | Em andamento | 2026-08-18 |
| 03 - Voz e compartilhamento | Em andamento | 2026-08-19 |
| 04 - Aplicativos | Nao iniciada | - |
| 05 - Qualidade e lancamento | Nao iniciada | - |

## Proxima acao

Aplicar a migration de preferências e validar a administração do servidor com uma conta autenticada.

Branch atual: `codex/etapa-03-voz-tela`.

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
