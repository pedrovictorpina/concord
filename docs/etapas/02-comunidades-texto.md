# Etapa 02 - Comunidades e texto

## Objetivo

Transformar o workspace de demonstracao em um servidor real: cada usuario podera criar seu servidor, tornar-se membro automaticamente, navegar por seus canais de texto e trocar mensagens persistentes em tempo real.

## Recorte inicial

- criar servidor com nome e descricao curta;
- criar o membro proprietario e o canal `geral` automaticamente;
- listar somente os servidores e canais em que o usuario autenticado e membro;
- enviar, carregar e receber mensagens de texto em tempo real;
- versionar a base para solicitacoes de amizade e amizade aceita;
- preservar o modo demonstracao quando o Supabase nao estiver configurado ou quando o usuario optar por explora-lo.

Edicao/exclusao de mensagens, cargos e moderacao ficam nos proximos recortes desta mesma etapa.

## Modelo de dados

```text
profiles
  -> friend_requests -> friendships
  -> servers -> server_members -> channels -> messages
```

As tabelas expostas usam RLS. A leitura de servidores, membros, canais e mensagens exige ser membro do servidor; a criacao de mensagens exige que o autor seja o usuario autenticado e membro do canal.

## Criterios de aceite

| Criterio | Modo de teste | Caminho de QA |
| --- | --- | --- |
| Usuario sem servidor ve estado inicial claro | Playwright/manual | entrar -> workspace -> criar servidor |
| Criar servidor cria membro proprietario e canal `geral` | Integracao remota | criar servidor -> consultar dados -> abrir `# geral` |
| Apenas membros leem canais e mensagens | Integracao remota/RLS | usuario A cria -> usuario B consulta sem associacao |
| Membro envia mensagem persistente | Integracao/visual | `# geral` -> escrever -> enviar |
| Outra sessao membro recebe mensagem sem recarregar | Integracao Realtime/manual | duas sessoes -> `# geral` -> enviar |
| Modo demonstracao continua navegavel | Playwright | login -> explorar demonstracao |
| Amizades respeitam remetente e destinatario | Integracao remota/RLS | usuario A solicita -> usuario B aceita |

## Riscos

- Postgres Changes aplica RLS por assinante; canais devem ser removidos ao desmontar a interface para nao consumir conexoes desnecessarias;
- mensagens em tempo real exigem a tabela na publicacao `supabase_realtime`;
- esta primeira entrega nao abre comunidade publica nem permite busca global de usuarios;
- a interface de amizade depende do fluxo de comunidade estar estavel e sera entregue no proximo recorte.

## Implementacao concluida neste recorte

- migration versionada para amizades, comunidades, membros, canais e mensagens;
- RLS por membro de comunidade, com funcoes auxiliares `is_server_member` e `is_server_owner`;
- gatilho que cria a associacao do proprietario e o canal `#geral` junto do servidor;
- criacao de comunidade na interface autenticada e preservacao do modo demonstracao;
- carregamento de comunidades, canais e historico de mensagens do usuario;
- envio de mensagens persistentes e assinatura Realtime, com cancelamento da assinatura ao sair da tela;
- contrato compartilhado para resumos de comunidade e mensagem;
- correcao complementar de RLS para permitir que o criador receba o servidor retornado pelo `insert`.
- janela unica para buscar usuarios por `@identificador`, enviar e aceitar pedidos de amizade e listar amigos;
- convites diretos e privados para servidores, aceitos pelo destinatario antes de criar a membresia.

## Validacoes executadas

- `pnpm check`;
- `pnpm lint`;
- `pnpm test:e2e`;
- teste de integracao remoto para RLS e Realtime;
- `supabase db push --dry-run`;
- `supabase db lint --linked --level warning`.

Resultado: build e lint aprovados; seis jornadas Playwright aprovadas; integracao remota aprovou criacao do servidor, membro proprietario, canal `#geral`, isolamento antes da associacao, leitura apos a associacao, Realtime e amizade aceita. As migrations foram aplicadas ao projeto remoto. O ambiente local executou a integracao com Node 20 e exibiu apenas o aviso de descontinuacao do runtime; o projeto continua declarando Node 22 como versao esperada.

## Pendencias do proximo recorte

- edicao, exclusao, respostas e paginacao de mensagens;
- cargos, permissoes e moderacao.
