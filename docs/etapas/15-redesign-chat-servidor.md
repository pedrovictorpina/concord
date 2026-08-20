# Concord — Etapa 15: Redesign do Canal de Voz

**Status:** Planejamento visual e técnico
**Referência visual:** mockup aprovado da Etapa 15
**Objetivo:** transformar os canais de voz em uma experiência moderna e imersiva, com participantes, compartilhamento de tela, chat e controles organizados em uma única sala.

---

# 1. Objetivo

O canal de voz deve deixar de parecer apenas uma lista de usuários conectados e passar a funcionar como uma verdadeira sala de chamada.

A prioridade deve ser:

```text
voz
+
participantes
+
quem está falando
+
compartilhamento de tela
+
controles
```

A experiência deve funcionar igualmente bem quando:

```text
ninguém compartilha tela
1 pessoa compartilha
2 pessoas compartilham
várias pessoas compartilham simultaneamente
```

---

# 2. Regra obrigatória sobre compartilhamento

Qualquer participante conectado ao canal pode compartilhar a própria tela.

Não deve existir conceito de:

```text
"apresentador único"
```

ou:

```text
"somente uma tela por canal"
```

A arquitetura desejada é:

```text
Canal de voz
│
├── Pedro
│   └── pode compartilhar tela
│
├── Juliane
│   └── pode compartilhar tela
│
├── Lucas
│   └── pode compartilhar tela
│
└── Beatriz
    └── pode compartilhar tela
```

Portanto:

```text
1 participante
=
até 1 transmissão desse participante

8 participantes
=
potencialmente até 8 transmissões simultâneas
```

considerando o limite atual do piloto.

---

# 3. Estado atual

A implementação já possui:

```text
LivePanel
VoiceDock
ScreenShareTile
```

e suporta:

* participantes;
* indicador de fala;
* microfone;
* áudio;
* compartilhamento;
* chat lateral;
* várias transmissões;
* foco em uma transmissão;
* volume independente por pessoa;
* volume independente por transmissão;
* mute de áudio da transmissão;
* fullscreen;
* parar de assistir uma transmissão.

Preservar tudo isso.

---

# 4. Estrutura principal sem transmissão

Quando ninguém estiver compartilhando:

```text
┌──────────────────────────────────────────────────────────────┐
│ 🔊 Geral                           8 participantes  Convidar │
│ Voz conectada · Excelente                                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│      Juliane       Pedro        Lucas        ana_dev         │
│       [avatar]     [avatar]     [avatar]      [avatar]       │
│                                                              │
│      Beatriz       Matheus      Rafael       Thiago          │
│       [avatar]     [avatar]     [avatar]      [avatar]       │
│                                                              │
│                Você está ouvindo                             │
│                                                              │
│       🎤       🎧       🖥        SAIR                        │
└──────────────────────────────────────────────────────────────┘
```

A grade de participantes é o foco principal.

---

# 5. Estrutura com UMA transmissão

Quando uma pessoa começa a transmitir, a interface deve mudar automaticamente.

A tela compartilhada vira o conteúdo principal:

```text
┌──────────────────────────────────────────────────────────────┐
│ 🔊 Geral                                      8 participantes│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                 TELA DE JULIANE                              │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐   │
│   │                                                      │   │
│   │                  compartilhamento                    │   │
│   │                                                      │   │
│   └──────────────────────────────────────────────────────┘   │
│                                                              │
│ [J] [P] [L] [A] [B] [M] [R] [T]                             │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│        🎤       🎧       🖥       SAIR                       │
└──────────────────────────────────────────────────────────────┘
```

Os participantes deixam de ocupar grande parte da tela e passam para uma faixa secundária.

---

# 6. Uma tela não remove os participantes

Mesmo quando uma tela estiver destacada, continuar mostrando:

* quem está na chamada;
* quem está falando;
* quem está mutado;
* quem está compartilhando;
* estado do próprio usuário.

Não transformar o canal em um simples player de vídeo.

---

# 7. DUAS transmissões simultâneas

Quando duas pessoas compartilharem:

