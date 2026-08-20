# Concord — Etapa 13: Redesign da Home/Amigos

**Status:** Planejamento visual e técnico
**Referência visual:** mockup aprovado da Etapa 13
**Objetivo:** transformar a Home/Amigos em uma área mais completa, organizada e informativa, mantendo a identidade visual do Concord e preservando as funcionalidades existentes.

---

# 1. Objetivo

A Home/Amigos deve deixar de parecer apenas uma lista simples e passar a funcionar como um verdadeiro hub social do Concord.

A tela deve facilitar:

* encontrar amigos;
* visualizar presença;
* identificar rapidamente quem está online;
* identificar quem está em chamada;
* iniciar uma mensagem direta;
* acessar solicitações;
* adicionar amigos;
* acompanhar atividade dos amigos;
* evoluir futuramente para sugestões, jogos/atividades e recursos sociais adicionais.

A direção visual aprovada combina:

```text
Discord
+
aplicações sociais modernas
+
identidade visual própria do Concord
```

Não criar uma cópia literal do Discord.

---

# 2. Regra sobre a imagem de referência

A referência visual deve orientar:

```text
layout
hierarquia
densidade
proporções
organização
espaçamento
composição
```

Não copiar literalmente:

```text
paleta roxa
avatares
nomes
quantidades
conteúdo fictício
ícones específicos
```

Todas as cores devem continuar derivadas do design system do Concord.

---

# 3. Situação atual

A tela está concentrada principalmente em:

```text
apps/web/src/features/workspace/FriendsHome.tsx
```

Atualmente já existem:

```text
Tabs
├── Disponível
├── Todos
├── Pendente
└── Adicionar amigo

Busca de amigos

Lista de amigos
├── Avatar
├── Status
├── Abrir DM
└── Menu

Solicitações
├── Recebidas
├── Enviadas
└── Convites de servidor

Painel lateral
└── Ativo agora
```

Essas funcionalidades devem ser preservadas.

---

# 4. Problemas visuais atuais

A implementação atual funciona, mas ainda possui aparência muito básica.

Principais problemas:

* pouca hierarquia entre áreas;
* presença visual pouco destacada;
* ações de cada amigo pouco evidentes;
* lista extensa sem agrupamento visual forte;
* painel direito pouco aproveitado;
* abas e busca parecem elementos independentes;
* solicitações ficam escondidas dentro de uma tab;
* pouca informação contextual sobre cada amigo;
* layout ainda não transmite sensação de "hub social".

---

# 5. Estrutura visual desejada

Desktop:

```text
┌──────┬────────────────────────┬───────────────────────────────┐
│ Rail │ Amigos                 │ Painel contextual             │
│      │                        │                               │
│      │ Buscar amigos          │ Juliane                       │
│      │                        │ ● Disponível                  │
│      │ Todos Online Ausentes  │                               │
│      │ Offline                │ [Mensagem] [Chamada] [...]    │
│      │                        │                               │
│      │ Online — 8             │ Atividade                     │
│      │ Juliane                │ Jogando Concord · 15 min      │
│      │ Pedro                  │                               │
│      │ Lucas                  │ Solicitações                  │
│      │ ...                    │                               │
│      │                        │ Convites / Ativo agora        │
└──────┴────────────────────────┴───────────────────────────────┘
```

O layout deve possuir duas áreas principais dentro da Home:

```text
lista
+
painel contextual
```

---

# 6. Coluna principal

A coluna principal deve conter:

```text
Título
Busca
Filtros/tabs
Lista organizada de amigos
```

Ela será a principal área de navegação.

---

# 7. Cabeçalho

Criar um cabeçalho visualmente mais simples e consistente:

```text
Amigos
```

Pode possuir um ícone discreto.

Não usar símbolos Unicode como solução final se houver SVG compatível.

---

# 8. Busca

A busca deve ganhar mais destaque.

Estrutura:

```text
[ 🔍 Buscar amigos...                       ][Filtro]
```

Reutilizar o filtro existente por:

```text
nickname
username
```

Não criar busca no backend nesta etapa.

A busca continua local sobre a lista carregada.

---

# 9. Filtros

A referência aprovada possui:

```text
Todos
Online
Ausentes
Offline
```

O Concord atualmente possui:

```text
Disponível
Todos
Pendente
Adicionar
```

Para o redesign, separar os conceitos:

## Filtro da lista

