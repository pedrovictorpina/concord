# Concord — Etapa 14: Redesign do Chat de Servidor

**Status:** Planejamento visual e técnico
**Referência visual:** mockup aprovado da Etapa 14
**Objetivo:** modernizar toda a experiência dentro de um servidor, cobrindo navegação de canais, chat de texto e lista de membros, sem substituir as funcionalidades já existentes.

---

# 1. Objetivo

O servidor deve ser uma das principais áreas do Concord.

A nova interface precisa transmitir sensação de produto completo e facilitar:

* navegação entre canais;
* identificação do canal atual;
* leitura das mensagens;
* envio de mensagens;
* busca;
* acompanhamento de membros;
* percepção de cargos;
* visualização de pessoas em voz;
* identificação de mensagens não lidas;
* administração do servidor;
* uso em desktop e mobile.

A direção aprovada é:

```text
Discord
+
layout moderno de comunicação
+
identidade visual do Concord
```

Não criar uma cópia literal do Discord.

---

# 2. Estrutura aprovada

Desktop:

```text
┌──────┬─────────────────────┬─────────────────────────────┬─────────────────┐
│ Rail │ Servidor / Canais   │ Chat                        │ Membros          │
│      │                     │                             │                 │
│ C    │ Comunidade Concord  │ # geral                    │ Buscar membros  │
│      │                     │ descrição                   │                 │
│ S1   │ INFORMAÇÕES         ├─────────────────────────────┤ DONO — 1        │
│ S2   │ # regras            │                             │ Rafael          │
│      │ # anúncios          │ mensagens                  │                 │
│ +    │                     │                             │ MODERADORES — 2 │
│      │ CANAIS DE TEXTO     │                             │ Juliane         │
│      │ # geral             │                             │ Pedro           │
│      │ # desenvolvimento   │                             │                 │
│      │                     │                             │ ONLINE — 8      │
│      │ CANAIS DE VOZ       │                             │ ...             │
│      │ 🔊 Geral            ├─────────────────────────────┤                 │
│      │   Juliane           │ + Conversar em #geral   ➤ │                 │
│      │                     │                             │                 │
│      │ [usuário atual]     │                             │                 │
└──────┴─────────────────────┴─────────────────────────────┴─────────────────┘
```

---

# 3. Regra sobre o mockup

Utilizar a imagem como referência para:

```text
hierarquia
layout
proporções
densidade
espaçamento
organização
composição
```

Não copiar literalmente:

```text
nomes
mensagens
avatares
quantidades
canais
cores específicas
funcionalidades fictícias
```

Usar sempre os dados reais do Concord.

---

# 4. Design system

Não utilizar cores fixas copiadas da imagem.

Usar:

```text
--color-canvas
--color-surface
--color-surface-raised
--color-surface-sunken

--color-border
--color-border-soft

--color-text
--color-text-strong
--color-text-muted
--color-text-faint

--color-accent
--color-accent-hover
--color-accent-soft
--color-accent-contrast

--color-success
--color-warning
--color-danger
```

Preservar dark mode, light mode e demais temas.

---

# 5. Escopo da Etapa 14

Esta etapa cobre três componentes principais:

```text
ChannelPanel
ChatPanel
MemberPanel
```

e suas integrações dentro de:

```text
WorkspaceShell
```

Arquivos principais:

```text
apps/web/src/features/workspace/
├── ChannelPanel.tsx
├── ChatPanel.tsx
├── MemberPanel.tsx
├── WorkspaceShell.tsx
└── WorkspaceShell.css
```

---

# 6. Funcionalidades existentes que devem ser preservadas

## Canais

Preservar:

* trocar canal;
* canais de texto;
* canais de voz;
* participantes dentro de canais de voz;
* busca de canais;
* contador de não lidas;
* indicador de menção;
* criar canal quando permitido;
* menu do servidor;
* convite;
* permissões;
* silenciar servidor;
* marcar como lido;
* sair do servidor.

