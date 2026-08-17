# Concord

O Concord e um aplicativo de comunicacao leve para web, Windows, Android e iOS. O produto combina servidores, amizades, canais de texto, voz e compartilhamento de tela sem tentar reproduzir toda a complexidade do Discord.

## Estado atual

**Etapa 01 - Identidade e temas em desenvolvimento, com validacao real do e-mail de recuperacao ainda pendente.**

Repositorio principal: https://github.com/pedrovictorpina/concord

Cliente web publicado: https://concord-web-pi.vercel.app

- monorepo pnpm configurado;
- cliente web React/TypeScript criado;
- prototipo responsivo e navegavel;
- controle de captura de tela implementado no navegador;
- frontend modular com modos sistema, claro e escuro;
- cadastro e login preparados para Supabase Hosted;
- perfil automatico, sessao restaurada e recuperacao de senha;
- migration inicial de perfis e politicas RLS versionada;
- testes de jornada com Playwright e integracao remota controlada;
- arquitetura, roadmap e processo de documentacao registrados.

Consulte [docs/PROGRESSO.md](docs/PROGRESSO.md) para acompanhar as entregas.

## Executar localmente

Requisitos: Node.js 22.12 ou superior e pnpm 11.19 ou superior.

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
pnpm test:integration:supabase
pnpm db:lint
```

`pnpm db:push` aplica migrations ao projeto Supabase vinculado. Execute `pnpm supabase db push --dry-run` antes de qualquer alteracao remota.

O teste de integracao Supabase cria dois usuarios QA com senhas efemeras e registra apenas os IDs de limpeza em `.qa/supabase-test-users.json`, fora do diretorio limpo pelo Playwright. Remova esses usuarios e o manifesto local ao terminar a validacao. Os quatro usuarios criados nas duas execucoes documentadas da Etapa 01 ja foram removidos.

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
- [Hospedagem web na Vercel](docs/decisoes/0006-hospedagem-web-vercel.md)
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