```text
Todos
Online
Ausentes
Offline
```

## Ações sociais

```text
Solicitações
Adicionar amigo
```

Isso deixa a navegação mais clara.

---

# 10. Definição dos filtros

### Todos

Todos os amigos.

### Online

Pode incluir inicialmente:

```text
online
busy
```

ou apenas `online`.

Preferência:

```text
Online = status online
```

### Ausentes

```text
status === 'away'
```

### Offline

Amigos sem presença ou com status offline.

### Não perturbe

Pode permanecer dentro de Todos inicialmente.

Se necessário no futuro:

```text
Todos
Online
Ausentes
Não perturbe
Offline
```

Evitar criar filtros demais sem necessidade.

---

# 11. Contadores

Mostrar contagem ao lado de cada filtro.

Exemplo:

```text
Todos 24
Online 8
Ausentes 3
Offline 13
```

Calcular no frontend a partir de:

```ts
friends
presenceByUser
```

Sem backend novo.

---

# 12. Organização por status

A lista principal pode ser agrupada:

```text
Online — 8
────────────

Juliane
Pedro
Lucas

Ausentes — 3
────────────

Gabriel
Matheus

Offline — 13
────────────
...
```

Os grupos podem ser recolhíveis futuramente.

Na primeira versão isso é opcional.

---

# 13. Item de amigo

Cada amigo deve possuir uma linha mais rica:

```text
[Avatar] Juliane                     [Mensagem] [...]
         ● Disponível
```

ou:

```text
[Avatar] Lucas                       [Mensagem] [...]
         🎮 Jogando Concord
```

A linha deve ser confortável sem virar um card enorme.

---

# 14. Presença

A presença é uma das informações mais importantes da tela.

Utilizar:

```text
online        → Disponível
away          → Ausente
busy          → Não perturbe
offline       → Offline
```

Reutilizar as classes/status visuais existentes.

Não criar outro sistema de presença.

---

# 15. Atividade em voz

O contrato atual já fornece:

```ts
voiceChannelName
voiceServerName
```

Quando existir:

```text
Em voz · Geral
```

ou:

```text
Comunidade XYZ · Geral
```

Pode receber destaque em:

```text
var(--color-accent)
```

---

# 16. Atividade futura

A referência visual apresenta algo como:

```text
Jogando Concord · 15 min
```

Esse tipo de informação ainda não existe no contrato atual.

Portanto:

**não inventar atividade de jogo.**

Planejar espaço visual para futuras informações como:

```text
jogando
ouvindo
streamando
em chamada
```

Nesta etapa usar apenas presença real existente.

---

# 17. Ação de mensagem

A ação principal deve ser:

```text
Mensagem
```

Na lista compacta pode permanecer como ícone.

No painel detalhado:

```text
[ Mensagem ]
```

Esse botão deve chamar:

```ts
onOpenFriend(friend)
```

---

# 18. Menu de ações

Preservar:

```text
Enviar mensagem
Copiar identificador
```

no menu de três pontos.

O menu pode futuramente ganhar:

```text
Remover amigo
Bloquear
Perfil
```

mas não implementar sem backend existente.

---

# 19. Seleção de amigo

Adicionar estado local:

```ts
selectedFriendId
```

ou equivalente.

Quando o usuário selecionar uma linha, o painel direito deve mostrar esse amigo.

Clicar diretamente no botão de mensagem abre a DM.

Clicar na linha apenas seleciona o amigo.

Isso evita que toda interação force a abertura de conversa.

---

# 20. Painel contextual direito

O painel direito é a principal mudança estrutural.

Quando um amigo estiver selecionado:

```text
[Avatar grande]

Juliane
● Disponível

@juliane

[ Mensagem ] [Chamada*] [...]

────────────────

Atividade
Em voz · Geral

────────────────

Informações adicionais
```

---

# 21. Estado sem amigo selecionado

Quando nenhum amigo estiver selecionado, o painel pode mostrar:

```text
Ativo agora
```

reutilizando a funcionalidade atual.

Exemplo:

```text
ATIVO AGORA

Pedro
Servidor A · Geral

Juliane
Servidor B · Conversa
```

Isso preserva o recurso que já existe hoje.

---

# 22. Botão de chamada

A referência aprovada possui chamada.

Não criar chamada direta falsa.

Enquanto DM voice call ainda não existir:

```text
botão oculto
```

