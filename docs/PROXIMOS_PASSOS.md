# Próximos passos

Esta lista é a referência operacional do Concord. Ela separa o que já está publicado do que depende de infraestrutura externa ou de uma nova etapa de produto.

## 1. Ativar voz multiusuário real

- Dependência: criar o projeto LiveKit Cloud e cadastrar `LIVEKIT_URL`, `LIVEKIT_API_KEY` e `LIVEKIT_API_SECRET` nos segredos da Edge Function `livekit-token` do Supabase.
- Implementação restante: publicar a Edge Function configurada e aplicar as restrições de moderação também no servidor de mídia, não apenas no cliente.
- Critério de aceite: duas contas autenticadas entram no mesmo canal, ouvem uma à outra e recebem/reproduzem o compartilhamento de tela no desktop.
- Teste: integração remota com duas contas QA; confirmar que não membro recebe `403` ao solicitar token.
- QA: criar dois usuários → entrar no mesmo servidor → abrir canal de voz → entrar → ativar microfone → compartilhar uma janela no desktop.

## 2. Finalizar a experiência web e PWA

- Implementação restante: edição, exclusão e respostas de mensagens; refinamento contínuo da navegação móvel; reconexão de voz e encerramento automático de chamada.
- Critério de aceite: nenhuma tela branca após atualização; a navegação móvel permite acessar mensagens, canais, perfil e configurações sem rolagem horizontal.
- Teste: Playwright em desktop e viewport 390×844, mais teste manual de atualização/instalação PWA.
- QA: abrir o domínio de produção no celular → instalar PWA → alternar entre Mensagens, Canais e Você → atualizar a página.

## 3. Notificações e limites do plano gratuito

- Dependência: gerar chaves VAPID e manter o aplicativo instalável em HTTPS.
- Implementação restante: notificações push de mensagem/menção e painel de consumo com bloqueios antes das franquias do Supabase e LiveKit.
- Critério de aceite: usuário pode optar por receber notificação e o produto impede novas transmissões antes de exceder uma franquia.
- Teste: teste manual em PWA instalado e teste automatizado do cálculo de limites.
- QA: configurações → Notificações → permitir; iniciar transmissão de teste até o limite configurado.

## 4. Administração, acesso e notificações do servidor

Pedidos registrados em 19/08/2026. Cada item traz o que já existe hoje, para a tarefa ser a lacuna real e não uma reimplementação.

### 4.1 Cargos e permissões pela lista de membros

- Hoje: `server_members.role` (`owner`/`moderator`/`member`) e `channel_permissions` já existem no banco, e a aba **Permissões** do `SettingsDialog` já permite ao dono trocar o cargo de um membro e ligar/desligar ler, escrever e falar por canal e por cargo.
- Implementação restante: expor isso onde a pessoa está — menu de contexto no `MemberPanel` (promover, rebaixar, expulsar, banir, silenciar) em vez de só na central de configurações; permitir que moderador administre canais, que o RLS já autoriza (`can_manage_channels`), mas o front bloqueia; tratar transferência de propriedade de verdade, porque hoje escolher `owner` para outra pessoa não move `servers.owner_id` e deixaria dois donos; permitir limpar uma permissão de canal e voltar ao padrão.
- Critério de aceite: dono e moderador administram um membro a partir da lista de membros, dentro do que o cargo permite, e a mudança aparece para os outros sem recarregar.
- Teste: integração com duas contas; conferir que moderador não consegue agir sobre dono nem sobre outro moderador.
- QA: abrir o servidor → painel de membros → clicar em um membro → alterar cargo → conferir o que ele passa a ver e a poder fazer.

### 4.2 Convidar sem exigir amizade

- Hoje: o diálogo **Convidar amigos** lista apenas `friendships`, e o campo de busca só filtra essa lista carregada. Convidar alguém de fora existe só como formulário por `@username` exato no `PeopleDialog`, visível apenas para o dono. O link de convite já funciona para qualquer pessoa.
- Implementação restante: busca de perfis no banco (por apelido ou identificador, parcial) dentro do próprio diálogo de convite, com o resultado convidável direto; liberar convite para moderador, hoje barrado pela política `owners can send server invites`; expor validade e limite de usos na criação do link, colunas que já existem e ficam sempre nulas; usar `inspect_server_invite_link` para o convidado ver de qual servidor é o link antes de aceitar.
- Critério de aceite: convidar alguém que nunca foi amigo, sem sair do diálogo de convite, e o convidado entra pelo aceite explícito.
- Teste: integração com uma conta não amiga; conferir que pessoa banida continua recusada.
- QA: servidor → Convidar → buscar por identificador → convidar → aceitar na outra conta.

### 4.3 Canal de texto só notifica mensagem não lida