```text
┌───────────────────────────┬───────────────────────────┐
│                           │                           │
│     Tela de Juliane       │       Tela de Pedro      │
│                           │                           │
└───────────────────────────┴───────────────────────────┘

[J] [P] [L] [A] [B] [M] [R] [T]
```

As telas podem ocupar metade do palco cada.

---

# 8. TRÊS ou QUATRO transmissões

Usar grade:

```text
┌──────────────────────┬──────────────────────┐
│ Tela de Juliane      │ Tela de Pedro        │
│                      │                      │
├──────────────────────┼──────────────────────┤
│ Tela de Lucas        │ Tela de Beatriz      │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

A proporção deve favorecer legibilidade do conteúdo.

---

# 9. Mais de QUATRO transmissões

Não tentar espremer oito transmissões pequenas simultaneamente.

Utilizar:

```text
transmissão destacada
+
bandeja de transmissões
```

Exemplo:

```text
┌──────────────────────────────────────────────┐
│                                              │
│            Tela destacada                    │
│                                              │
└──────────────────────────────────────────────┘

[Tela Pedro] [Tela Lucas] [Tela Ana] [Tela Bia] [→]
```

---

# 10. Seleção de transmissão

Clicar em uma transmissão deve permitir:

```text
Destacar
```

A transmissão selecionada ocupa o palco principal.

As demais ficam em uma bandeja.

O comportamento atual de `focusedShareId` deve ser reaproveitado.

---

# 11. Sair do foco

O usuário deve conseguir voltar para:

```text
Grade
```

sem parar de assistir às transmissões.

---

# 12. Cada usuário escolhe o próprio foco

O foco de transmissão é local.

Se Pedro destaca a tela de Juliane:

```text
somente Pedro vê Juliane destacada
```

Isso não altera a interface dos demais participantes.

---

# 13. Assistir transmissão também é decisão local

Se existir transmissão disponível:

```text
Juliane está compartilhando
```

o usuário pode escolher:

```text
Ver transmissão
```

ou não consumir aquele vídeo.

Preservar o comportamento existente de:

```text
onWatchShare()
```

Isso é especialmente importante para economia de banda.

---

# 14. Bandeja de transmissões disponíveis

Se alguém estiver compartilhando, mas o usuário ainda não estiver assistindo:

```text
TRANSMISSÕES DISPONÍVEIS

▣ Juliane está transmitindo    [ASSISTIR]
▣ Pedro está transmitindo      [ASSISTIR]
```

---

# 15. Indicador na pessoa

Quem estiver compartilhando deve possuir indicação clara:

```text
Juliane
▣ Compartilhando tela
```

ou um badge sobre o avatar.

---

# 16. Indicador na sidebar do canal

Na lista lateral:

```text
🔊 Geral                      8

   Juliane     ▣
   Pedro
   Lucas       ▣
```

Assim é possível perceber transmissões antes mesmo de abrir o palco.

---

# 17. Controles individuais de transmissão

Cada tela remota deve possuir:

```text
Volume
Mutar som
Destacar
Grade
Tela cheia
Parar de assistir
```

Preservar as funções atuais.

---

# 18. Áudio de cada transmissão

O usuário pode controlar independentemente:

```text
voz de Pedro
```

e:

```text
áudio da tela de Pedro
```

Exemplo:

```text
Pedro voz     80%
Tela Pedro    30%
```

Não fundir os dois volumes.

---

# 19. Tela local

Quando o próprio usuário estiver transmitindo:

```text
Sua tela
```

Não mostrar:

```text
Parar de assistir
```

para sua própria transmissão.

Usar:

```text
Parar transmissão
```

nos controles principais da chamada.

---

# 20. Screen Share como estado principal do botão

Barra inferior:

sem transmissão:

```text
[Compartilhar tela]
```

transmitindo:

```text
[Parar transmissão]
```

O estado deve ficar visualmente evidente.

---

# 21. Qualidade da transmissão

Preservar escolha atual de qualidade.

Não alterar políticas existentes de:

```text
resolução
FPS
```

nesta etapa.

A UI pode melhorar, mas não mudar limites de infraestrutura.

---

# 22. Grade de participantes

Quando não houver compartilhamento, participantes são o conteúdo principal.

Tiles devem mostrar:

```text
avatar
nickname
estado
microfone
áudio
compartilhamento
fala
```

---

# 23. Quem está falando

Esse deve ser um dos feedbacks visuais mais evidentes.

Quando:

```ts
participant.speaking === true
```

usar algo como:

```text
borda accent
+
pequena animação
```

Evitar animações agressivas.

---

# 24. Participante mutado

Exemplo:

```text
[Avatar]
Juliane