ou:

```text
disabled
tooltip: "Em breve"
```

Preferência:

ocultar até existir funcionalidade real.

---

# 23. Solicitações de amizade

A referência coloca solicitações em destaque no painel direito.

Isso é desejável.

A tela atual já possui:

```text
receivedRequests
sentRequests
```

Mostrar um resumo no painel:

```text
Solicitações de amizade       2

Thiago
@thiago.dev
[ACEITAR]

Larissa
@larissa.art
[ACEITAR]

Ver todas
```

---

# 24. Recusar solicitação

A API atual recebida pelo componente possui:

```ts
onAcceptFriendRequest
```

mas não possui callback de recusa.

Portanto:

**não criar botão Recusar funcionalmente falso.**

Até existir suporte:

```text
[ACEITAR]
```

somente.

Pode existir especificação futura:

```ts
onDeclineFriendRequest
```

mas isso deve ser implementado em outra etapa.

---

# 25. Pedidos enviados

Podem continuar dentro da área completa de solicitações:

```text
Enviados
```

Não precisam ocupar espaço principal no painel direito.

---

# 26. Convites de servidor

A tela atual também possui:

```text
serverInvites
```

Mostrar resumo quando existirem:

```text
Convites de servidor

Concord Dev
por @pedro

[ENTRAR]
```

Não esconder recurso existente no redesign.

---

# 27. Sugestões de amizade

A referência visual possui:

```text
Sugestões para você
```

O backend atual não fornece:

```text
sugestões
amigos em comum
recomendações
```

Portanto:

**não implementar nesta etapa.**

Não preencher com dados fictícios.

Planejar como recurso futuro:

```text
Etapa futura — Friend Discovery
```

---

# 28. Amigos em comum

Também não existe no contrato atual.

Não adicionar contadores como:

```text
12 amigos em comum
```

sem dados reais.

---

# 29. Aba Adicionar amigo

A funcionalidade existente deve continuar acessível.

Pode sair da lista de tabs e virar:

```text
[ + Adicionar amigo ]
```

no cabeçalho ou próximo da busca.

Ao clicar, abrir:

```text
form inline
```

ou:

```text
modal/dialog
```

Preferência para esta etapa:

**manter a implementação existente e apenas redesenhar sua apresentação.**

Não introduzir modal novo se isso ampliar muito o escopo.

---

# 30. Formulário de adicionar amigo

Manter:

```text
@identificador
[Enviar pedido]
```

Melhorar estado visual:

```text
sucesso
erro
carregando
```

Não alterar regras de backend.

---

# 31. Solicitações como painel ou página

Desktop:

pode usar painel direito/resumo.

Mobile:

usar tela dedicada:

```text
← Solicitações                    2
```

como na referência aprovada.

---

# 32. Mobile

No mobile, não utilizar três colunas.

Estrutura inicial:

```text
┌──────────────────────────┐
│ Amigos            Filtro │
├──────────────────────────┤
│ Buscar amigos...         │
│                          │
│ Todos Online Ausentes    │
│                          │
│ Online — 8               │
│ Juliane                  │
│ Pedro                    │
│ Lucas                    │
│                          │
│ Ausentes — 3             │
│ Gabriel                  │
└──────────────────────────┘
```

---

# 33. Perfil no mobile

Ao tocar em um amigo:

```text
┌──────────────────────────┐
│ ←                        │
│                          │
│       [Avatar]           │
│       Juliane            │
│       ● Disponível       │
│                          │
│ [Mensagem] [Mais]        │
│                          │
│ Atividade                │
│ Em voz · Geral           │
└──────────────────────────┘
```

Pode ser uma subview local sem mudar a rota nesta primeira implementação.

---

# 34. Solicitações no mobile

Tela dedicada:

```text
┌──────────────────────────┐
│ ← Solicitações       2   │
├──────────────────────────┤
│ [Avatar] thiago.dev      │
│          @thiago.dev     │
│          [ACEITAR]       │
│                          │
│ [Avatar] larissa.art     │
│          @larissa.art    │
│          [ACEITAR]       │
└──────────────────────────┘
```

---

# 35. Sidebar

A Home/Amigos já vive ao lado de:

```text
HomeSidebar
```

Não duplicar navegação.

A Etapa 12 já define evolução da sidebar de mensagens diretas.

A Etapa 13 deve permanecer compatível com ela.

---

