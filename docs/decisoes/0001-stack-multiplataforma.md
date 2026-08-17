# ADR 0001 - Stack multiplataforma

- Estado: aceita
- Data: 2026-08-17

## Contexto

O Concord precisa funcionar na web, Windows, Android e iOS. O produto depende de comunicacao em tempo real, microfone, compartilhamento de tela e audio do sistema. Flutter foi descartado por preferencia do responsavel pelo produto.

## Decisao

Usar TypeScript como linguagem principal, React/Vite na web, Electron no Windows e React Native com Expo Development Build no mobile. Supabase cuidara de identidade e dados; LiveKit cuidara da midia.

## Motivos

- linguagem compartilhada entre os clientes;
- ecossistema maduro para interfaces de comunicacao;
- Electron fornece captura de desktop e audio do sistema de forma mais direta;
- React Native permite integracoes MediaProjection e ReplayKit;
- LiveKit evita construir e operar um SFU proprio no MVP.

## Consequencias

- Electron consome mais memoria que Tauri;
- web e mobile compartilham regras e tipos, mas nao toda a interface;
- o iOS exigira uma Broadcast Extension;
- modulos nativos impedem depender apenas do Expo Go;
- custos e limites dos servicos gerenciados devem ser acompanhados.