---

## Chat

Preservar:

* carregar mensagens;
* enviar mensagem;
* busca local no canal;
* indicação de mensagem editada;
* link clicável;
* loading;
* erro de envio;
* mostrar/ocultar membros.

---

## Membros

Preservar:

* busca;
* cargos;
* moderação;
* remover;
* banir;
* timeout;
* cortar áudio;
* cortar microfone;
* alterar cargo;
* transferir propriedade;
* indicador de pessoa em voz.

---

# 7. Problema atual

A funcionalidade já é extensa, mas visualmente muitos elementos possuem peso semelhante.

Isso gera competição entre:

```text
servidor
busca
atalhos
canais
voz
membros
status
ações
```

O redesign deve criar hierarquia mais clara.

---

# 8. Server Rail

A barra mais à esquerda continua sendo responsável pelos servidores.

Estrutura:

```text
[Concord/Home]

────────

[Servidor 1]
[Servidor 2]
[Servidor 3]

[+]

────────

[Configurações]
```

---

# 9. Servidor ativo

Melhorar o destaque do servidor atual.

Pode utilizar:

```text
barra lateral
+
background accent
+
transição suave
```

Não depender exclusivamente de cor.

---

# 10. Identificação dos servidores

Hoje servidores são representados principalmente pelas iniciais.

Preservar isso inicialmente.

Futuramente poderá existir:

```text
serverAvatarUrl
```

mas não alterar schema nesta etapa.

---

# 11. Cabeçalho da sidebar

O nome do servidor deve ser o elemento principal:

```text
Comunidade Concord     ⌄
```

Informação como:

```text
VOCÊ É O DONO
```

pode continuar existindo, porém com menos destaque.

Preferência:

```text
Comunidade Concord
Proprietário
```

em vez de ocupar duas linhas altamente chamativas.

---

# 12. Menu do servidor

Preservar o menu Radix existente.

Organizar visualmente grupos:

```text
Convidar pessoas

Configurações
Cargos e permissões

Criar canal de texto
Criar canal de voz

Silenciar
Marcar como lido

Sair do servidor
```

Não alterar regras de permissão.

---

# 13. Busca de canais

Manter busca local.

Novo visual:

```text
┌─────────────────────────┐
│ 🔍 Buscar canais...     │
└─────────────────────────┘
```

O `⌘K` atual só deve continuar se existir realmente um atalho funcional.

Se não existir:

**remover da UI.**

Não mostrar atalhos falsos.

---

# 14. Navegação "Início / Menções / Threads / Explorar"

Atualmente alguns itens aparecem como:

```text
Em breve
```

Esses itens criam ruído na principal área de navegação.

Preferência para a Etapa 14:

* manter somente recursos funcionais;
* ocultar atalhos puramente futuros.

Portanto, se:

```text
Menções
Threads
Explorar
```

não possuírem implementação real, não precisam ocupar a sidebar principal ainda.

---

# 15. Categorias de canais

O projeto deve priorizar categorias reais quando existirem.

Visual:

```text
INFORMAÇÕES                         +
# regras
# anúncios
# boas-vindas

CANAIS DE TEXTO                    +
# geral
# desenvolvimento
# ideias

CANAIS DE VOZ                      +
🔊 Geral
🔊 Desenvolvimento
```

---

# 16. Categorias recolhíveis

Se a estrutura atual já permitir identificar categorias, permitir:

```text
▼ CANAIS DE TEXTO
```

e:

```text
▶ CANAIS DE TEXTO
```

Se isso exigir mudança arquitetural significativa:

deixar para etapa posterior.

---

# 17. Canal de texto

Linha normal:

```text
# geral
```

Hover:

```text
# geral                ações
```

Ativo:

```text
# geral
```

com:

```text
background accent-soft
+
texto forte
```

---

# 18. Não lidas