🎤̸
```

Não precisa escrever permanentemente:

```text
sem microfone
```

se o ícone for suficientemente claro.

Pode aparecer em tooltip.

---

# 25. Participante ensurdecido

Mostrar:

```text
🎧̸
```

e estado visual discreto.

---

# 26. Compartilhando

Mostrar badge:

```text
▣
```

ou SVG correspondente.

---

# 27. Tile próprio

O próprio usuário deve ser identificável discretamente:

```text
Pedro
Você
```

Não precisa usar cor totalmente diferente.

---

# 28. Cabeçalho do canal

Exemplo:

```text
🔊 Geral

8 participantes · Conversando agora
```

Ações:

```text
Convidar
Mais
```

---

# 29. Qualidade de voz

Se houver informação real disponível:

```text
Qualidade de voz: Excelente
```

Se não houver métrica real:

não inventar.

Não exibir indicador fictício apenas para reproduzir o mockup.

---

# 30. Barra de controles

A barra inferior deve ser fixa e centralizada.

Prioridade:

```text
Microfone
Áudio
Compartilhar tela
Sair
```

Exemplo:

```text
[🎤] [🎧] [🖥] [🔴 SAIR]
```

---

# 31. Não incluir câmera nesta etapa

O mockup mostra câmera.

O Concord atualmente não trabalha com câmera.

Portanto:

```text
NÃO implementar câmera
```

e não exibir botão funcional falso.

Pode ser planejada futuramente.

---

# 32. Não incluir levantar a mão ainda

O mockup também apresenta:

```text
Levantar mão
```

Esse estado ainda não existe.

Não implementar nesta etapa.

---

# 33. Controles existentes

Preservar:

```text
microfone
saída de áudio
compartilhamento
sair
```

Não substituir funcionalidades existentes por controles decorativos.

---

# 34. VoiceDock

O `VoiceDock` continuará importante quando o usuário sair da tela do canal.

Exemplo:

```text
● Voz conectada

Geral
Comunidade Concord

🎤 🎧 ▣  Sair
```

---

# 35. VoiceDock dentro do canal

Quando o usuário estiver vendo o próprio `LivePanel`, evitar duplicar controles grandes.

Pode utilizar:

```text
controles completos no LivePanel
```

e reduzir visualmente o Dock.

Não manter duas barras concorrendo na mesma tela.

---

# 36. Chat do canal de voz

O chat lateral existente deve continuar disponível.

Desktop:

```text
[Participantes / palco] [Chat]
```

Pode ser:

```text
recolhível
```

para liberar mais espaço às transmissões.

---

# 37. Quando houver transmissão

O chat deve poder ser recolhido facilmente.

Prioridade visual:

```text
transmissão
>
chat
```

---

# 38. Quando não houver transmissão

Pode manter chat lateral aberto sem prejudicar a grade.

---

# 39. Composer do chat de voz

Seguir o padrão das Etapas 12 e 14:

```text
textarea
Enter → enviar
Shift+Enter → nova linha
```

Evitar UI diferente apenas por estar em canal de voz.

---

# 40. Mobile sem transmissão

Layout:

```text
┌────────────────────────────┐
│ ← Geral          8 pessoas │
├────────────────────────────┤
│ Juliane      Pedro         │
│ [avatar]     [avatar]      │
│                            │
│ Lucas        Ana           │
│ [avatar]     [avatar]      │
│                            │
├────────────────────────────┤
│ 🎤   🎧   🖥   🔴           │
└────────────────────────────┘
```

---

# 41. Mobile com transmissão

Quando alguém compartilhar:

```text
┌────────────────────────────┐
│ ← Geral                    │
├────────────────────────────┤
│                            │
│      Tela de Juliane       │
│                            │
├────────────────────────────┤
│ J  P  L  A  B  →           │
├────────────────────────────┤
│ 🎤   🎧   🖥   🔴           │
└────────────────────────────┘
```

---

# 42. Várias transmissões no mobile

Não mostrar grid 2×4 minúsculo.

Usar:

```text
transmissão selecionada
+
carousel/bandeja horizontal
```

O usuário toca em uma miniatura para trocar o foco.

---

# 43. Fullscreen mobile

Se suportado pelo navegador:

permitir fullscreen.

Caso contrário:

não quebrar o fluxo.

---

# 44. Compartilhamento no mobile

O código atual já detecta se:

```ts
navigator.mediaDevices.getDisplayMedia
```

está disponível.

Preservar.

Quando indisponível:

```text
Compartilhar tela não está disponível neste dispositivo.
```

Não mostrar botão ativo.

---

# 45. Não impor limite visual de quatro telas

O código atual utiliza visualmente:

```text
data-count <= 4
```

para organização.

A nova interface deve suportar conceitualmente mais transmissões.

Não criar:

```text
if screenShares.length > 4
  bloquear
