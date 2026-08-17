# Concord

O Concord e um aplicativo de comunicacao leve para web, Windows, Android e iOS. O produto combina servidores, amizades, canais de texto, voz e compartilhamento de tela sem tentar reproduzir toda a complexidade do Discord.

## Estado atual

**Etapa 01 - Identidade e temas em desenvolvimento.**

Repositorio principal: https://github.com/pedrovictorpina/concord

- monorepo pnpm configurado;
- cliente web React/TypeScript criado;
- prototipo responsivo e navegavel;
- controle de captura de tela implementado no navegador;
- frontend modular com modos sistema, claro e escuro;
- cadastro e login preparados para Supabase Hosted;
- migration inicial de perfis e politicas RLS versionada;
- testes de jornada com Playwright;
- arquitetura, roadmap e processo de documentacao registrados.

Consulte [docs/PROGRESSO.md](docs/PROGRESSO.md) para acompanhar as entregas.

## Executar localmente

Requisitos: Node.js 20.19 ou superior e pnpm 11.19 ou superior.

```powershell
pnpm install
pnpm dev
```

Abra `http://localhost:5173`.

## Validar

```powershell
pnpm check
pnpm lint
pnpm exec playwright install chromium
pnpm test:e2e
pnpm db:lint
```

`pnpm db:push` aplica migrations ao projeto Supabase vinculado. Execute `pnpm supabase db push --dry-run` antes de qualquer alteracao remota.

## Documentacao

- [Visao do produto](docs/VISAO.md)
- [Arquitetura](docs/ARQUITETURA.md)
- [Roadmap](docs/ROADMAP.md)
- [Como documentar etapas](docs/PROCESSO.md)
- [Decisoes de arquitetura](docs/decisoes/0001-stack-multiplataforma.md)
- [Infraestrutura gerenciada](docs/decisoes/0002-infraestrutura-gerenciada.md)
- [Modo custo zero](docs/decisoes/0003-modo-custo-zero.md)
- [Arquitetura de temas](docs/decisoes/0004-arquitetura-de-temas.md)
- [Nome Concord](docs/decisoes/0005-nome-concord.md)
- [Etapa 01 - Identidade e temas](docs/etapas/01-identidade-temas.md)

## Organizacao planejada

```text
concord/
|-- apps/
|   |-- web/          React + Vite
|   |-- desktop/      Electron (etapa futura)
|   `-- mobile/       React Native + Expo (etapa futura)
|-- packages/
|   `-- contracts/    Tipos compartilhados
`-- docs/             Produto, decisoes e historico das etapas
```
