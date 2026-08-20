# Concord — Redesign da Tela de Mensagens Diretas

**Status:** Planejamento visual e técnico
**Objetivo:** Redesenhar a tela de mensagens privadas do Concord com base na referência visual aprovada, mantendo a identidade visual e a arquitetura atual do projeto.

---

# 1. Objetivo

A tela atual de mensagens diretas funciona, mas visualmente ainda parece uma implementação inicial.

O redesign deve transformar a conversa privada em uma área principal do Concord, com aparência de produto completo.

A referência visual aprovada possui:

* sidebar de conversas;
* cabeçalho completo da conversa;
* mensagens com melhor hierarquia;
* mensagens próprias diferenciadas;
* separadores de data;
* composer grande e completo;
* indicadores de presença;
* ações visuais no cabeçalho;
* melhor uso do espaço vazio;
* layout semelhante a aplicações modernas de comunicação.

A nova implementação deve seguir essa direção.

---

# 2. Regra importante sobre a imagem de referência

A imagem de referência deve ser utilizada principalmente para:

```text
estrutura
hierarquia
espaçamento
proporções
posicionamento
densidade
organização dos componentes
```

Não copiar obrigatoriamente:

```text
cores roxas
paleta específica da imagem
avatares demonstrativos
nomes demonstrativos
conteúdo fictício
```

O Concord já possui sistema próprio de temas.

Portanto:

```text
ROXO DA REFERÊNCIA
        ↓
var(--color-accent)
```

e:

```text
FUNDO DA REFERÊNCIA
        ↓
variáveis atuais de surface/canvas
```

A implementação deve continuar funcionando nos temas existentes.

---

# 3. Identidade do Concord

Não criar cores fixas como:

```css
background: #6d43d6;
color: #9871ff;
```

Preferir:

```css
background: var(--color-accent);
color: var(--color-text);
```

Utilizar prioritariamente:

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
--color-danger
--color-warning
```

Também preservar:

```text
--radius-control
--radius-panel
--border-width
--shadow-panel
```

---

# 4. Situação atual

A conversa privada hoje está concentrada em:

```text
apps/web/src/features/workspace/DirectMessagePanel.tsx
```

A estrutura atual é aproximadamente:

```text
DirectMessagePanel

├── Header
│   ├── botão voltar
│   ├── avatar
│   ├── nickname
│   └── username
│
├── Lista
│   ├── estado vazio
│   └── bubbles
│
└── Composer
    ├── botão +
    ├── input
    └── enviar
```

Isso funciona, mas é simples demais para o papel que a tela deve ter.

---

# 5. Estrutura desejada

A nova experiência deverá manter a arquitetura geral:

```text
┌──────────┬────────────────────┬──────────────────────────────────────────┐
│ Servidor │ Mensagens diretas  │ Conversa                                 │
│ Rail     │                    │                                          │
│          │ Buscar             │ Cabeçalho                                │
│          │ Amigos             ├──────────────────────────────────────────┤
│          │                    │                                          │
│          │ Mensagens diretas  │ Mensagens                                │
│          │                    │                                          │
│          │ Pedro              │                                          │
│          │ Juliane            │                                          │
│          │ João               │                                          │
│          │                    │                                          │
│          │                    ├──────────────────────────────────────────┤
│          │ usuário atual      │ Composer                                 │
└──────────┴────────────────────┴──────────────────────────────────────────┘
```

A sidebar existente não deve ser duplicada dentro de `DirectMessagePanel`.

Ela continuará pertencendo a:

```text
HomeSidebar.tsx
```

---

# 6. Cabeçalho da conversa

O cabeçalho atual é muito básico.

Transformar em algo semelhante à referência:

```text
┌─────────────────────────────────────────────────────────────┐
│ [Avatar] Juliane                               ☎  📹  🔍  ⋮ │
│          ● Disponível                                      │
└─────────────────────────────────────────────────────────────┘
```

---

# 7. Lado esquerdo do cabeçalho

Mostrar:

```text
Avatar
Nickname
Status
```

Exemplo:

```text
● Juliane
  Disponível
