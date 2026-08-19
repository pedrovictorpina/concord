# QA manual - Presenca de voz e sessao persistente

Nao existe forma de validar presenca multiusuario automaticamente: o Playwright roda no modo
demonstracao, sem Supabase e sem LiveKit. O roteiro abaixo cobre o que so aparece com duas
contas reais no mesmo servidor.

## Pre-requisitos

- Supabase configurado em `apps/web/.env.local` e Edge Function `livekit-token` publicada com
  `LIVEKIT_URL`, `LIVEKIT_API_KEY` e `LIVEKIT_API_SECRET`.
- Duas contas (A e B) membros do mesmo servidor, cada uma em um navegador ou perfil separado.
- Um canal de voz e um canal de texto no servidor.

## 1. Presenca visivel entre contas

1. Conta A abre o canal de voz e clica em `Entrar na chamada de voz`.
2. Conta B, sem recarregar a pagina, olha a lista de canais.
3. Esperado: o canal de voz mostra `1` no contador e a conta A aparece abaixo dele com apelido,
   avatar e o rotulo `conectado`.
4. Conta B entra no mesmo canal.
5. Esperado: cada conta ve a outra na lista do canal e nos cartoes da tela do canal.

## 2. Microfone e fala

1. Conta A desliga o microfone no dock (`MIC`).
2. Esperado em B: a conta A fica esmaecida, com `sem microfone` e o icone `×`.
3. Conta A liga o microfone e fala.
4. Esperado em B: o cartao e a linha da conta A ganham destaque e o rotulo `falando` enquanto
   houver audio. O indicador de fala aparece somente para quem esta no mesmo canal.

## 3. Sessao persistente

1. Com A conectada, clique em um canal de texto.
2. Esperado: o dock de voz continua ancorado acima do perfil, com o nome do canal e do servidor;
   a conta A continua listada no canal de voz para A e para B.
3. Troque de servidor pela barra lateral.
4. Esperado: o dock continua e a conexao nao cai. Clicar no dock volta para o servidor e o canal
   da chamada.
5. Va para a tela inicial de mensagens.
6. Esperado: o dock aparece flutuando e a chamada segue ativa.

## 4. Segundo plano

1. Com A conectada e falando, mude para outra aba do navegador por dois minutos.
2. Esperado: o audio continua, o dock permanece ao voltar e a tela nao volta para
   `Sintonizando identidade...`. A conta A nunca desaparece da lista em B.
3. Repita bloqueando a tela do celular com o Concord aberto como PWA.
4. Esperado: em Android o audio segue enquanto o sistema nao encerrar o navegador; ao ser
   encerrado, a presenca cai em B em poucos segundos, sem participante fantasma.

## 5. Saida e queda

1. Conta A clica em `SAIR` no dock.
2. Esperado em B: a conta A sai da lista imediatamente.
3. Conta A entra novamente e fecha a aba sem sair da chamada.
4. Esperado em B: a conta A desaparece da lista quando o Realtime encerra a conexao.

## 6. Moderacao

1. Proprietario corta o microfone da conta A em `Configuracoes do servidor` > pessoas.
2. Conta A entra no canal de voz.
3. Esperado: A entra sem publicar audio, o botao `MIC` fica desabilitado e todos veem
   `sem microfone`.

## 7. Compartilhamento de tela

1. Conta A compartilha a tela pelo dock.
2. Esperado em B: a tela aparece no palco do canal e a linha da conta A mostra
   `compartilhando tela` com o icone `▣`.
3. Conta A navega para um canal de texto sem parar a transmissao.
4. Esperado: o dock mostra o icone de transmissao e B continua recebendo a tela.