```

Em vez disso:

```text
> 4
→ foco + bandeja
```

---

# 46. Limite de infraestrutura

O piloto atualmente limita o canal a:

```text
8 participantes
```

Portanto o layout deve permanecer utilizável até esse limite.

Se o limite mudar no futuro, a UI não deve depender rigidamente do número 8.

---

# 47. Participantes e transmissões são entidades diferentes

Não assumir:

```text
1 participant tile = 1 screen tile
```

A interface deve representar:

```text
Participante
├── voz
├── estado
└── possível transmissão
```

A transmissão é um conteúdo associado ao participante.

---

# 48. Ordem visual com transmissão

Prioridade:

```text
Tela em foco
↓
outras transmissões
↓
participantes
↓
chat
↓
informações secundárias
```

---

# 49. Ordem visual sem transmissão

Prioridade:

```text
Participantes
↓
quem está falando
↓
controles
↓
chat
```

---

# 50. Não implementar nesta etapa

Ficam fora:

```text
câmera
levantar mão
reações de voz
efeitos sonoros
soundboard
gravação
streaming para público
background virtual
blur de câmera
legendas
transcrição
```

---

# 51. Arquivos principais

Provavelmente alterar:

```text
apps/web/src/features/workspace/
├── LivePanel.tsx
├── VoiceDock.tsx
├── ScreenShareTile.tsx
├── ScreenShareButton.tsx
└── WorkspaceShell.css
```

Possivelmente:

```text
VoiceStateIcons.tsx
```

para novos ícones/estados.

---

# 52. Não modificar transporte

O redesign não deve alterar a arquitetura do LiveKit sem necessidade.

Preservar:

```text
tracks
participants
screenShares
volume controls
subscriptions
```

---

# 53. Performance e largura de banda

Não assinar automaticamente todas as transmissões se o comportamento atual permite escolher o que assistir.

Isso é particularmente importante quando:

```text
4+
```

pessoas estiverem compartilhando.

A UI pode listar todas, mas o usuário deve poder decidir quais assistir.

---

# 54. Transmissão destacada

Uma transmissão em foco deve receber mais resolução/área visual sempre que possível.

Miniaturas não precisam competir com o conteúdo principal.

---

# 55. Critérios de aceite — voz

1. Todos os participantes continuam visíveis.
2. Quem fala é facilmente identificado.
3. Mute e áudio continuam visíveis.
4. Volume individual continua funcionando.
5. Entrar/sair continua funcionando.
6. Microfone e áudio continuam funcionando.

---

# 56. Critérios de aceite — compartilhamento

1. Qualquer participante pode compartilhar a própria tela.

2. Um participante compartilhando não impede outro de iniciar sua transmissão.

3. A sala suporta várias transmissões simultâneas.

4. Uma transmissão é exibida em destaque automaticamente quando for a única assistida.

5. Duas transmissões usam layout dividido.

6. Três ou quatro transmissões podem usar grade.

7. Mais de quatro usam foco + bandeja.

8. O usuário pode destacar qualquer transmissão.

9. O usuário pode retornar à grade.

10. Cada transmissão remota possui volume independente.

11. Cada transmissão remota pode ser mutada.

12. Cada transmissão remota pode ser aberta em fullscreen.

13. O usuário pode parar de assistir uma transmissão sem afetar os demais.

14. Parar de assistir não encerra a transmissão do autor.

15. Parar a própria transmissão não encerra a transmissão de outras pessoas.

16. Mobile permanece utilizável com várias transmissões.

---

# 57. Critérios de aceite — chat

1. Chat continua funcionando.
2. Pode ser recolhido.
3. Não compete visualmente com tela compartilhada.
4. Composer segue padrão das outras telas.
5. Erros continuam visíveis.

---

# 58. Critérios responsivos

Validar:

```text
1920×1080
1440×900
1366×768
1024×768
390px
```

Testar especialmente:

```text
0 shares
1 share
2 shares
4 shares
8 shares
```

mesmo que os testes com 8 precisem usar mocks/demo.

---

# 59. Testes manuais importantes

Testar:

```text
Pedro entra
Juliane entra
Lucas entra