```

ou:

```text
Juliane
@juliane
```

Se presença estiver disponível, preferir:

```text
Disponível
Ausente
Não perturbe
Offline
```

O status deve usar o mesmo sistema visual já utilizado na tela de amigos.

---

# 8. Botão voltar

Desktop:

O botão voltar pode ser removido ou ficar visualmente discreto se a sidebar já estiver presente.

Mobile:

O botão voltar continua necessário.

Regra:

```text
desktop → oculto ou secundário
mobile  → visível
```

---

# 9. Ações do cabeçalho

Adicionar espaço visual para:

```text
chamada de voz
chamada de vídeo
fixados
buscar
mais opções
```

Primeira implementação pode possuir apenas UI para ações ainda indisponíveis.

Entretanto, botões sem funcionalidade devem:

* estar desabilitados;
* possuir tooltip como "Em breve";

ou não ser exibidos.

Não criar comportamento falso.

---

# 10. Prioridade inicial das ações

Implementar primeiro:

```text
Buscar
Mais opções
```

Preparar espaço visual para:

```text
Chamada de voz
Vídeo
Fixados
```

Essas funcionalidades podem ser implementadas posteriormente.

---

# 11. Área de mensagens

A área de mensagens deve utilizar mais largura e ter menos aparência de "chat de celular".

Evitar excesso de bubbles grandes.

A referência mistura:

```text
mensagem recebida → estrutura aberta
mensagem própria → destaque visual
```

Isso é uma boa direção para o Concord.

---

# 12. Mensagens recebidas

Preferência visual:

```text
[Avatar] Pedro                  16:32
         oi, tudo bem?
```

ou:

```text
[Avatar] Pedro  16:32
         oi, tudo bem?
```

Não é obrigatório envolver toda mensagem recebida em um bubble.

Isso dá aparência mais próxima de Discord/Slack.

---

# 13. Mensagens próprias

Mensagens do usuário atual podem continuar diferenciadas.

Exemplo:

```text
                              ┌────────────────────┐
                              │ Você        16:33 │
                              │ tudo sim, e você? │
                              └────────────────────┘
```

Utilizar:

```css
background: var(--color-accent);
color: var(--color-accent-contrast);
```

O bubble não deve ocupar largura excessiva.

Máximo recomendado:

```css
max-width: min(70%, 620px);
```

---

# 14. Agrupamento de mensagens

Mensagens consecutivas do mesmo autor em pouco tempo não precisam repetir:

```text
avatar
nickname
```

Exemplo:

```text
[Avatar] Pedro     16:32
         Oi

         Tudo bem?

         Você entrou hoje?
```

Considerar mensagens parte do mesmo grupo quando:

```text
mesmo autor
+
diferença pequena de horário
```

Sugestão inicial:

```text
até 5 minutos
```

Não é obrigatório modificar banco de dados para isso.

O agrupamento pode ser calculado no frontend.

---

# 15. Separadores de data

Adicionar separadores como:

```text
──────────────── Hoje ────────────────
```

ou:

```text
────────── 20 de agosto de 2026 ──────────
```

Critério:

* Hoje;
* Ontem;
* data completa para mensagens antigas.

---

# 16. Horários

Horário deve ficar menos chamativo.

Usar:

```css
color: var(--color-text-faint);
font: var(--font-label);
```

Não competir visualmente com a mensagem.

---

# 17. Avatares

Mensagens recebidas devem usar o avatar real do autor quando disponível.

Atualmente `DirectMessageSummary` pode não carregar `avatarUrl`.

Verificar contratos antes da implementação.

Se necessário, ampliar a consulta para obter:

```text
nickname
username
avatar_url
```

Não criar uma consulta separada para cada mensagem.

---

# 18. Estado inicial da conversa

O estado vazio atual:

```text
Conversa com X
Envie o primeiro sinal privado.
```

deve ser melhorado.

Sugestão:

```text
                [Avatar grande]

                Juliane

                @juliane

        Este é o começo da sua conversa
             com @juliane.
```

Opcional:

```text
Vocês são amigos no Concord.
```

Evitar um grande símbolo genérico `◌` como elemento principal.

---

# 19. Composer

O composer é uma das partes que mais precisa mudar.

Referência:

```text
┌────────────────────────────────────────────────────┐
│ + │ Digite uma mensagem...             🎁 GIF ☺ ➤ │
└────────────────────────────────────────────────────┘
```

---

# 20. Estrutura do composer

Criar algo próximo de:

```text
direct-composer
│
├── direct-composer-add
│
├── input/textarea
│
└── direct-composer-actions
    ├── emoji
    ├── GIF futuramente
    └── enviar