Preservar contador existente.

Exemplo:

```text
# geral                        4
```

Menção:

```text
# geral                        @
```

O badge de menção deve possuir prioridade visual superior ao contador comum.

---

# 19. Canais de voz

Formato:

```text
🔊 Geral                      2
```

Participantes:

```text
   [avatar] Juliane
            falando

   [avatar] Pedro
            conectado
```

---

# 20. Participante falando

O estado:

```text
participant.speaking
```

já existe.

Destacar com:

```text
borda accent
```

ou:

```text
nome accent
```

Preferência por uma indicação sutil.

---

# 21. Estados de voz

Preservar visualmente:

```text
sem microfone
sem áudio
compartilhando tela
falando
conectado
```

Utilizar `VoiceStateFlags` já existente.

---

# 22. Usuário atual no rodapé

Rodapé da sidebar:

```text
[Avatar] SeuUsuário
         Online

         🎤 🎧 ⚙
```

Essa área deve continuar fixa na parte inferior.

---

# 23. Ações do rodapé

Garantir que os botões realmente correspondam a ações existentes.

Se atualmente algum ícone não executa a ação esperada:

não ampliar o redesign mascarando esse problema.

---

# 24. Chat — cabeçalho

Novo cabeçalho:

```text
# geral
Conversas sobre tudo e qualquer coisa!

                             📌 👥 🔍
```

Hierarquia:

```text
nome do canal
↓
descrição
↓
ações
```

---

# 25. Descrição do canal

Hoje o cabeçalho usa:

```text
server.description
```

como descrição do canal.

Isso não é semanticamente ideal.

Se `ChannelSummary` ainda não possuir descrição:

não criar descrição fictícia de canal.

Até existir suporte:

* usar descrição do servidor de forma discreta;
* ou omitir a segunda linha.

Uma futura etapa pode introduzir:

```ts
channel.description
```

---

# 26. Network status

A UI atual apresenta:

```text
REDE ESTÁVEL
RT
```

Essa informação não precisa ocupar permanentemente o cabeçalho.

Preferência:

* ocultar em operação normal;
* mostrar apenas estado relevante.

Exemplo:

```text
Reconectando...
```

quando houver problema.

Não gastar espaço com diagnóstico técnico sem necessidade.

---

# 27. Ações do canal

Priorizar:

```text
Fixadas
Membros
Buscar
```

Só mostrar Notificações se existir comportamento funcional real.

Não mostrar botão puramente decorativo.

---

# 28. Busca de mensagens

Preservar a busca atual.

No desktop pode continuar incorporada ao header:

```text
🔍 Buscar
```

Ao focar:

```text
┌─────────────────────┐
│ Buscar no canal...  │
└─────────────────────┘
```

---

# 29. Mensagens

Principal objetivo:

melhorar bastante a hierarquia.

Novo padrão:

```text
[Avatar] Juliane        14:23
         Bom dia, pessoal! 👋
```

Não utilizar bubbles para todas as mensagens.

---

# 30. Agrupamento

Mensagens consecutivas do mesmo autor devem poder formar grupos visuais.

Exemplo:

```text
[Avatar] Juliane  14:23
         Bom dia!

         Como vocês estão?

         Alguém viu o roadmap?
```

Critério sugerido:

```text
mesmo autor
+
intervalo <= 5 minutos
```

Pode ser calculado no frontend.

---

# 31. Mensagem própria

Ao contrário da DM, no canal do servidor não é necessário criar bubble colorido para mensagens próprias.

Servidor deve seguir:

```text
layout comunitário
```

e não:

```text
chat de celular
```

O usuário pode ser identificado pelo próprio avatar/nome.

---

# 32. Hover da mensagem

Ao passar mouse:

```text
                     [Reagir] [Responder*] [...]
```

Implementar apenas ações reais.

Inicialmente pode existir:

```text
Copiar texto
```

se houver implementação simples.

---

