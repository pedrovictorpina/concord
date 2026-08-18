# ADR 0007 - Comunidades privadas por membresia

- Estado: aceita
- Data: 2026-08-18

## Contexto

O primeiro recorte de comunidades precisa permitir servidores e mensagens reais sem tornar os dados navegaveis por qualquer conta autenticada. A aplicacao deve permanecer simples, com um canal inicial previsivel e sem um backend proprio.

## Decisao

Cada comunidade possui um proprietario e membros explicitamente registrados em `server_members`. O banco cria automaticamente a associacao de proprietario e o canal de texto `#geral` no momento da criacao do servidor.

As tabelas de comunidades, membros, canais e mensagens ficam protegidas por RLS. Leitura e participacao dependem da membresia; a criacao de mensagens tambem exige que o autor seja o usuario autenticado. A tabela `messages` participa de `supabase_realtime`, para que membros recebam novas mensagens sem recarregar a pagina.

## Consequencias

- uma conta sem convite ou associacao nao consegue enumerar comunidades, canais ou mensagens privadas;
- o fluxo de convite passa a ser a extensao natural para adicionar novos membros;
- o canal `#geral` evita uma comunidade vazia para quem acabou de cria-la;
- a interface deve remover assinaturas Realtime ao trocar de tela para nao manter conexoes desnecessarias;
- cargos, permissoes granulares e moderacao continuam fora deste primeiro recorte.