```

---

# 21. Textarea em vez de input

Considerar substituir:

```html
<input>
```

por:

```html
<textarea>
```

com crescimento automático limitado.

Comportamento desejado:

```text
1 linha
↓
2 linhas
↓
3 linhas
↓
máximo aproximado de 5 ou 6 linhas
↓
scroll interno
```

Isso permite mensagens maiores sem prejudicar a interface.

---

# 22. Envio por teclado

Comportamento:

```text
Enter
→ enviar

Shift + Enter
→ nova linha
```

Esse comportamento deve ser documentado na acessibilidade e testado.

---

# 23. Botão enviar

Continuar com botão destacado.

Exemplo:

```text
      ┌─────┐
      │  ➤  │
      └─────┘
```

ou ícone SVG.

Utilizar:

```text
var(--color-accent)
```

Evitar caracteres que mudem visualmente entre sistemas operacionais quando houver SVG disponível.

---

# 24. Botão de anexo

Hoje existe:

```text
+
```

mas não há funcionalidade implementada.

O redesign deve preservar espaço para anexos.

Se upload ainda não existir:

```text
botão desabilitado
+
tooltip "Anexos em breve"
```

ou esconder temporariamente.

Não implementar upload junto com o redesign visual sem solicitação específica.

---

# 25. Emoji

Pode ser incluído como espaço visual ou funcionalidade simples.

Entretanto, não adicionar biblioteca pesada de emoji somente pelo redesign.

Se não houver implementação simples:

```text
fase futura
```

---

# 26. GIF

Não implementar serviço de GIF nesta etapa.

Manter como possibilidade futura.

Especialmente porque APIs de GIF podem:

* exigir chave;
* possuir limites;
* envolver serviço externo.

Isso deve ser avaliado separadamente considerando o objetivo de custo zero.

---

# 27. Reações

A referência mostra:

```text
❤️ 1
```

Reações são desejáveis, mas devem ser uma etapa própria.

Não misturar obrigatoriamente:

```text
redesign
+
schema de reactions
+
backend
+
Realtime
```

na mesma alteração.

O CSS pode ser preparado.

---

# 28. Hover da mensagem

No desktop, ao passar o mouse sobre uma mensagem:

```text
                  [🙂] [↩] [⋮]
```

Pode aparecer uma barra pequena de ações.

Primeira versão:

```text
copiar mensagem
```

Outras futuras:

```text
reagir
responder
editar
apagar
```

Não mostrar ação que o backend ainda não suporta.

---

# 29. Busca

Adicionar ícone de busca no cabeçalho.

A implementação funcional pode vir depois.

Se for implementada já nesta etapa, realizar busca somente nas mensagens carregadas inicialmente.

Busca completa/paginada no banco deve ser tratada separadamente.

---

# 30. Scroll

A conversa deve abrir posicionada nas mensagens mais recentes.

Ao receber nova mensagem:

### Se usuário estiver próximo ao fim

```text
auto-scroll
```

### Se usuário estiver lendo mensagens antigas

Não forçar scroll.

Exibir algo como:

```text
↓ Novas mensagens
```

Isso é uma melhoria importante em relação à implementação atual.

---

# 31. Carregamento

Hoje a tela não possui estado visual de carregamento claro.

Adicionar:

```text
abrindo conversa
carregando mensagens
```

Evitar tela vazia piscando.

Pode utilizar skeleton simples.

Não adicionar biblioteca externa para skeleton.

---

# 32. Erros

Hoje erros aparecem próximos ao composer.

Melhorar hierarquia.

Erro de envio:

```text
Não foi possível enviar a mensagem.
[Tentar novamente]
```

Erro de abertura da conversa:

mostrar estado central.

Não substituir toda a conversa por erro pequeno abaixo da lista.

---

# 33. Envio otimista

Avaliar envio otimista.

Hoje:

```text
enviar
↓
Supabase
↓
Realtime
↓
reload das mensagens
```

A experiência pode parecer lenta.

Evolução desejada:

```text
usuário envia
↓
mensagem aparece imediatamente como "enviando"
↓
insert Supabase
↓
confirmação
```

Possíveis estados:

```text
enviando
enviada
erro
```

Isso pode ser implementado depois do redesign se aumentar muito o escopo.

---

# 34. Status da mensagem própria

Preparar UI para:

```text
✓ enviada
✓✓ entregue/lida futuramente
```

Não implementar "lida" sem infraestrutura real.

Inicialmente pode existir apenas:

```text
enviando
erro
```

---

# 35. Sidebar de mensagens

`HomeSidebar.tsx` já possui:

```text
buscar conversa
amigos
solicitações
lista de mensagens diretas
perfil atual
```

Manter estrutura.

Melhorar visual para aproximar da referência.

---

# 36. Item de conversa

Cada item deve mostrar:

```text
[Avatar] Nome
         presença/status
