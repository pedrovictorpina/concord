# QA manual - Varias telas ao mesmo tempo

O Playwright roda no modo demonstracao, que simula apenas a tela do proprio usuario. Varias
transmissoes ao mesmo tempo so aparecem com contas reais em um canal de voz do LiveKit.

## Pre-requisitos

- Supabase configurado em `apps/web/.env.local` e Edge Function `livekit-token` publicada.
- Tres contas (A, B e C) membros do mesmo servidor, em navegadores ou perfis separados, no
  desktop (compartilhar tela nao existe em PWA movel).
- Um canal de voz no servidor.

## 1. Duas telas ao mesmo tempo

1. A, B e C entram no mesmo canal de voz.
2. A clica em TELA, escolhe uma qualidade e compartilha uma janela.
3. B faz o mesmo com outra janela.
4. Esperado em C: as duas transmissoes aparecem lado a lado, cada uma com o rotulo
   `<APELIDO> · TRANSMITINDO`, e a nota `2 telas sendo transmitidas agora.`
5. Esperado em A: ve a propria tela com o rotulo `SUA TELA · TRANSMITINDO` e a de B ao lado.

## 2. Destaque e tela cheia

1. Em C, clique em DESTACAR na transmissao de B.
2. Esperado: a tela de B ocupa a area principal e a de A vira miniatura na linha de baixo. O
   botao muda para GRADE e volta ao estado anterior ao ser clicado.
3. Clique em TELA CHEIA na transmissao destacada.
4. Esperado: o video abre em tela cheia; `Esc` volta sem derrubar a chamada nem a outra tela.

## 3. Encerrar uma transmissao

1. A clica em TELA (agora como parar) no dock.
2. Esperado em B e C: apenas a transmissao de A some; a de B continua rodando.
3. B fecha a aba sem sair da chamada primeiro.
4. Esperado em C: a transmissao de B some junto com o participante, sem sobrar video congelado.

## 4. Botao TELA nao troca de dono

1. Com apenas B transmitindo, olhe o dock em C.
2. Esperado: o botao TELA continua disponivel para C iniciar a propria transmissao (antes ele
   aparecia como parar, porque o estado de transmissao era do canal e nao da pessoa).

## 5. Temas e mobile

1. Repita o passo 1 nos temas `concord`, `ios` e `brutal`, nos modos claro e escuro.
2. Abra o canal em viewport de 390px com duas telas ativas.
3. Esperado: as transmissoes empilham em uma coluna, sem rolagem horizontal, e os botoes ficam
   apenas com o icone.
