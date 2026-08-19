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

## 4. Aplicativos nativos

- Windows: Electron, instalador, atualização e áudio de sistema quando suportado.
- Android: React Native/Expo Development Build e MediaProjection para tela.
- iOS: React Native/Expo Development Build e ReplayKit Broadcast Extension para tela.
- Critério de aceite: a captura nativa respeita as permissões do sistema e publica a tela via LiveKit.
- Teste: builds em dispositivo físico; teste de entrada, microfone, tela e encerramento em cada plataforma.
- QA: instalar o aplicativo → entrar em voz → iniciar compartilhamento → encerrar pelo seletor do sistema.