# 33. Mensagem editada

Manter:

```text
editada
```

mas com menor destaque que o horário.

---

# 34. Links

O preview atual é extremamente simples:

```text
hostname
Abrir link
```

Pode ser redesenhado como card discreto.

Não tentar buscar metadados remotos nesta etapa.

---

# 35. Reações

A referência visual possui:

```text
👍 2
❤️ 3
🔥 1
```

O sistema atual não possui reação em `MessageSummary`.

Portanto:

**não implementar reações falsas.**

Planejar etapa posterior.

---

# 36. Sistema de mensagens do servidor

Não alterar banco apenas para o redesign.

Preservar:

```text
id
channelId
authorId
authorNickname
body
createdAt
editedAt
```

---

# 37. Separador de data

Substituir:

```text
CANAL DE TEXTO · ETAPA 02
```

como separador permanente.

Utilizar datas reais:

```text
──────── Hoje ────────
```

```text
──── 19 de agosto de 2026 ────
```

---

# 38. Launch note atual

Hoje o chat apresenta grande bloco:

```text
ETAPA 02
Em sintonia.
```

Isso é útil como demonstração de desenvolvimento, mas não como interface final.

Substituir por estado inicial do canal:

```text
# geral

Este é o começo do canal #geral.

Comunidade Concord
```

Mais simples e voltado ao usuário.

---

# 39. Eventos do servidor

A referência mostra eventos como:

```text
RafaSilva adicionou ana_dev ao servidor.
```

O sistema atual não possui esse tipo de evento na lista de mensagens.

Não criar nesta etapa.

Pode ser planejado futuramente como:

```text
Server Events
```

---

# 40. Composer

Redesenhar seguindo a linguagem aprovada nas DMs.

Estrutura:

```text
┌───────────────────────────────────────────────────────┐
│ +  Conversar em #geral                  GIF  ☺   ➤   │
└───────────────────────────────────────────────────────┘
```

---

# 41. Textarea

Substituir o `<input>` por `<textarea>` auto-expansível.

Comportamento:

```text
Enter
→ enviar

Shift + Enter
→ nova linha
```

Máximo sugerido:

```text
5–6 linhas
```

depois scroll interno.

---

# 42. Anexos

O botão `+` atual existe, mas anexos ainda não são implementados.

Não criar upload nesta etapa apenas por causa do redesign.

Se continuar visível:

```text
disabled
+
tooltip "Em breve"
```

ou ocultar.

---

# 43. GIF / presente / emoji

Não mostrar ferramentas como funcionais se não estiverem implementadas.

A referência visual pode manter espaço para elas, mas a UI real deve respeitar a funcionalidade existente.

Preferência:

```text
só mostrar ações reais
```

---

# 44. Botão enviar

Manter ação visual destacada:

```text
➤
```

Preferir SVG consistente.

Usar:

```text
var(--color-accent)
```

---

# 45. Scroll do chat

Implementar comportamento correto:

### Ao abrir canal

ir para mensagens mais recentes.

### Nova mensagem e usuário está no fim

auto-scroll.

### Usuário lendo mensagens antigas

não puxar automaticamente.

Mostrar:

```text
↓ Novas mensagens
```

se necessário.

---

# 46. Loading

A tela deve evitar saltos grandes.

Se `loading` estiver ativo:

usar estado visual discreto.

Não precisa de biblioteca de skeleton.

---

# 47. Estado vazio

Canal sem mensagens:

```text
# geral

Este é o começo do canal #geral.
Envie a primeira mensagem.
```

Não usar linguagem interna de desenvolvimento como:

```text
Abra o primeiro sinal.
```

a menos que isso seja uma decisão explícita da identidade final do Concord.

---

# 48. Painel de membros

O painel direito deve ficar visualmente mais integrado ao servidor.

Estrutura:

