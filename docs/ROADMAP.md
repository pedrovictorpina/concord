# Roadmap

O roadmap representa ordem de implementacao, nao datas prometidas. Cada etapa deve possuir documento proprio, criterios de aceite e evidencias de validacao.

## Etapa 00 - Fundacao

- [x] Definir stack e limites do MVP
- [x] Criar monorepo e cliente web
- [x] Criar linguagem visual inicial
- [x] Validar captura de tela no navegador
- [x] Definir processo de documentacao
- [x] Definir modo de operacao com custo zero
- [x] Publicar o repositorio na conta GitHub pessoal

## Etapa 01 - Identidade

- [x] Projeto Supabase Hosted e ambiente local
- [x] Migration inicial versionada no repositorio
- [x] Arquitetura de temas e modos sistema/claro/escuro
- [x] Cadastro por nickname, e-mail e senha
- [x] Login, logout e restauracao de sessao
- [x] Recuperacao e atualizacao de senha no cliente
- [x] Perfil e identificador unico
- [x] Politicas RLS e testes de autorizacao
- [x] Validacao do link de recuperacao com e-mail real

## Etapa 02 - Comunidades e texto

- [x] Planejar contratos, RLS e criterios de aceite
- [x] Solicitacoes e lista de amigos
- [x] Criacao de servidores
- [x] Convites para servidores
- [x] Canais de texto
- [x] Mensagens em tempo real
- [x] Administração de canais de texto e voz pelo proprietário
- [x] Configurações de perfil, servidor, temas e silenciamento individual
- [x] Upload de foto de perfil no Supabase Storage
- [x] Convites para servidor por link revogável
- [x] Contadores persistentes de mensagens não lidas e menções
- [x] Cargos de moderador e permissões básicas por canal
- [ ] Edicao, exclusao e respostas
- [ ] Cargos e moderacao basica

## Etapa 03 - Voz e compartilhamento

- [x] Edge Function versionada para emissao segura de tokens
- [ ] Configurar projeto LiveKit Cloud e segredos no Supabase
- [x] Entrada e saida de canais de voz
- [x] Silenciar microfone
- [x] Compartilhar tela ou janela
- [ ] Audio do sistema no Windows
- [x] Seletor de qualidade automatica, alta, media e baixa antes da transmissao
- [ ] Ajuste dinamico de qualidade e perfis 720p/1080p com 15/30 FPS
- [ ] Reconexao e encerramento automatico

## Etapa 04 - Aplicativos

- [x] Base PWA instalável para web e desktop
- [ ] Electron para Windows
- [ ] Instalador e atualizacao do Windows
- [ ] React Native/Expo para Android e iOS
- [ ] MediaProjection no Android
- [ ] ReplayKit Broadcast Extension no iOS
- [ ] Notificacoes push (depende de VAPID e aplicativos instaláveis)

## Etapa 05 - Qualidade e lancamento

- [ ] Testes de jornada completa
- [ ] Acessibilidade e navegacao por teclado
- [ ] Observabilidade sem registrar conteudo privado
- [ ] Limites de uso e protecao contra abuso
- [ ] Painel de consumo e bloqueios antes das franquias gratuitas
- [ ] Politica de privacidade e termos
- [ ] Beta fechado
