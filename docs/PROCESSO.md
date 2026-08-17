# Processo de documentacao

Cada entrega funcional deve ser rastreavel no repositorio para permitir a continuidade em outro computador.

## Antes de implementar

1. Criar `docs/etapas/NN-nome-da-etapa.md`.
2. Registrar objetivo, dependencias, riscos e criterios de aceite.
3. Indicar como cada criterio sera testado e o caminho de navegacao usado no QA.
4. Criar ou atualizar uma decisao em `docs/decisoes/` quando houver escolha arquitetural relevante.

## Durante a implementacao

1. Manter a alteracao limitada ao objetivo da etapa.
2. Registrar desvios ou decisoes novas no documento da etapa.
3. Nunca versionar senhas, tokens ou arquivos `.env`.

## Antes de publicar

1. Registrar como o projeto estava antes.
2. Registrar como ficou depois da alteracao.
3. Relacionar o resultado ao que foi solicitado.
4. Anotar os comandos de validacao e seus resultados.
5. Atualizar `docs/PROGRESSO.md` e `docs/ROADMAP.md`.
6. Publicar por branch e pull request apos o commit inicial do repositorio.

## Convencoes Git

- Branches de trabalho: `codex/<descricao-curta>`.
- Commits pequenos e com uma finalidade clara.
- Pull request descreve mudanca, motivo, impacto e validacoes.
- `main` deve permanecer executavel.