```text
Buscar membros...

DONO — 1
Rafael

MODERADORES — 2
Juliane
Pedro

MEMBROS — 8
Lucas
Ana
Beatriz

OFFLINE — 13
...
```

---

# 49. Presença no MemberPanel

O `MemberPanel` atualmente possui cargo e informação de voz, mas não recebe presença geral online/offline.

Não inventar agrupamentos por:

```text
ONLINE
OFFLINE
```

até que o componente receba presença real.

Primeira versão pode organizar por:

```text
PROPRIETÁRIO
MODERADORES
MEMBROS
```

como já faz.

---

# 50. Evolução recomendada do MemberPanel

Se o estado global já possuir presença confiável dos membros do servidor e isso puder ser passado sem backend novo, considerar:

```text
cargo
+
presença
```

Caso contrário:

não ampliar escopo.

---

# 51. Cargos

Melhorar labels:

```text
PROPRIETÁRIO — 1
MODERADORES — 2
MEMBROS — 15
```

Dono pode possuir pequeno indicador:

```text
coroa
```

ou outro ícone interno.

---

# 52. Member row

Formato:

```text
[Avatar] Juliane
         @juliane · moderadora
```

Se estiver em voz:

```text
🔊
```

Preservar o indicador atual.

---

# 53. Moderação

Não alterar comportamento do menu de moderação.

Apenas redesenhar sua apresentação.

Preservar confirmações para:

```text
banir
remover
transferir
```

---

# 54. Busca de membros

Preservar busca local por:

```text
nickname
username
```

Usar o mesmo padrão visual de busca aplicado às demais telas.

---

# 55. Largura do MemberPanel

Hoje o shell usa aproximadamente:

```text
330px
```

para membros.

No redesign sugerir algo próximo de:

```text
280–320px
```

dependendo da largura total.

Não desperdiçar muito espaço do chat.

---

# 56. Painel recolhível

Preservar:

```text
membersPanelVisible
```

O botão no header continua alternando o painel.

A animação pode ser suave.

---

# 57. Layout desktop

A proporção ideal deve priorizar o chat:

```text
Rail             64–74px
ChannelPanel     240–280px
Chat             flexível
MemberPanel      280–320px
```

Não comprimir a área central desnecessariamente.

---

# 58. Monitores menores

Quando a largura diminuir:

```text
MemberPanel
```

deve ser o primeiro painel opcional a desaparecer.

A sidebar de canais continua prioritária até breakpoint móvel.

---

# 59. Mobile

A experiência móvel deve usar três views separadas:

```text
Canais
Chat
Membros
```

Não tentar mostrar todas simultaneamente.

---

# 60. Mobile — canais

```text
┌───────────────────────────────┐
│ Comunidade Concord            │
├───────────────────────────────┤
│ Buscar canais                 │
│                               │
│ INFORMAÇÕES                   │
│ # regras                      │
│ # anúncios                    │
│                               │
│ TEXTO                         │
│ # geral                       │
│ # desenvolvimento             │
│                               │
│ VOZ                           │
│ 🔊 Geral                      │
└───────────────────────────────┘
```

---

# 61. Mobile — chat

```text
┌───────────────────────────────┐
│ ☰  # geral               👥   │
├───────────────────────────────┤
│                               │
│ mensagens                     │
│                               │
├───────────────────────────────┤
│ + Conversar em #geral    ➤   │
└───────────────────────────────┘
```

---

# 62. Mobile — membros

```text
┌───────────────────────────────┐
│ ← Membros                     │
├───────────────────────────────┤
│ Buscar membros                │
│                               │
│ PROPRIETÁRIO                  │
│ Rafael                        │
│                               │
│ MODERADORES                   │
│ Juliane                       │
└───────────────────────────────┘
```

---

# 63. Navegação móvel atual

O projeto já possui:

```text
mobile-you-bar
```

e controle:

```text
mobileNavigationOpen
```

Preservar a arquitetura existente quando possível.