```

Em vez de priorizar sempre:

```text
@username
```

Exemplo:

```text
● Juliane
  Disponível
```

ou:

```text
Juliane
Offline
```

Username pode ficar disponível no tooltip/perfil.

---

# 37. Conversa ativa

A conversa atual deve possuir destaque mais claro.

Exemplo:

```css
.home-dm.active {
  background: var(--color-surface-raised);
}
```

Adicionar possibilidade de:

```text
barra lateral
accent soft
indicador
```

Sem exagerar.

---

# 38. Última mensagem

Futura melhoria desejável:

```text
Juliane
"beleza, até amanhã"
```

em vez de:

```text
Juliane
@juliane
```

Isso exige consulta/resumo da conversa e pode ficar para segunda fase.

---

# 39. Mensagens não lidas

Planejar para:

```text
Juliane            2
Nova mensagem...
```

Mas não implementar apenas visualmente sem estado real.

Pode ser criada etapa separada:

```text
DM unread state
```

---

# 40. Indicador de presença

Reutilizar o padrão atual:

```text
status-online
status-away
status-busy
status-offline
```

Evitar criar um segundo sistema de presença exclusivo para mensagens.

---

# 41. Layout central

A conversa deve ocupar praticamente toda a largura restante.

Evitar:

```text
grandes margens laterais calculadas pelo viewport
```

como a implementação atual.

Preferir:

```css
.direct-message-list {
  width: 100%;
  max-width: none;
}
```

com conteúdo interno confortável.

Sugestão:

```text
padding-left/right: 24px–32px
```

em desktop.

---

# 42. Largura das mensagens

Conteúdo textual individual pode possuir:

```text
max-width: 700–760px
```

sem limitar a coluna inteira.

Assim:

```text
área da conversa = larga
mensagem = legível
```

---

# 43. Fundo

A referência possui um fundo escuro relativamente uniforme.

No Concord usar:

```text
var(--color-canvas)
```

ou:

```text
var(--color-surface)
```

dependendo do tema.

Evitar `var(--color-overlay)` como fundo principal da conversa se isso estiver deixando a tela visualmente lavada/transparente.

---

# 44. Separação visual

Utilizar bordas leves entre:

```text
sidebar / conversa
header / mensagens
```

Composer não precisa obrigatoriamente de uma linha horizontal inteira.

Pode parecer flutuante dentro da base da conversa.

---

# 45. Composer flutuante

Direção visual preferida:

```text
                 ┌─────────────────────────┐
                 │ +  mensagem...     ☺ ➤ │
                 └─────────────────────────┘
