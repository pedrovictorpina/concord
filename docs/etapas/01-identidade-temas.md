# Etapa 01 - Identidade e temas parametrizados

## Objetivo

Criar a base de identidade do Concord e refatorar o cliente web para aceitar familias de estilo independentes dos modos claro e escuro.

## Solicitado

- iniciar o desenvolvimento da Etapa 01;
- manter o frontend modular e parametrizado;
- permitir varios estilos futuros, como iOS e neo-brutalismo;
- iniciar com modos claro e escuro seguindo o dispositivo;
- preservar o plano de custo zero.

## Antes

O cliente era um prototipo funcional concentrado em `App.tsx` e `App.css`, com cores escuras fixas. Nao existiam cadastro, sessao, camada Supabase ou tokens semanticos de tema.

## Dependencias

- React 19 e Vite 8 ja instalados;
- `@supabase/supabase-js` no cliente web;
- Playwright para jornadas de interface reproduziveis;
- projeto Concord no Supabase Free, vinculado pelo CLI;
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` configuradas apenas no ambiente.

## Arquitetura da interface

O sistema separa duas dimensoes:

1. `styleTheme`: linguagem visual completa, como `concord`, `ios` ou `neo-brutalism`.
2. `colorMode`: `system`, `light` ou `dark`.

Componentes consomem apenas tokens semanticos (`--color-surface`, `--color-text`, `--radius-control`). Uma nova familia visual fornece seus tokens sem exigir condicionais nos componentes.

## Criterios de aceite

| Criterio | Modo de teste | Caminho de QA |
| --- | --- | --- |
| Modo inicial segue o dispositivo | Playwright/manual | `/` -> alterar tema do sistema |
| Usuario escolhe sistema, claro ou escuro | Playwright/manual | `/` -> controle de aparencia |
| Preferencia permanece apos atualizar | Playwright/manual | escolher modo -> atualizar pagina |
| Tema claro mantem contraste e hierarquia | Visual | `/` -> aparencia -> claro |
| Tema escuro preserva identidade inicial | Visual | `/` -> aparencia -> escuro |
| Login e cadastro usam componentes compartilhados | Revisao/visual | `/` -> alternar entrar/criar conta |
| Recuperacao solicita link e permite nova senha | Playwright/integracao | `/` -> esqueci minha senha -> link recebido |
| Configuracao ausente nao quebra a aplicacao | Manual | executar sem `.env` |
| Migration cria perfil e RLS | Integracao remota | `pnpm test:integration:supabase` |
| Perfil automatico aparece no workspace | Integracao/visual | cadastrar -> entrar -> barra de identidade |
| Workspace continua navegavel em demonstracao | Playwright/manual | `/` -> explorar demonstracao |
| Autenticacao nao cria rolagem horizontal no celular | Playwright | viewport `390 x 844` -> `/` |

## Riscos

- confirmacao de e-mail esta intencionalmente desligada apenas para o MVP;
- testes remotos criam usuarios QA que precisam ser removidos pelo manifesto persistente em `.qa`; os quatro usuarios desta rodada foram removidos e a ausencia em `auth.users` e `public.profiles` foi verificada;
- o projeto Supabase esta em uma organizacao separada por causa do limite gratuito de dois projetos por conta;
- familias iOS e neo-brutalismo ficam registradas como extensoes futuras, nao implementadas nesta etapa.

## Validacoes

- `pnpm check`: aprovado;
- `pnpm lint`: aprovado;
- `pnpm test:e2e`: 6 testes aprovados no Chromium;
- `pnpm test:integration:supabase`: cadastro, trigger de perfil, login, troca de senha e RLS aprovados;
- seguimento dinamico do modo claro/escuro do dispositivo: aprovado;
- persistencia da preferencia no `localStorage`: aprovada;
- formulario de cadastro inicial sem mutacao remota: aprovado;
- configuracao Supabase carregada e resposta real de Auth recebida: aprovada;
- migration `20260817170000_create_profiles.sql` aplicada ao projeto Concord: aprovada;
- `supabase db push --dry-run`: banco remoto sincronizado;
- `supabase db lint --linked --level warning`: nenhum erro de schema;
- confirmacao de e-mail desativada e persistida no painel do Supabase;
- identidade do workspace derivada do perfil autenticado, com contingencia pelos metadados da sessao;
- fluxo de solicitacao e atualizacao de senha implementado com evento `PASSWORD_RECOVERY`;
- redirecionamento local `http://localhost:5173/**` permitido e verificado na configuracao de Auth do Supabase;
- quatro usuarios QA removidos apos a integracao, com consultas de verificacao retornando zero usuarios e zero perfis remanescentes;
- demonstracao, envio local de mensagem e viewport movel: aprovados;
- inspecao visual dos modos [sistema](../evidencias/01-identidade-tema-sistema.png), [claro](../evidencias/01-identidade-tema-claro.png) e [workspace claro](../evidencias/01-workspace-tema-claro.png): aprovada;
- entrega real do e-mail e retorno pelo link de recuperacao: pendentes de validacao com um endereco acessivel.

Os testes ficam em `tests/e2e/identity-and-themes.spec.ts` e iniciam o Vite automaticamente em uma porta isolada.