# 36. Consistência com a Etapa 12

As telas:

```text
Home/Amigos
Mensagens Diretas
```

devem parecer partes do mesmo produto.

Compartilhar:

```text
altura de headers
spacing
avatares
status
ícones
hover
tipografia
painéis
bordas
```

Evitar implementar dois designs diferentes.

---

# 37. Design system

Continuar usando:

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
--color-accent-soft
--color-accent-hover

--color-success
--color-warning
--color-danger
```

Não copiar o roxo da referência.

---

# 38. Cor de presença

Sugestão:

```text
online  → success
away    → warning
busy    → danger
offline → text-faint
```

Reutilizar o sistema atual sempre que possível.

---

# 39. Cards e linhas

Evitar excesso de cards com bordas fortes.

A lista principal deve continuar leve.

Sugestão:

```text
linha normal
↓
hover surface-raised
↓
selecionado accent-soft
```

Painel direito pode utilizar cards para informações secundárias.

---

# 40. Densidade

A referência aprovada possui boa densidade.

Objetivo:

```text
mais informação
sem parecer apertado
```

Linhas de amigos:

aproximadamente:

```text
54–64px
```

dependendo do viewport.

---

# 41. Avatares

Lista:

```text
32–38px
```

Painel detalhado:

```text
64–80px
```

Mobile profile:

```text
72–88px
```

Não fixar esses valores se conflitarem com `Avatar.tsx`.

---

# 42. Tipografia

Prioridade visual:

```text
nickname
↓
status
↓
username
```

Username não deve dominar a interface.

---

# 43. Ícones

Preferir SVGs consistentes.

Não depender de:

```text
♧
✉
⋮
```

como solução definitiva.

Se o projeto ainda não tiver biblioteca de ícones, criar pequenos componentes SVG internos.

Não instalar biblioteca grande apenas para esta tela.

---

# 44. Menu contextual

Continuar utilizando Radix UI já presente no projeto.

Não substituir o menu existente por implementação manual.

---

# 45. Ordenação

Ordenação atual já prioriza amigos com presença.

Melhorar para:

```text
online
busy
away
offline
```

e depois:

```text
nickname
```

Sugestão conceitual:

```ts
const priority = {
  online: 0,
  busy: 1,
  away: 2,
  offline: 3,
}
```

Não depender apenas de `Boolean(presence)`.

---

# 46. Estado offline

Hoje ausência de presença significa offline.

Preservar esse comportamento.

Também aceitar explicitamente:

```ts
presence.status === 'offline'
```

caso exista.

---

# 47. Estado vazio

Melhorar os estados vazios.

Exemplo:

```text
Nenhum amigo online agora.

Seus amigos aparecerão aqui quando estiverem disponíveis.
```

Para lista vazia:

```text
Você ainda não adicionou ninguém.

[Adicionar amigo]
```

---

# 48. Loading

Se os dados já chegam do componente pai sem loading explícito, não inventar skeleton complexo.

Se existir estado de carregamento disponível, usar.

Caso contrário:

não ampliar arquitetura apenas para skeleton nesta etapa.

---

# 49. Feedback

Preservar feedback de:

```text
adicionar amigo
aceitar solicitação
aceitar convite
```

Melhorar apresentação.

Pode utilizar:

```text
toast
feedback inline
```

mas não adicionar sistema global novo apenas por isso.

---

# 50. Ações rápidas

Na linha:

```text
[Mensagem] [...]
```

No painel detalhado:

```text
[Mensagem]
[Mais]
```

Ações devem ficar disponíveis sem abrir menu em excesso.

---

# 51. "Ativo agora"

O recurso atual deve continuar existindo.

Pode aparecer:

* no painel direito sem amigo selecionado;
* abaixo do perfil selecionado;
* como seção secundária.

Preferência:

```text
nenhum amigo selecionado
→ Ativo agora

amigo selecionado
→ informações desse amigo
```

---

# 52. Interação recomendada no desktop

```text
clicar na linha
→ selecionar amigo

clicar no ícone mensagem
→ abrir DM

clicar em ...
→ ações

clicar em solicitação
→ aceitar

clicar em Adicionar amigo
→ formulário
```

---

# 53. Interação recomendada no mobile

```text
clicar amigo
→ perfil do amigo

clicar Mensagem
→ abrir DM

voltar
→ lista