```

com margem:

```text
16px–24px
```

do fundo e laterais.

---

# 46. Sombras

Utilizar com moderação:

```text
var(--shadow-panel)
```

O design deve continuar compatível com a identidade neo-industrial atual do Concord.

Não transformar a interface em glassmorphism.

---

# 47. Cantos

A referência possui cantos mais arredondados que o Concord atual.

Não substituir o sistema inteiro de radius.

Pode criar valores específicos para:

```text
bubble
composer
```

mantendo:

```text
--radius-control
--radius-panel
```

como base.

---

# 48. Desktop esperado

Estrutura:

```text
┌──────┬────────────┬─────────────────────────────────────────┐
│ Rail │ Sidebar DM │ Juliane                 ☎ 📹 🔍 ⋮       │
│      │            ├─────────────────────────────────────────┤
│      │ Buscar     │                                         │
│      │            │               Hoje                      │
│      │ Amigos     │                                         │
│      │            │ [J] Juliane  13:42                      │
│      │ DM         │     Oi, tudo bem?                       │
│      │            │                                         │
│      │ Juliane    │                      ┌──────────────┐    │
│      │ Pedro      │                      │ Tudo sim!    │    │
│      │ João       │                      └──────────────┘    │
│      │            │                                         │
│      │            │ [J] E você?                             │
│      │            │                                         │
│      │            ├─────────────────────────────────────────┤
│      │ Perfil     │  [+] Digite uma mensagem...       [➤]  │
└──────┴────────────┴─────────────────────────────────────────┘
```

---

# 49. Mobile esperado

No mobile:

```text
┌────────────────────────────┐
│ ← [Avatar] Juliane    ⋮    │
├────────────────────────────┤
│                            │
│ Hoje                       │
│                            │
│ Juliane                    │
│ Oi, tudo bem?              │
│                            │
│              Tudo sim!     │
│                            │
├────────────────────────────┤
│ +  Mensagem...        ➤    │
└────────────────────────────┘
```

Sidebar desaparece.

Botão voltar reaparece.

Composer deve respeitar:

```text
safe-area
teclado virtual
100dvh
```

---

# 50. Responsividade

Validar pelo menos:

```text
1920×1080
1440×900
1366×768
1024×768
mobile ~390px
```

Evitar overflow horizontal.

---

# 51. Componentização recomendada

Não deixar `DirectMessagePanel.tsx` virar um componente gigante.

Sugestão:

```text
workspace/direct-messages/

DirectMessagePanel.tsx
DirectMessageHeader.tsx
DirectMessageList.tsx
DirectMessageItem.tsx
DirectMessageComposer.tsx
DirectMessageEmpty.tsx
```

Entretanto:

**não criar essa estrutura apenas por estética se o código continuar pequeno.**

A extração deve ocorrer conforme a complexidade real.

---

# 52. Primeiro escopo de implementação

A primeira implementação deve focar em:

```text
REDESIGN VISUAL
+
melhor UX básica
```

Incluindo:

1. novo cabeçalho;
2. estado de presença;
3. novo layout das mensagens;
4. agrupamento visual;
5. separadores de data;
6. novo composer;
7. textarea;
8. Enter/Shift+Enter;
9. scroll correto;
10. estado vazio novo;
11. melhor responsividade.

---

# 53. Não misturar nesta primeira etapa

Deixar para etapas posteriores:

```text
reactions backend
attachments
GIFs
voice call from DM
video call
read receipts
message editing
message deletion
reply threads
pins
full-text search
unread counters
typing indicator
```

Podem existir espaços ou componentes preparados, mas sem falsa funcionalidade.

---

# 54. Segunda etapa futura

Depois do redesign:

```text
DM Interactions
```

Pode implementar:

```text
editar
apagar
responder
reagir
copiar
```

---

# 55. Terceira etapa futura

Depois:

```text
DM Rich Content
```

Com:

```text
anexos
imagens
links
previews
GIF
emoji picker
```

---

# 56. Quarta etapa futura

Depois:

```text
DM Presence & Realtime UX
```

Com:

```text
digitando...
não lidas
read receipts
última mensagem
ordenar sidebar por atividade
```

---

# 57. Banco de dados

Não modificar o schema apenas para realizar o redesign visual.

O banco atual já suporta:

```text
conversation_id
author_id
body
created_at
```

Isso é suficiente para a primeira fase.

Criar migrations apenas quando recursos adicionais realmente exigirem.

---

# 58. Realtime

Preservar Supabase Realtime existente.

Não substituir por polling.

Não recarregar dados mais do que necessário.

Uma melhoria posterior pode substituir o reload completo após cada evento por atualização incremental da lista.

---

# 59. Acessibilidade

Todos os botões de ícone precisam de:

```text
aria-label
```

Textarea:

```text
aria-label="Mensagem privada"
```

Ações de mensagem não podem depender exclusivamente de hover.

No mobile devem continuar acessíveis.

---

# 60. Ícones

Evitar caracteres como:

```text
☎
📹
🔍
⋮
```

como solução final se o projeto já possuir ou puder criar SVGs consistentes.

Preferir ícones vetoriais internos.

Não adicionar uma biblioteca grande apenas por causa de cinco ícones.

---

# 61. Performance

Evitar:

* renderização completa desnecessária;
* consultas por mensagem;
* listeners duplicados;
* múltiplos subscriptions da mesma conversa.

Se a conversa crescer muito, virtualização pode ser considerada futuramente.

Não é necessária nesta etapa.

---

# 62. Arquivos principais

Provavelmente alterar:

```text
apps/web/src/features/workspace/DirectMessagePanel.tsx