- Hoje: `unreadByChannel` conta mensagens e menções por canal, ignora o canal aberto, o próprio autor e servidor silenciado; o badge aparece na lista de canais. Não existe notificação fora da interface.
- Implementação restante: revisar quando o canal é considerado lido — hoje `last_read_at` só é gravado ao trocar de canal, então o canal aberto em segundo plano pode reabrir com contagem indevida; badge de não lidas também na barra de servidores, que hoje não recebe esse estado e só escuta o servidor ativo no Realtime; menção por tabela em vez de `ilike '%@usuario%'`, que hoje casa `@ana` dentro de `@anabela`; preferência por canal (tudo, só menções, nada).
- Critério de aceite: um canal só sinaliza quando existe mensagem que a pessoa ainda não leu, e abrir o canal limpa o sinal em qualquer aba.
- Teste: Playwright no modo demonstração para o badge, mais integração com duas contas para o estado de leitura.
- QA: duas contas em canais diferentes → enviar mensagem → conferir badge → abrir o canal → conferir que zera e não volta ao recarregar.

### 4.4 Servidor público ou privado

- Hoje: não existe visibilidade. `servers` tem `id`, `owner_id`, `name`, `description`, `icon_url`; o RLS deixa tudo privado (`owner_id = auth.uid() or is_server_member(id)`) e a interface já escreve "SERVIDOR PRIVADO" fixo. Entrar só por convite direto ou por link.
- Implementação restante: coluna de visibilidade em `servers` com migration e política de leitura para servidor público; campo em `ServerSummary`, na criação do servidor e na aba Servidor das configurações; entrada em servidor público sem convite; tela de descoberta, que não existe — o "Explorar" da tela de entrada é só o modo demonstração.
- Critério de aceite: o dono escolhe público ou privado; servidor privado continua invisível para quem não é membro.
- Teste: integração cobrindo leitura por não membro nos dois estados.
- QA: criar servidor público → sair da conta → entrar com outra → localizar e entrar sem convite.

### 4.5 Menu do servidor na setinha ao lado do nome — FEITO em 19/08/2026

- Entregue: o cabeçalho inteiro virou o gatilho do menu (nome + seta), e o menu reúne convidar pessoas, configurações do servidor, cargos e permissões, criar canal de texto ou voz (dono e moderador), silenciar ou reativar notificações, marcar como lido e sair do servidor. A linha de apoio mostra o papel de quem está lendo.
- Restante: privacidade do servidor depende do item 4.4.
- Critério de aceite: as ações do servidor ficam alcançáveis pelo cabeçalho, e cada item some para quem não tem o cargo necessário.
- Teste: Playwright no modo demonstração para abertura, navegação por teclado e fechamento.
- QA: clicar no nome do servidor → conferir os itens por cargo (dono, moderador, membro).

### 4.6 Reconectar a voz depois de recarregar

- Hoje: recarregar a pagina derruba a chamada sem deixar rastro. `useVoiceSession` guarda o alvo
  em estado do React, entao o canal, o servidor e a propria conexao somem no reload.
- Implementacao restante: lembrar o ultimo canal de voz em `sessionStorage` e, ao voltar,
  perguntar se a pessoa quer reconectar em vez de entrar sozinho; expirar a oferta depois de
  alguns minutos e limpar o registro quando a saida for explicita.
- Criterio de aceite: recarregar durante uma chamada oferece a reconexao, e recusar nao deixa
  resto de estado.
- Teste: Playwright no modo demonstracao para a oferta; integracao com duas contas para a volta
  real ao canal.
- QA: entrar em voz -> recarregar -> aceitar -> conferir que a outra conta ve a volta.

### 4.7 Supressao de ruido no microfone

- Hoje: o microfone e publicado com as opcoes padrao do navegador. Nao ha ajuste na interface nem
  teste de microfone.
- Implementacao restante: controle de supressao de ruido, cancelamento de eco e ganho automatico
  nas preferencias de voz, aplicado na publicacao do microfone; medidor para testar a captura.
  A supressao usada e a do proprio navegador (`noiseSuppression` do getUserMedia) - filtros de
  terceiros como o Krisp do Discord sao licenciados e ficam fora do modo custo zero.
- Criterio de aceite: alternar a supressao muda a captura sem derrubar a chamada, e a escolha
  sobrevive a proxima entrada em um canal.
- Teste: Playwright para o controle e a persistencia; conferencia manual do efeito no audio.
- QA: entrar em voz -> abrir preferencias de voz -> alternar supressao -> falar com ruido de fundo
  e confirmar com a outra conta.

## 5. Aplicativos nativos

- Windows: Electron, instalador, atualização e áudio de sistema quando suportado.
- Android: React Native/Expo Development Build e MediaProjection para tela.
- iOS: React Native/Expo Development Build e ReplayKit Broadcast Extension para tela.
- Critério de aceite: a captura nativa respeita as permissões do sistema e publica a tela via LiveKit.
- Teste: builds em dispositivo físico; teste de entrada, microfone, tela e encerramento em cada plataforma.
- QA: instalar o aplicativo → entrar em voz → iniciar compartilhamento → encerrar pelo seletor do sistema.