Não criar um segundo sistema de navegação móvel em paralelo.

---

# 64. Consistência com Etapas 12 e 13

Etapas:

```text
12 — Mensagens Diretas
13 — Home/Amigos
14 — Chat do Servidor
```

devem compartilhar:

* header;
* campos de busca;
* avatares;
* status;
* menus;
* composer;
* spacing;
* botões;
* ícones;
* estados de hover;
* tipografia.

---

# 65. Ícones

O projeto já possui `WorkspaceIcons`.

Reutilizar.

Se faltar algum ícone:

adicionar ao mesmo sistema.

Evitar Unicode como solução final para:

```text
⚙
◖
+
⌄
```

quando um SVG apropriado fizer sentido.

---

# 66. Não implementar nesta etapa

Ficam fora:

```text
reações
threads
respostas
mensagens fixadas funcionais se ainda não existirem
anexos
GIF
presentes
emoji picker avançado
menções avançadas
eventos do servidor
rich embeds
atividade de jogo
status online de membros sem fonte real
descrição específica de canal se schema não suportar
```

---

# 67. Evitar funcionalidades falsas

Se um botão não possui comportamento real:

```text
não apresentá-lo como funcional
```

Pode ser:

```text
oculto
```

ou, somente quando fizer sentido:

```text
disabled + Em breve
```

Mas evitar encher a tela de ações desabilitadas.

---

# 68. Banco de dados

Não criar migrations para o redesign.

A Etapa 14 deve funcionar com os dados existentes.

Alterações de schema devem ser reservadas para recursos específicos posteriores.

---

# 69. Componentização

`ChannelPanel.tsx` já possui bastante responsabilidade.

Se o redesign aumentar significativamente o tamanho, considerar:

```text
server/

ChannelPanel.tsx
ServerHeader.tsx
ChannelSearch.tsx
ChannelGroup.tsx
ChannelRow.tsx
VoiceChannelRow.tsx
VoiceMemberRow.tsx
```

Para chat:

```text
chat/

ChatPanel.tsx
ChatHeader.tsx
MessageList.tsx
MessageGroup.tsx
MessageComposer.tsx
ChannelEmptyState.tsx
```

Para membros:

```text
members/

MemberPanel.tsx
MemberGroup.tsx
MemberRow.tsx
```

Não fragmentar excessivamente.

---

# 70. Acessibilidade

Garantir:

* `aria-label` em ícones;
* foco visível;
* menus acessíveis;
* busca etiquetada;
* `textarea` acessível;
* estados selecionados claros;
* navegação por teclado;
* contraste adequado;
* ações disponíveis sem depender exclusivamente de hover.

---

# 71. Performance

Evitar:

* filtrar listas grandes repetidamente sem necessidade;
* listeners adicionais desnecessários;
* refetch por hover;
* consulta por mensagem;
* consulta por membro.

O redesign deve ser majoritariamente estrutural e visual.

---

# 72. Arquivos provavelmente afetados

Obrigatórios:

```text
apps/web/src/features/workspace/ChannelPanel.tsx
apps/web/src/features/workspace/ChatPanel.tsx
apps/web/src/features/workspace/MemberPanel.tsx
apps/web/src/features/workspace/WorkspaceShell.css
```

Possivelmente:

```text
apps/web/src/features/workspace/WorkspaceIcons.tsx
apps/web/src/features/workspace/WorkspaceShell.tsx
```

Somente se necessário.

---

# 73. Critérios de aceite — Sidebar

1. Nome do servidor possui hierarquia clara.
2. Busca está integrada.
3. Canais de texto e voz são facilmente distinguíveis.
4. Canal ativo é evidente.
5. Não lidas permanecem funcionando.
6. Menções permanecem funcionando.
7. Participantes em voz continuam visíveis.
8. Estados de voz permanecem visíveis.
9. Usuário atual continua acessível no rodapé.
10. Menus administrativos continuam funcionando.

