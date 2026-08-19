# Arquitetura

## Stack aprovada

| Area | Tecnologia | Responsabilidade |
| --- | --- | --- |
| Linguagem | TypeScript | Linguagem principal dos clientes e funcoes de apoio |
| Web | React + Vite | Cliente acessado pelo navegador |
| Componentes de interface | Radix UI | Primitivos acessíveis para diálogos, menus, tooltips e controles sem impor estilo visual |
| Windows | Electron | Captura confiavel de tela, janela e audio do sistema |
| Mobile | React Native + Expo Development Build | Android e iOS com integracoes nativas |
| Dados | Supabase Postgres | Dados relacionais e regras de acesso |
| Autenticacao | Supabase Auth | Cadastro, login e sessoes |
| Eventos | Supabase Realtime | Mensagens, presenca e indicadores temporarios |
| Midia | LiveKit | Voz e compartilhamento de tela via WebRTC/SFU |

## Temas da interface

A interface usa tokens semanticos e separa familia visual de modo de cor. O tema `concord` oferece claro e escuro; o modo padrao `system` acompanha `prefers-color-scheme`. Novas familias, como iOS e neo-brutalismo, entram pelo registro de temas sem alterar a logica dos componentes.

Detalhes e consequencias estao no [ADR 0004](decisoes/0004-arquitetura-de-temas.md).

## Componentes de interface

O front usa Radix Primitives (pacote único `radix-ui`) para o comportamento acessível de diálogos, menus, abas, tooltips, seletores, checkboxes, avatares e toasts. Os componentes permanecem sem estilo visual imposto: o CSS e os tokens semânticos existentes do Concord continuam sendo a única fonte de aparência e temas.

Os primitivos ficam encapsulados em `apps/web/src/components/ui/` (`Modal`, `Choice`, `Toggle`, `Avatar`, `Hint`, `ErrorToast`). Antes de criar um controle novo, use o wrapper que já existe. Detalhes e consequências no [ADR 0008](decisoes/0008-radix-ui-como-base-de-componentes.md).

## Infraestrutura gerenciada

O Concord nao operara servidores proprios no MVP. Isso nao elimina o backend: transfere a operacao para provedores gerenciados.

| Necessidade | Servico gerenciado |
| --- | --- |
| Site web estatico | hospedagem de frontend/CDN |
| Identidade, banco, arquivos e eventos | Supabase Hosted |
| Logica privilegiada e tokens curtos | Supabase Edge Functions |
| Voz e tela compartilhada | LiveKit Cloud |
| Codigo, CI e instaladores | GitHub Actions e Releases |
| Push mobile | servicos gerenciados do Expo, FCM e APNs |

Funcoes serverless apenas autenticam, validam permissoes e emitem tokens. Audio e video conectam o cliente diretamente ao SFU do LiveKit Cloud e nunca atravessam uma Edge Function.

## Limites dos componentes

```text
Clientes
  -> Supabase Auth: identidade e sessao
  -> API/Dados: perfis, amigos, servidores, canais e mensagens
  -> Realtime: mensagens, presenca e digitacao
  -> Servico de token: autorizacao curta para entrar em salas
  -> LiveKit: microfone, audio remoto e compartilhamento de tela
```

O cliente nunca recebera chaves administrativas do Supabase ou do LiveKit. Tokens de sala serao emitidos por uma Edge Function gerenciada depois de validar se o usuario pertence ao canal.

Todas as migrations, funcoes e configuracoes reproduziveis ficarao no Git. Segredos serao configurados diretamente nos provedores e nunca versionados.

## Modo custo zero

Durante desenvolvimento e piloto fechado, o sistema deve permanecer dentro dos planos gratuitos e falhar por limite em vez de gerar cobranca.

- Supabase Free para Auth, Postgres, Realtime, Storage e Edge Functions;
- LiveKit Cloud Build, cuja franquia gratuita e um limite rigido;
- Cloudflare Pages Free para o cliente web;
- GitHub Free e Actions dentro da franquia da conta;
- sem dominio pago inicialmente;
- sem gravacao, egress, transcodificacao ou video de camera;
- compartilhamento padrao em 720p e 15 FPS;
- maximo inicial de 8 participantes por canal de voz e uma tela publicada por participante,
  todas assistiveis ao mesmo tempo;
- anexos pequenos e limites por usuario;
- alertas e revisao de consumo antes de abrir o piloto.

As franquias mudam com o tempo. Os numeros verificados em 2026-08-17 estao registrados no [ADR 0003](decisoes/0003-modo-custo-zero.md).

## Compartilhamento de tela

- Web: `getDisplayMedia`, limitado pelas permissoes do navegador.
- Windows: `desktopCapturer` do Electron, incluindo audio de loopback quando suportado.
- Android: MediaProjection e servico nativo durante a transmissao.
- iOS: ReplayKit Broadcast Extension; exige Development Build e configuracao nativa.
- Transporte: track identificada como compartilhamento de tela no LiveKit.

## Modelo inicial de dados

```text
profiles
friend_requests
friendships
servers
server_members
roles
channels
messages
invites
bans
```

Arquivos e avatares serao armazenados separadamente. Presenca e indicador de digitacao nao serao gravados como mensagens.

## Seguranca minima

- Row Level Security em todas as tabelas expostas;
- UUID como identidade interna; nickname pode mudar;
- nickname publico separado do identificador unico;
- senha nunca armazenada pela aplicacao;
- rate limiting em cadastro, login, convites e mensagens;
- permissoes explicitas para publicar voz e tela;
- Electron com isolamento de contexto, sandbox e Node desabilitado no renderer.
