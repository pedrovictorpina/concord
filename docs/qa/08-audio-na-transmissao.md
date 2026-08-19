# QA manual - Audio junto com a transmissao de tela

O Playwright roda no modo demonstracao, sem LiveKit: nao existe outro lado para ouvir. O som da
transmissao so pode ser conferido com duas contas reais.

## Pre-requisitos

- Duas contas (A e B) membros do mesmo servidor, em maquinas ou navegadores diferentes, no
  desktop e no Chrome ou Edge (Firefox e Safari nao oferecem audio de tela).
- Uma fonte de som previsivel: um video no YouTube, um jogo, uma musica.
- Fone de ouvido em A, para o microfone de A nao captar o som que o proprio A esta transmitindo.

## 1. Som chega para quem assiste

1. A e B entram no mesmo canal de voz.
2. A clica em TELA, escolhe a qualidade e, na janela do navegador, escolhe uma **aba** com som e
   **marca "Compartilhar audio da guia"**.
3. Toque o som na aba compartilhada.
4. Esperado em B: ve a tela e ouve o som. O rotulo da transmissao mostra
   `<APELIDO> · TRANSMITINDO · COM SOM`.
5. Esperado em A: nao ouve a propria transmissao (sem eco) e o rotulo mostra `SUA TELA`.

## 2. Tela inteira com audio do sistema

1. A para a transmissao e compartilha de novo, agora escolhendo **Tela inteira** e marcando
   "Compartilhar audio do sistema".
2. Esperado em B: o som do sistema de A chega junto com a imagem.

## 3. Compartilhar sem audio

1. A compartilha uma janela (o Chrome nao oferece audio para janela) ou desmarca a caixa de audio.
2. Esperado em A: o dock mostra o aviso `Sua tela foi compartilhada sem som. Marque "Compartilhar
   audio"...`, e a transmissao continua indo normalmente.
3. Esperado em B: a tela aparece sem o sufixo `COM SOM` e sem som.

## 4. Controle de audio

1. Com o som rolando, B clica em ÁUDIO no dock.
2. Esperado: o som da tela e a voz silenciam juntos, e o microfone de B e mutado junto (regra da
   etapa 07). Religar devolve os dois.

## 5. Autoplay bloqueado

1. Em B, abra o Concord em uma aba nova e entre no canal sem interagir com a pagina antes.
2. Esperado: se o navegador bloquear a reproducao, aparece o botao `Tocar o som da chamada` no
   dock; clicar nele libera a voz e o som das telas.

## 6. Varias telas com som

1. A e B transmitem ao mesmo tempo, ambos com audio.
2. Esperado em uma terceira conta C: as duas telas aparecem na grade e os dois sons chegam. Vale
   registrar aqui se a mistura fica confusa na pratica - pode virar o caso de mutar uma tela
   especifica, que ainda nao existe.
