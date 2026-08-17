# Etapa 00 - Fundacao

## Objetivo

Transformar a ideia do Darkcord em um repositorio executavel, documentado e pronto para evoluir em entregas pequenas.

## Solicitado

- iniciar o projeto;
- usar TypeScript, React, Electron e React Native;
- considerar compartilhamento de tela um recurso importante;
- documentar cada etapa no GitHub para permitir trabalho em mais de um computador.
- iniciar sem custo mensal e sem risco de cobranca automatica.

## Antes

O diretorio continha apenas um repositorio Git vazio, sem commits, codigo, remoto ou documentacao.

## Depois

- monorepo pnpm;
- cliente React/Vite responsivo;
- contrato compartilhado inicial;
- controle e pre-visualizacao de captura local implementados no navegador;
- visao, arquitetura, roadmap, decisoes e processo de continuidade;
- comandos unificados de desenvolvimento e verificacao.

## Dependencias

- Node.js 20.19 ou superior;
- pnpm 11.19 ou superior;
- navegador com permissao para captura de tela;
- autenticacao correta no GitHub CLI para publicar.

## Criterios de aceite

| Criterio | Modo de teste | Caminho de QA |
| --- | --- | --- |
| Projeto instala em outro computador | Automatizado/manual | raiz -> `pnpm install` |
| Cliente web compila | Automatizado | raiz -> `pnpm check` |
| Padrao de codigo passa | Automatizado | raiz -> `pnpm lint` |
| Interface se adapta a telas menores | Manual | `/` -> redimensionar navegador |
| Usuario inicia e encerra captura | Manual | `/` -> painel `Sua transmissao` -> `Compartilhar tela` |
| Proximas etapas estao registradas | Revisao documental | `docs/ROADMAP.md` |

## Riscos observados

- captura com audio varia por navegador e sistema operacional;
- Electron e mobile exigirao configuracoes nativas proprias;
- a sessao GitHub encontrada pertence a uma conta corporativa diferente da conta solicitada.
- franquias gratuitas podem mudar e devem ser verificadas antes de cada lancamento.

## Validacoes executadas

| Verificacao | Resultado |
| --- | --- |
| `pnpm install` | Aprovado com 3 projetos do workspace |
| `pnpm check` | Aprovado com TypeScript e Vite 8.2.1 |
| `pnpm lint` | Aprovado sem ocorrencias |
| Conteudo e ausencia de overlay de erro | Aprovado no Chrome automatizado |
| Troca de canal, envio local e silenciar microfone | Aprovado no navegador automatizado |
| Captura de tela | Implementada; seletor nativo exige QA manual pelo usuario |
| Layout desktop | Aprovado visualmente em 1264 x 633 |
| Repositorio privado e identidade Git | Aprovado em `pedrovictorpina/darkcord` |

Evidencia visual: [cliente web da fundacao](../evidencias/00-fundacao-desktop.png).
