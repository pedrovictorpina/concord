# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

Todos rodam a partir da raiz (pnpm workspace). Node >= 22.12, pnpm 11.19.

```bash
pnpm dev                        # vite dev do @concord/web em :5173
pnpm check                      # tsc -b + vite build (é o "typecheck" do projeto)
pnpm lint                       # oxlint
pnpm test:unit                  # Vitest (lógica pura, sem DOM real — ver apps/web/vitest.config.ts)
pnpm test:e2e                   # Playwright (sobe o dev server em 127.0.0.1:4173 sozinho)
pnpm test:e2e:ui
pnpm test:integration:supabase  # script Node contra o Supabase REMOTO
pnpm db:lint                    # supabase db lint --linked --level warning
pnpm db:push                    # aplica migrations no projeto vinculado
```

Um único teste e2e: `pnpm exec playwright test tests/e2e/identity-and-themes.spec.ts -g "alterna e persiste"`.
Primeira execução precisa de `pnpm exec playwright install chromium`.

A validação principal continua sendo `pnpm check` + `pnpm lint` + Playwright. `pnpm test:unit` (Vitest,
adicionado na Etapa 03 para a lógica de preferências de voz) cobre só funções puras — não há
ambiente de componente/DOM configurado.

### Cuidados com os comandos de banco/integração

- `pnpm db:push` escreve no Supabase Hosted real. Rode `pnpm supabase db push --dry-run` antes.
- `pnpm test:integration:supabase` cria usuários QA reais, lê `apps/web/.env.local` e registra os IDs em `.qa/supabase-test-users.json`. Os usuários precisam ser removidos depois da validação.

## Arquitetura

Monorepo pnpm: `apps/*` e `packages/*`. Hoje existem `apps/web` (React 19 + Vite + TS) e `packages/contracts`.

**Não há backend próprio.** O cliente fala direto com serviços gerenciados:

```
apps/web ──> Supabase Auth (sessão)
         ──> Supabase Postgres + RLS (dados, via supabase-js)
         ──> Supabase Realtime (postgres_changes em messages)
         ──> Edge Function livekit-token (única lógica privilegiada)
         ──> LiveKit Cloud (voz e tela, WebRTC direto)
```

### `@concord/contracts`

Exporta `./src/index.ts` direto, sem build. É a fonte única dos tipos de domínio (`ServerSummary`, `MessageSummary`, `ChannelPermission`, `ServerMemberRole`, ...). Ao mudar um formato de dado, mude aqui primeiro — web e Edge Functions derivam desses tipos.

### Camada de dados: `useCommunityWorkspace`

`apps/web/src/features/workspace/useCommunityWorkspace.ts` concentra **toda** a leitura/escrita Supabase do workspace: servidores, canais, mensagens, amigos, convites, cargos, permissões de canal, não lidas e moderação. Ele mapeia linhas `snake_case` do banco para os tipos camelCase de `@concord/contracts` (funções `mapMessage`, `mapProfile` etc.). Novas features de dados entram nesse hook, não nos componentes.

`WorkspaceShell.tsx` é só composição: mantém estado de UI (diálogos, canal de voz ativo, navegação móvel) e distribui o retorno do hook para os painéis (`ChannelPanel`, `ChatPanel`, `LivePanel`, `SettingsDialog`, ...).

### Modo demonstração

`supabase` em `lib/supabase.ts` é `null` quando as env vars faltam (`isSupabaseConfigured`). `App.tsx` tem um `demoMode` que renderiza o workspace com dados de `workspace-data.ts`. Todo código novo que toca Supabase precisa checar `supabase &&` / respeitar `demoMode` — os testes Playwright rodam nesse caminho.

A persistência da sessão alterna entre `localStorage` e `sessionStorage` via `setKeepSession` (checkbox "manter conectado"), com um storage adapter customizado.

### Operações privilegiadas

Nada sensível é feito por UPDATE direto do cliente. Regras críticas vivem em funções Postgres `security definer ... set search_path = ''` chamadas via `supabase.rpc()`:

- `redeem_server_invite_link(target_code)` — resgate de convite por link (checa expiração, limite de usos e banimento);
- `ban_server_member`, `set_server_member_moderation` — banimento, timeout, corte de microfone/áudio;
- triggers que validam transições de `friend_requests` / `server_invites`.

O token do LiveKit vem só de `supabase/functions/livekit-token/index.ts`: valida a sessão com a chave publicável, e só então usa a service role para conferir que o canal é de voz, que o usuário é membro e que o cargo tem `can_speak`. Chaves `LIVEKIT_*` e service role existem apenas nos segredos da Edge Function — nunca no bundle.

### Voz e tela

`useLiveRoom` importa `livekit-client` dinamicamente (`await import`) para não pesar o bundle inicial. Compartilhamento de tela usa `getDisplayMedia` (só em contexto seguro; indisponível em PWA móvel). Qualidades em `screen-quality.ts` — o modo custo zero limita a 720p/15 FPS, 8 participantes e 1 tela publicada.

### Temas

`ThemeProvider` grava `data-style-theme` e `data-color-mode` em `<html>` e persiste `concord.theme.v1` no `localStorage`; `system` acompanha `prefers-color-scheme`. Famílias visuais (`concord`, `neo`, `glass`) são registradas em `theme/theme-registry.ts` e implementadas em `theme/themes/*.css` por tokens semânticos; `theme/tokens/base.css` guarda o que não muda entre temas (espaçamento, escala tipográfica, z-index, tamanhos de avatar/controle) e precisa ficar em `:root`, senão trocar de tema quebra as referências. Componentes nunca escolhem cor direta — qualquer mudança visual precisa funcionar nas três famílias, nos dois modos e no mobile. O design system de cada família está em `docs/design-system/`; em conflito entre mockup e design system, o design system manda. Ver `docs/decisoes/0004-arquitetura-de-temas.md`.

Os ids antigos `ios` e `brutal` são migrados para `glass` e `neo` na leitura do `localStorage` (`legacyStyleThemeIds` em `theme-types.ts` e o bootstrap inline do `index.html`) — os dois pontos precisam andar juntos.

### Migrations

`supabase/migrations/AAAAMMDDHHMMSS_descricao.sql`, forward-only, todas versionadas. RLS obrigatório em toda tabela exposta. Novas colunas/tabelas geralmente exigem também atualizar `@concord/contracts` e `useCommunityWorkspace`.

## Convenções do repositório

- Textos de interface e mensagens de erro em português, sempre amigáveis: erro técnico do Supabase é traduzido (ver `translateAuthError`) e nunca exibido cru.
- Branches de trabalho: `codex/<descricao-curta>`; `main` deve permanecer executável.
- `docs/PROCESSO.md` manda no fluxo de entrega: antes de implementar, criar/atualizar `docs/etapas/NN-nome.md`; decisões arquiteturais viram ADR em `docs/decisoes/`; ao concluir, atualizar `docs/PROGRESSO.md` e `docs/ROADMAP.md` com estado antes/depois e comandos de validação executados.
- Nunca versionar `.env*` (só `.env.example`), tokens ou chaves.
