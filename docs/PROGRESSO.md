# Progresso

## Resumo

| Etapa | Estado | Ultima atualizacao |
| --- | --- | --- |
| 00 - Fundacao | Concluida e publicada | 2026-08-17 |
| 01 - Identidade e temas | Concluida e publicada | 2026-08-17 |
| 02 - Comunidades e texto | Em andamento | 2026-08-18 |
| 03 - Voz e compartilhamento | Nao iniciada | - |
| 04 - Aplicativos | Nao iniciada | - |
| 05 - Qualidade e lancamento | Nao iniciada | - |

## Proxima acao

Validar o Preview de amizades e convites e decidir se a Etapa 02 segue para moderacao ou para voz e compartilhamento.

Branch atual: `codex/etapa-02-comunidades-texto`.

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
