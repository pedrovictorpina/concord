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
- [x] Mensagens privadas entre amigos confirmados
- [x] Moderacao basica: banimento, timeout e restricoes de microfone/audio
- [ ] Edicao, exclusao e respostas
- [x] Home de amigos no formato do Discord, com presenca online e conversas diretas
- [x] Cargos e permissoes pela lista de membros, com transferencia de propriedade
- [x] Convidar pessoa que ainda nao e amiga, com busca de perfis no proprio dialogo
- [x] Menu de contexto por pessoa, com volume individual e acoes de moderacao
- [ ] Nao lidas por canal revisadas: leitura confiavel, badge por servidor e mencao sem falso positivo
- [ ] Servidor publico ou privado, com descoberta de servidores publicos
- [x] Menu do servidor no cabecalho com cargos, notificacoes, marcar como lido e sair do servidor

## Etapa 03 - Voz e compartilhamento

- [x] Edge Function versionada para emissao segura de tokens
- [ ] Configurar projeto LiveKit Cloud e segredos no Supabase
- [x] Entrada e saida de canais de voz
- [x] Presenca de voz compartilhada entre membros do servidor
- [x] Conexao de voz persistente ao navegar entre canais e servidores
- [x] Silenciar microfone
- [x] Compartilhar tela ou janela
- [x] Assistir varias telas ao mesmo tempo, com destaque e tela cheia por transmissao
- [ ] Audio do sistema no Windows (captura publicada junto com a tela; falta validar com duas contas)
- [x] Seletor de qualidade automatica, alta, media e baixa antes da transmissao
- [ ] Ajuste dinamico de qualidade e perfis 720p/1080p com 15/30 FPS
- [x] Parar de ver uma transmissao especifica, sem sair da chamada
- [x] Controles de voz e chat dentro da tela do canal de voz
- [ ] Reconexao e encerramento automatico
- [ ] Oferecer reconexao ao canal de voz depois de recarregar a pagina
- [x] Tela transmitida deve levar so o audio do dispositivo, sem o retorno da propria chamada
- [x] Supressao de ruido, cancelamento de eco e teste de microfone nas preferencias de voz
- [ ] Aplicar restrições de moderação também no servidor de mídia LiveKit

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
- [x] Radix UI como base de componentes acessiveis do front
- [ ] Acessibilidade e navegacao por teclado
- [ ] Observabilidade sem registrar conteudo privado
- [ ] Limites de uso e protecao contra abuso
- [ ] Painel de consumo e bloqueios antes das franquias gratuitas
- [ ] Politica de privacidade e termos
- [ ] Beta fechado
