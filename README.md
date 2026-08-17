# Darkcord

O Darkcord e um aplicativo de comunicacao leve para web, Windows, Android e iOS. O produto combina servidores, amizades, canais de texto, voz e compartilhamento de tela sem tentar reproduzir toda a complexidade do Discord.

## Estado atual

**Etapa 00 - Fundacao concluida localmente.**

- monorepo pnpm configurado;
- cliente web React/TypeScript criado;
- prototipo responsivo e navegavel;
- controle de captura de tela implementado no navegador;
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
```

## Documentacao

- [Visao do produto](docs/VISAO.md)
- [Arquitetura](docs/ARQUITETURA.md)
- [Roadmap](docs/ROADMAP.md)
- [Como documentar etapas](docs/PROCESSO.md)
- [Decisoes de arquitetura](docs/decisoes/0001-stack-multiplataforma.md)
- [Infraestrutura gerenciada](docs/decisoes/0002-infraestrutura-gerenciada.md)
- [Modo custo zero](docs/decisoes/0003-modo-custo-zero.md)

## Organizacao planejada

```text
darkcord/
|-- apps/
|   |-- web/          React + Vite
|   |-- desktop/      Electron (etapa futura)
|   `-- mobile/       React Native + Expo (etapa futura)
|-- packages/
|   `-- contracts/    Tipos compartilhados
`-- docs/             Produto, decisoes e historico das etapas
```