apps/web/src/features/workspace/HomeSidebar.tsx

apps/web/src/features/workspace/WorkspaceShell.css
```

Possivelmente:

```text
packages/contracts/src/index.ts
```

somente se precisar incluir dados já disponíveis como avatar/status.

Não alterar contratos desnecessariamente.

---

# 63. Design tokens

Toda estilização nova deve continuar compatível com:

```text
dark
light
outros temas existentes
```

Não criar CSS que só funcione no tema Concord dark.

---

# 64. Critérios de aceite visuais

A implementação deve ser considerada satisfatória quando:

1. A tela não parecer mais vazia ou provisória.

2. O cabeçalho identificar claramente com quem a conversa está acontecendo.

3. O status do amigo seja facilmente percebido.

4. Mensagens recebidas e enviadas tenham hierarquia distinta.

5. A conversa use bem o espaço disponível.

6. Horários fiquem visíveis sem chamar atenção excessiva.

7. Mensagens consecutivas possuam agrupamento visual natural.

8. Datas estejam separadas.

9. O composer seja visualmente uma parte importante da interface.

10. Mobile continue confortável.

11. Light e dark mode permaneçam funcionais.

12. A identidade visual do Concord seja mantida.

---

# 65. Critérios funcionais

Preservar:

```text
abrir conversa
carregar mensagens
Realtime
enviar mensagem
trocar de amigo
modo demo
erros
```

Não aceitar regressão funcional em troca do redesign.

---

# 66. Resultado esperado

A sensação final deve ser próxima de:

```text
Discord
+
Slack
+
identidade visual do Concord
```

Não deve parecer uma cópia exata de nenhuma dessas plataformas.

A referência visual deve orientar principalmente:

```text
densidade
layout
organização
hierarquia
composer
cabeçalho
mensagens
```

---

# 67. Ordem recomendada para o Codex

```text
ETAPA 1

Leia:
DirectMessagePanel.tsx
HomeSidebar.tsx
WorkspaceShell.css
tema atual

        ↓

ETAPA 2

Refatore somente o markup necessário
para suportar o novo layout.

        ↓

ETAPA 3

Implemente o novo cabeçalho.

        ↓

ETAPA 4

Implemente agrupamento visual
das mensagens.

        ↓

ETAPA 5

Implemente separadores de data.

        ↓

ETAPA 6

Refaça o composer.

        ↓

ETAPA 7

Implemente textarea + Enter/Shift+Enter.

        ↓

ETAPA 8

Melhore estado vazio,
loading e erros.

        ↓

ETAPA 9

Ajuste HomeSidebar.

        ↓

ETAPA 10

Desktop responsivo.

        ↓

ETAPA 11

Mobile.

        ↓

ETAPA 12

Dark/light/themes.

        ↓

ETAPA 13

Testes.

        ↓

ETAPA 14

Revisão visual final.
```

---

# 68. Instrução final para implementação

Ao implementar esta documentação:

* use a imagem aprovada como referência visual;
* não copie cegamente cores da imagem;
* preserve o sistema de temas do Concord;
* preserve toda funcionalidade existente;
* não implemente recursos de backend fora do escopo;
* não faça refatorações não relacionadas;
* priorize primeiro o redesign e a experiência básica;
* mantenha a interface preparada para evoluções futuras;
* valide desktop e mobile;
* valide temas claro e escuro;
* execute os testes existentes ao final.

O objetivo da primeira entrega é fazer a tela de mensagens privadas parecer uma funcionalidade madura do Concord antes de adicionar recursos avançados.