Solicitações
→ tela dedicada
```

---

# 54. Não implementar nesta etapa

Não misturar com:

```text
sugestões inteligentes
amigos em comum
jogos/atividade rica
Spotify
Rich Presence
bloqueio
remover amigo
recusar solicitação
DM voice call
video call
grupos privados
favoritos
notas
unread counts
```

Esses recursos podem ser planejados depois.

---

# 55. Sem backend desnecessário

A maior parte do redesign deve funcionar com:

```text
friends
friendRequests
serverInvites
presenceByUser
```

já fornecidos ao componente.

Não criar migrations apenas pelo redesign.

---

# 56. Componentização sugerida

Se `FriendsHome.tsx` ficar muito grande, considerar:

```text
workspace/friends/

FriendsHome.tsx
FriendsToolbar.tsx
FriendsList.tsx
FriendRow.tsx
FriendDetails.tsx
FriendRequests.tsx
AddFriendForm.tsx
```

Mas não criar componentes pequenos demais sem benefício.

---

# 57. Estado local possível

Pode ser necessário adicionar:

```ts
selectedFriendId
filter
search
```

O `search` já existe.

O `tab` atual pode ser evoluído ou reaproveitado.

Evitar manter:

```text
tab
+
filter
+
view
```

se representarem a mesma coisa.

---

# 58. Possível simplificação da navegação

O estado atual:

```text
online
all
pending
add
```

pode ser substituído conceitualmente por:

```text
view:
  friends
  pending
  add

filter:
  all
  online
  away
  offline
```

Isso separa melhor:

```text
qual área estou vendo
```

de:

```text
como estou filtrando amigos
```

Implementar apenas se tornar o código mais claro.

---

# 59. Responsividade

Validar:

```text
1920×1080
1440×900
1366×768
1024×768
390px mobile
```

Não permitir overflow horizontal.

---

# 60. Desktop menor

Em larguras menores:

```text
painel direito
```

pode reduzir largura.

Se necessário:

```text
< 1100px
→ painel direito ocultável
```

Não comprimir a lista a ponto de prejudicar leitura.

---

# 61. Tema claro

A tela deve ser validada em light mode.

Não usar:

```text
background preto fixo
texto branco fixo
roxo fixo
```

---

# 62. Outros temas

Preservar sistema de temas já existente.

O redesign não deve depender exclusivamente de:

```text
data-style-theme='concord'
```

a menos que essa seja a arquitetura atual para todas as telas.

---

# 63. Acessibilidade

Garantir:

* botões de ícone com `aria-label`;
* filtros com estado selecionado;
* navegação por teclado;
* contraste adequado;
* foco visível;
* menus Radix acessíveis;
* ações não dependentes apenas de cor.

---

# 64. Arquivos principais

Provavelmente alterar:

```text
apps/web/src/features/workspace/FriendsHome.tsx

apps/web/src/features/workspace/WorkspaceShell.css
```

Possivelmente:

```text
apps/web/src/features/workspace/HomeSidebar.tsx
```

somente para garantir consistência com a Etapa 12.

---

# 65. Contratos

Os contratos existentes já fornecem:

```text
PersonSummary
├── id
├── nickname
├── username
└── avatarUrl

FriendPresence
├── userId
├── status
├── voiceChannelName
└── voiceServerName
```

Isso é suficiente para o primeiro redesign.

Não ampliar os contratos para dados fictícios da referência.

---

# 66. Escopo inicial obrigatório

Implementar:

1. novo layout da Home;
2. busca redesenhada;
3. filtros por presença;
4. contadores;
5. lista mais rica;
6. ordenação por status;
7. seleção de amigo;
8. painel detalhado;
9. Ativo agora;
10. resumo de solicitações;
11. resumo de convites;
12. formulário de adicionar amigo;
13. responsividade;
14. mobile;
15. dark/light/themes.

---

# 67. Recursos visuais opcionais

Se o esforço for pequeno:

* grupos recolhíveis;
* pequenos indicadores de atividade;
* animações de hover;
* transições no painel de detalhes.

Não priorizar em relação à funcionalidade.

---

# 68. Critérios de aceite visual

A etapa estará satisfatória quando:

1. A Home parecer um hub social completo.

2. A presença dos amigos for percebida imediatamente.

3. A lista for fácil de escanear.

4. Filtros forem claros.

5. A busca estiver integrada ao layout.

6. O painel direito tiver função real.

7. Solicitações estiverem mais visíveis.

8. A seleção de um amigo mostrar informações úteis.

9. O usuário puder iniciar DM rapidamente.

10. Desktop e mobile tiverem boa hierarquia.

11. O design for coerente com a Etapa 12.

12. Light e dark mode funcionarem.

---

# 69. Critérios de aceite funcional

Preservar:

```text
buscar
abrir DM
aceitar solicitação
adicionar amigo
aceitar convite
mostrar presença
mostrar canal de voz
menu do amigo
copiar identificador
```

Nenhuma dessas funcionalidades pode regredir.

---

# 70. Não aceitar funcionalidades falsas

Se a referência mostrar algo que o sistema ainda não suporta:

```text
chamada
sugestão
amigos em comum
jogo atual
recusar
```

não implementar como se funcionasse.

Pode:

```text
omitir
```

ou documentar como futuro.

---

# 71. Ordem recomendada para o Codex

```text
ETAPA 1
Ler FriendsHome.tsx
e CSS relacionado.

        ↓

