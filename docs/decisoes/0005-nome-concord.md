# ADR 0005 - Nome Concord

## Estado

Aceita em 2026-08-17.

## Contexto

`Darkcord` foi usado como nome temporario durante a fundacao. Antes de consolidar contas, URLs, pacotes e persistencia local, o produto recebeu o nome Concord.

## Decisao

Adotar `Concord` como nome do produto e `concord` como identificador tecnico.

Isso inclui:

- marca exibida na interface;
- nomes dos pacotes `@concord/*`;
- familia visual `concord`;
- chave local `concord.theme.v1`;
- repositorio `pedrovictorpina/concord`;
- projeto gerenciado no Supabase.

## Consequencias

- referencias ao codinome anterior deixam de ser criadas;
- o historico Git permanece intacto;
- instalacoes anteriores perdem apenas a preferencia visual local, que volta ao modo do sistema;
- evidencias visuais da Etapa 01 precisam refletir a nova marca.