Juliane compartilha
Pedro assiste

Pedro compartilha também
Lucas assiste ambas

Lucas compartilha uma terceira tela

Pedro destaca Lucas

Juliane destaca Pedro

cada cliente deve manter seu próprio foco
```

---

# 60. Teste de encerramento

Cenário:

```text
3 telas ativas
↓
autor de uma tela para de transmitir
```

A interface deve:

* remover apenas aquela transmissão;
* preservar as demais;
* remover foco caso a tela encerrada estivesse destacada;
* selecionar layout adequado automaticamente.

---

# 61. Teste de saída da chamada

Se participante compartilhando sair:

```text
participant disconnect
↓
share desaparece
↓
layout reorganiza
```

sem erro visual.

---

# 62. Ordem recomendada para o Codex

```text
ETAPA 1
Ler LivePanel, VoiceDock,
ScreenShareTile e CSS.

↓

ETAPA 2
Preservar toda funcionalidade existente.

↓

ETAPA 3
Criar novo cabeçalho do canal.

↓

ETAPA 4
Redesenhar grade de participantes.

↓

ETAPA 5
Redesenhar indicador de fala.

↓

ETAPA 6
Criar layout adaptativo de screen share:

0 → participantes
1 → spotlight
2 → split
3–4 → grid
5+ → spotlight + tray

↓

ETAPA 7
Integrar seleção/foco de transmissão.

↓

ETAPA 8
Redesenhar ScreenShareTile.

↓

ETAPA 9
Preservar volume/mute/fullscreen.

↓

ETAPA 10
Criar bandeja de transmissões disponíveis.

↓

ETAPA 11
Redesenhar controles inferiores.

↓

ETAPA 12
Integrar compartilhamento próprio.

↓

ETAPA 13
Redesenhar chat lateral.

↓

ETAPA 14
Revisar VoiceDock.

↓

ETAPA 15
Mobile.

↓

ETAPA 16
Testar múltiplas telas.

↓

ETAPA 17
Validar dark/light/themes.

↓

ETAPA 18
Comparar com referência aprovada.
```

---

# 63. Resultado esperado

Sem tela compartilhada:

```text
canal de voz moderno
+
grade clara de participantes
+
feedback de fala
+
controles acessíveis
```

Com tela compartilhada:

```text
sala de voz
+
experiência de watch party/reunião
+
múltiplos apresentadores
+
controle individual por usuário
```

---

# 64. Regra final

O compartilhamento de tela deve ser tratado como recurso de primeira classe da sala.

Não projetar:

```text
"uma pessoa apresenta para todos"
```

Projetar:

```text
"qualquer pessoa conectada pode transmitir,
e cada participante decide o que assistir e destacar"
```

Essa arquitetura precisa continuar compatível com o princípio de custo zero e com o limite de participantes definido para o piloto.