ETAPA 2
Preservar todas as funcionalidades atuais.

        ↓

ETAPA 3
Separar view e filtro, se necessário.

        ↓

ETAPA 4
Criar novo cabeçalho e busca.

        ↓

ETAPA 5
Criar filtros de presença e contadores.

        ↓

ETAPA 6
Redesenhar FriendRow.

        ↓

ETAPA 7
Implementar ordenação por status.

        ↓

ETAPA 8
Criar seleção de amigo.

        ↓

ETAPA 9
Criar painel contextual direito.

        ↓

ETAPA 10
Integrar Ativo agora.

        ↓

ETAPA 11
Integrar resumo de solicitações.

        ↓

ETAPA 12
Integrar convites.

        ↓

ETAPA 13
Redesenhar Adicionar amigo.

        ↓

ETAPA 14
Responsividade desktop.

        ↓

ETAPA 15
Implementar experiência mobile.

        ↓

ETAPA 16
Validar temas.

        ↓

ETAPA 17
Testes.

        ↓

ETAPA 18
Comparação visual com a referência.
```

---

# 72. Instrução para comparação com a referência

Depois da implementação:

1. abrir a tela em desktop;
2. comparar com o mockup aprovado;
3. verificar:

   * proporções;
   * densidade;
   * espaçamento;
   * hierarquia;
   * tamanho dos avatares;
   * posição das ações;
   * equilíbrio entre lista e painel;
4. ajustar diferenças relevantes;
5. não alterar cores do design system apenas para copiar a referência.

---

# 73. Resultado esperado

Desktop:

```text
┌────────┬────────────────────────────┬──────────────────────────────┐
│ Rail   │ Amigos                     │ Detalhes                     │
│        │                            │                              │
│        │ 🔍 Buscar                  │ [Avatar] Juliane             │
│        │                            │          ● Disponível         │
│        │ Todos Online Ausentes      │                              │
│        │                            │ [Mensagem] [...]             │
│        │ Online — 8                 │                              │
│        │                            │ Em voz                       │
│        │ Juliane              💬 ⋮ │ Comunidade · Geral           │
│        │ Pedro                💬 ⋮ │                              │
│        │ Lucas                💬 ⋮ │ Solicitações                 │
│        │                            │ Thiago       [Aceitar]       │
│        │ Ausentes — 3               │                              │
│        │ Gabriel              💬 ⋮ │ Convites                    │
│        │ Matheus              💬 ⋮ │ Concord Dev  [Entrar]       │
└────────┴────────────────────────────┴──────────────────────────────┘
```

---

# 74. Prioridade de UX

A ordem de prioridade da tela deve ser:

```text
PESSOAS
↓
PRESENÇA
↓
MENSAGEM
↓
ATIVIDADE
↓
SOLICITAÇÕES
↓
AÇÕES SECUNDÁRIAS
```

---

# 75. Decisão final

A Etapa 13 deve entregar:

```text
Home de Amigos moderna
+
presença muito mais clara
+
acesso rápido às DMs
+
painel contextual útil
+
solicitações mais visíveis
+
mobile adequado
+
mesma identidade da Etapa 12
```

Sem introduzir:

```text
backend desnecessário
dados fictícios
recursos sociais ainda inexistentes
```

O objetivo é melhorar profundamente a experiência usando os dados e funcionalidades que o Concord já possui.