---

# 74. Critérios de aceite — Chat

1. Cabeçalho mostra claramente o canal.
2. Busca continua funcionando.
3. Painel de membros pode ser alternado.
4. Mensagens possuem melhor hierarquia.
5. Mensagens consecutivas podem ser agrupadas.
6. Datas são apresentadas corretamente.
7. Estado inicial do canal é mais limpo.
8. Links continuam clicáveis.
9. Composer usa textarea.
10. Enter envia.
11. Shift+Enter cria nova linha.
12. Scroll se comporta corretamente.
13. Erros continuam visíveis.

---

# 75. Critérios de aceite — Membros

1. Busca continua funcionando.
2. Cargos continuam agrupados.
3. Moderação continua funcionando.
4. Ações destrutivas continuam exigindo confirmação.
5. Pessoas em voz continuam identificáveis.
6. Painel pode ser ocultado.
7. Layout permanece legível com muitos membros.

---

# 76. Critérios gerais

Validar:

```text
1920×1080
1440×900
1366×768
1024×768
390px mobile
```

Também:

```text
dark
light
demais temas
```

Sem overflow horizontal.

---

# 77. Ordem recomendada para o Codex

```text
ETAPA 1
Ler:
ChannelPanel.tsx
ChatPanel.tsx
MemberPanel.tsx
WorkspaceShell.tsx
CSS relacionado.

        ↓

ETAPA 2
Identificar funcionalidades reais
e remover ruído visual de recursos futuros.

        ↓

ETAPA 3
Redesenhar ServerRail/ChannelPanel.

        ↓

ETAPA 4
Redesenhar categorias e canais.

        ↓

ETAPA 5
Redesenhar canais de voz
e participantes.

        ↓

ETAPA 6
Redesenhar header do chat.

        ↓

ETAPA 7
Redesenhar mensagens.

        ↓

ETAPA 8
Adicionar agrupamento visual.

        ↓

ETAPA 9
Adicionar separadores reais de data.

        ↓

ETAPA 10
Substituir estado inicial antigo.

        ↓

ETAPA 11
Redesenhar composer.

        ↓

ETAPA 12
Textarea + Enter / Shift+Enter.

        ↓

ETAPA 13
Corrigir comportamento de scroll.

        ↓

ETAPA 14
Redesenhar MemberPanel.

        ↓

ETAPA 15
Responsividade desktop.

        ↓

ETAPA 16
Mobile.

        ↓

ETAPA 17
Validar temas.

        ↓

ETAPA 18
Executar testes.

        ↓

ETAPA 19
Comparar visualmente com mockup aprovado.
```

---

# 78. Comparação visual final

Depois da implementação, comparar com a referência aprovada e avaliar:

```text
largura das colunas
altura dos headers
hierarquia dos canais
densidade das mensagens
tamanho dos avatares
espaçamento vertical
posição do composer
proporção do painel de membros
destaque do canal atual
```

Não modificar o design system apenas para copiar a cor exata do mockup.

---

# 79. Resultado esperado

A interface deve passar de:

```text
chat funcional
```

para:

```text
ambiente completo de comunidade
```

com:

```text
navegação clara
+
chat confortável
+
voz integrada
+
membros contextuais
+
administração acessível
+
mobile adequado
```

---

# 80. Regra final

A prioridade desta etapa é:

```text
REFINAR
```

e não:

```text
RECONSTRUIR
```

Grande parte da funcionalidade já existe.

O Codex deve:

* reaproveitar arquitetura atual;
* preservar comportamento existente;
* melhorar estrutura e apresentação;
* eliminar elementos provisórios;
* não criar backend para reproduzir dados fictícios do mockup;
* não implementar recursos futuros sem necessidade;
* manter a identidade do Concord.

O resultado deve ser visualmente próximo da referência aprovada, mas funcionalmente fiel ao que o Concord realmente suporta.
