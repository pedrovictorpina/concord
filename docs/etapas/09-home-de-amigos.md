# Etapa 09 - Home de amigos no formato do Discord

## Objetivo

Abrir o Concord na tela de amigos e aproximar essa tela do que o usuario ja conhece do Discord:
lista de conversas a esquerda, abas de amigos no centro e quem esta em chamada a direita.

## Antes

- ao abrir, o cliente selecionava o primeiro servidor da lista (`nextServers[0]`), entao a home
  so aparecia ao clicar no icone inicial;
- a home era uma coluna unica com duas abas (Amigos e Convites), um cartao de resumo e uma lista
  sem estado de presenca;
- nao havia lista de conversas diretas fora da propria lista de amigos;
- `PersonSummary` nao carregava avatar, entao toda a tela usava iniciais.

## Depois

- `activeServerId` comeca nulo e so muda por escolha explicita: abrir o app cai na home, tanto no
  modo real quanto no de demonstracao;
- `HomeSidebar` traz busca de conversa, os atalhos Amigos e Solicitacoes com contador, a lista de
  mensagens diretas com bolinha de status e o rodape de identidade com atalho de configuracoes;
- `FriendsHome` passou a ter as abas Disponivel, Todos, Pendente e Adicionar amigo, com busca,
  contagem no formato `DISPONIVEL - N`, acoes de mensagem e menu por pessoa;
- a aba Adicionar amigo traz o formulario por identificador direto na tela, sem abrir dialogo;
- a coluna `Ativo agora` lista os amigos que estao em uma chamada, com servidor e canal;
- `useFriendPresence` publica presenca em um canal Realtime unico (`presence:concord`) com o
  estado e o canal de voz atual, e no modo demonstracao devolve presenca simulada;
- `PersonSummary` ganhou `avatarUrl`, carregado nas consultas de amizades, pedidos, convites e
  membros.

## Consequencias

- a presenca online e visivel para qualquer pessoa autenticada que assine o canal, nao apenas
  para amigos; a interface so mostra amigos, mas o dado trafega para todos. Se isso incomodar,
  o passo seguinte e trocar o canal unico por um canal por amizade;
- cada cliente conectado soma uma conexao Realtime, que e uma franquia do plano gratuito;
- no celular a coluna de conversas e a de `Ativo agora` ficam ocultas: a home continua sendo a
  lista de amigos, alcancada pela barra inferior.

## Validacoes

- `pnpm check`, `pnpm lint`, `pnpm test:e2e` 21/21 (jornadas de home, mensagem privada e fluxo
  movel reescritas para a nova tela);
- captura da home no modo demonstracao conferida em 1440x860.
