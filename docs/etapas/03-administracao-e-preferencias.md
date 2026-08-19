# Administração e preferências

## Objetivo

Completar o uso cotidiano do servidor sem introduzir cargos complexos no MVP.

## Entregue nesta iteração

- central de configurações com perfil, aparência, servidor, canais, notificações e permissões;
- edição de apelido, identificador e foto de perfil por upload (JPG, PNG ou WEBP até 2 MB), com URL como alternativa;
- temas Concord Neo, iOS Glass e Brutal Signal, com modos sistema, claro e escuro;
- proprietário cria, edita e remove canais de texto e voz;
- proprietário altera nome e descrição do servidor;
- preferência individual para silenciar um servidor;
- indicador persistente de mensagens não lidas e menções `@identificador`, mantido entre dispositivos;
- controles independentes de microfone e áudio recebido na chamada.
- convite por link revogável, com aceite explícito;
- cargos de proprietário, moderador e membro; permissões de leitura, escrita e voz por canal.
- mensagens privadas entre amigos confirmados, isoladas por RLS e atualização em tempo real.
- moderação de membros: banimento, timeout e bloqueios de microfone e áudio; pessoas banidas não retornam por convite.
- manifesto e service worker básicos para instalação como PWA.

## Próximos itens desta frente

- [ ] notificação push após configurar chaves VAPID e aplicativos instaláveis;
- [ ] aplicar bloqueios de microfone e áudio no servidor de mídia LiveKit após sua ativação;
- [ ] validar a moderação com duas contas autenticadas no ambiente remoto.

## Critérios de aceite

- um proprietário pode administrar múltiplos canais de cada tipo;
- moderadores administram canais, mas não configurações, cargos ou convites;
- um membro sem permissão não lê, escreve ou entra na voz do canal bloqueado;
- silenciar um servidor impede novos alertas locais daquele servidor;
- os estilos permanecem após recarregar a página;
- desligar o áudio recebido não altera o estado do microfone.

## Teste e QA

- automático: `pnpm build`, `pnpm lint` e `pnpm test:e2e`;
- navegação: demonstração local → engrenagem → Tema/Canais/Notificações;
- integração remota pendente: validar duas contas autenticadas, incluindo convite por link e bloqueio de canal.
