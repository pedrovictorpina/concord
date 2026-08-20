# Concord Design System — Neo Brutalism

**Versão:** 2.0  
**Style Theme:** Neo Brutalism  
**Modo padrão recomendado:** Dark  
**Status:** Tema alternativo oficial do Concord  
**Objetivo:** oferecer uma identidade visual mais ousada, rígida e expressiva sem alterar a arquitetura, acessibilidade ou comportamento dos componentes do Concord.

---

# 1. Conceito

O tema Neo Brutalism do Concord deve transmitir:

```text
forte
+
direto
+
digital
+
tátil
+
ousado
+
funcional
```

A identidade é construída principalmente através de:

```text
bordas grossas
+
sombras sólidas
+
alto contraste
+
cores intensas
+
cantos quase retos
+
tipografia forte
+
movimento físico dos componentes
```

O tema deve parecer claramente diferente do tema padrão do Concord, mas continuar utilizando os mesmos componentes e funcionalidades.

---

# 2. Princípio arquitetural

Neo Brutalism é um:

```text
Style Theme
```

e não uma aplicação diferente.

A estrutura deve permanecer:

```text
Concord
├── Default
│   ├── Dark
│   └── Light
│
└── Neo Brutalism
    ├── Dark
    └── Light
```

Portanto:

```text
comportamento
estado
responsividade
acessibilidade
dados
arquitetura
```

não devem depender do tema visual.

---

# 3. Nome interno recomendado

```ts
neo
```

ou:

```ts
neo-brutalism
```

Preferência:

```ts
neo
```

por ser curto e adequado para atributos HTML.

Exemplo:

```html
<html
  data-style-theme="neo"
  data-color-mode="dark"
>
```

---

# 4. Tipografia principal

Utilizar:

```text
Space Grotesk
```

como fonte principal.

CSS:

```css
--font-body:
  'Space Grotesk',
  'Segoe UI',
  system-ui,
  sans-serif;

--font-display:
  'Space Grotesk',
  'Arial Black',
  sans-serif;
```

---

# 5. Fonte monoespaçada

Utilizar:

```text
IBM Plex Mono
```

para:

- labels pequenas;
- códigos;
- informações técnicas;
- eyebrows;
- indicadores;
- contadores especiais.

CSS:

```css
--font-mono:
  'IBM Plex Mono',
  Consolas,
  monospace;
```

---

# 6. Import das fontes

Se o projeto ainda carregar fontes através do Google Fonts:

```css
@import url(
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@400;500;600;700&display=swap'
);
```

Não duplicar imports se as fontes já estiverem disponíveis globalmente.

---

# 7. Pesos

```text
400 — Regular
500 — Medium
600 — Semi Bold
700 — Bold
```

Neo Brutalism pode utilizar mais:

```text
600
700
```

do que o tema padrão.

Mesmo assim, evitar colocar toda a interface em bold.

---

# 8. Escala tipográfica

| Token | Tamanho | Line-height | Peso |
|---|---:|---:|---:|
| Display 1 | 32px | 40px | 700 |
| Display 2 | 24px | 32px | 700 |
| Heading 1 | 20px | 28px | 700 |
| Heading 2 | 16px | 24px | 600 |
| Heading 3 | 14px | 20px | 600 |
| Body Large | 16px | 24px | 400 |
| Body Base | 14px | 20px | 400 |
| Body Small | 12px | 16px | 400 |
| Caption | 11px | 16px | 400 |

---

# 9. Títulos

Títulos podem possuir:

```css
letter-spacing: -0.02em;
```

Display pode ser ainda mais compacto:

```css
letter-spacing: -0.03em;
```

Evitar:

```text
letter-spacing muito positivo
```

em títulos grandes.

---

# 10. Labels técnicas

Utilizar:

```css
font-family: var(--font-mono);
font-weight: 600;
font-size: 10px;
text-transform: uppercase;
letter-spacing: 0.04em;
```

Exemplos:

```text
CANAIS DE TEXTO
ONLINE — 8
CONFIGURAÇÕES
BETA
```

---

# 11. Tema Dark

O Dark é a versão principal do Neo Brutalism.

Paleta oficial:

```css
[data-style-theme='neo'][data-color-mode='dark'] {
  --color-canvas: #090b10;

  --color-surface: #171c25;
  --color-surface-raised: #222936;
  --color-surface-sunken: #10141b;

  --color-text: #f7f2e8;
  --color-text-strong: #ffffff;
  --color-text-muted: #d6d8e0;
  --color-text-faint: #969dac;

  --color-accent: #00ff33;
  --color-accent-hover: #00d92b;
  --color-accent-contrast: #090b10;
  --color-accent-soft: #0d3a19;

  --color-secondary: #bb00ff;
  --color-secondary-soft: #321040;

  --color-border: #020306;
  --color-border-soft: #303846;
  --color-border-strong: #020306;

  --color-success: #13a86b;
  --color-warning: #ffb84d;
  --color-danger: #e84545;
  --color-info: #00ff33;

  --color-overlay: rgba(9, 11, 16, 0.88);
}
```

---

# 12. Identidade Dark

A combinação principal é:

```text
PRETO / AZUL ESCURO
+
VERDE NEON
+
ROXO
```

Hierarquia:

```text
Verde
→ identidade e ação principal

Roxo
→ foco secundário e destaque especial

Azul/cinza escuro
→ superfícies

Preto
→ bordas e sombras
```

---

# 13. Verde principal

```css
#00ff33
```

É a principal cor de identidade do Neo Brutalism Dark.

Utilizar para:

- botão primário;
- canal ativo;
- opção selecionada;
- foco;
- indicadores especiais;
- status online quando apropriado;
- pequenos títulos de seção;
- links de alta prioridade.

---

# 14. Verde hover

```css
#00d92b
```

---

# 15. Verde soft

```css
#0d3a19
```

Uso:

- background de item selecionado;
- cards ativos;
- badge primário;
- hover contextual.

---

# 16. Roxo

```css
#bb00ff
```

O roxo deve ser secundário.

Utilizar em:

- focus ring;
- recursos especiais;
- estado experimental;
- badge "Em breve";
- detalhes visuais;
- seleção alternativa.

Não usar roxo como CTA principal.

---

# 17. Tema Light

O tema claro deve continuar sendo Neo Brutalism, mas não utilizar a antiga combinação índigo + amarelo como identidade principal.

Nova proposta:

```css
[data-style-theme='neo'][data-color-mode='light'] {
  --color-canvas: #f4f1e8;

  --color-surface: #fffdf7;
  --color-surface-raised: #ffffff;
  --color-surface-sunken: #e8edf7;

  --color-text: #111827;
  --color-text-strong: #05070a;
  --color-text-muted: #374151;
  --color-text-faint: #6b7280;

  --color-accent: #315bea;
  --color-accent-hover: #2448bd;
  --color-accent-contrast: #ffffff;
  --color-accent-soft: #dfe7ff;

  --color-secondary: #d946ef;
  --color-secondary-soft: #f8ddff;

  --color-border: #111111;
  --color-border-soft: #374151;
  --color-border-strong: #000000;

  --color-success: #109861;
  --color-warning: #f59e0b;
  --color-danger: #e54848;
  --color-info: #2563eb;

  --color-overlay: rgba(244, 241, 232, 0.88);
}
```

---

# 18. Identidade Light

Combinação principal:

```text
CREME
+
BRANCO
+
AZUL FORTE
+
ROXO
+
PRETO
```

Objetivo:

```text
alto contraste
```

sem produzir uma interface excessivamente amarela.

---

# 19. Azul principal Light

```css
#315bea
```

Usar onde o Dark utiliza:

```text
verde neon
```

Isso evita uma interface clara excessivamente saturada de verde.

---

# 20. Roxo Light

```css
#d946ef
```

Pode aparecer como cor secundária.

---

# 21. Superfícies Dark

Hierarquia:

```text
Canvas
#090b10

Surface
#171c25

Surface Raised
#222936

Surface Sunken
#10141b
```

---

# 22. Superfícies Light

```text
Canvas
#f4f1e8

Surface
#fffdf7

Surface Raised
#ffffff

Surface Sunken
#e8edf7
```

---

# 23. Bordas

Bordas são fundamentais no Neo Brutalism.

Escala:

```css
--border-width-thin: 1px;
--border-width: 2px;
--border-width-strong: 3px;
```

---

# 24. Uso das bordas

## 1px

Somente para:

- divisores;
- tabelas densas;
- elementos internos pequenos.

## 2px

Padrão para:

- inputs;
- selects;
- botões;
- toggles;
- badges.

## 3px

Utilizar em:

- cards importantes;
- modal;
- painel ativo;
- componentes em destaque;
- elementos principais.

---

# 25. Bordas não devem ser transparentes

Neo Brutalism depende de separação forte.

Evitar usar:

```text
rgba extremamente suave
```

como borda principal.

Preferir:

```css
border-color: var(--color-border);
```

---

# 26. Raios

O tema utiliza cantos quase retos.

Escala:

```css
--radius-none: 0px;
--radius-xs: 2px;
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-pill: 999px;
```

---

# 27. Uso de radius

## 0px

Permitido em:

- banners;
- tabelas;
- caixas especiais;
- elementos editoriais.

## 2–4px

Preferencial para:

- botões;
- inputs;
- tags;
- badges.

## 6px

Cards.

## 8px

Painéis maiores.

## 12px

Somente grandes containers ou modais quando necessário.

---

# 28. Evitar cards excessivamente arredondados

Não utilizar:

```text
16px
20px
24px
```

como radius comum neste tema.

Isso enfraquece a identidade Neo Brutalism.

---

# 29. Sombras duras

Sombras devem possuir:

```text
blur = 0
```

Nunca:

```text
box-shadow: 0 10px 30px blur
```

como padrão.

---

# 30. Sombras Dark

```css
--shadow-sm:
  4px 4px 0 #05060a;

--shadow-md:
  8px 8px 0 #05060a;

--shadow-lg:
  12px 12px 0 #05060a;

--shadow-button:
  4px 4px 0 #05060a;
```

---

# 31. Sombras Light

```css
--shadow-sm:
  4px 4px 0 #111111;

--shadow-md:
  8px 8px 0 #111111;

--shadow-lg:
  12px 12px 0 #111111;

--shadow-button:
  4px 4px 0 #111111;
```

---

# 32. Regra das sombras

Quanto mais importante o componente:

```text
maior a sombra
```

Sugestão:

```text
button       → 4px
card         → 4–8px
popover      → 8px
modal        → 12px
```

---

# 33. Movimento físico

Botões devem parecer objetos físicos.

Normal:

```text
[ BOTÃO ]
    ███ shadow
```

Hover:

```css
transform: translate(-2px, -2px);
```

e sombra aumenta visualmente.

---

# 34. Active

Quando pressionado:

```css
transform: translate(2px, 2px);
box-shadow: 1px 1px 0 var(--color-border);
```

Isso cria sensação de botão sendo pressionado.

---

# 35. Transition

```css
--motion-fast: 140ms;
--motion-normal: 200ms;
```

Easing:

```css
ease
```

ou:

```css
cubic-bezier(0.2, 0, 0, 1);
```

---

# 36. Espaçamento

Base:

```text
4px
```

Escala:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

---

# 37. Densidade

Neo Brutalism pode utilizar um pouco mais de espaço que o tema padrão.

Especialmente em:

```text
cards
buttons
headers
modais
```

O objetivo é permitir que as bordas e sombras respirem.

---

# 38. Botões

Tipos oficiais:

```text
Primário
Secundário
Terciário
Destrutivo
Disabled
```

---

# 39. Botão primário Dark

```css
background: #00ff33;
color: #090b10;

border:
  2px solid #020306;

box-shadow:
  4px 4px 0 #05060a;
```

---

# 40. Botão primário Light

```css
background: #315bea;
color: #ffffff;

border:
  2px solid #111111;

box-shadow:
  4px 4px 0 #111111;
```

---

# 41. Botão secundário Dark

Pode utilizar roxo:

```css
background: #bb00ff;
color: #ffffff;
```

quando houver uma ação secundária importante.

Para ações secundárias comuns:

```css
background: var(--color-surface);
color: var(--color-text);
```

---

# 42. Botão secundário Light

```css
background: #d946ef;
color: #111111;
```

ou:

```css
background: var(--color-surface);
```

dependendo da hierarquia.

---

# 43. Botão terciário

Pode utilizar cor de destaque quente.

Sugestão Dark:

```text
warning #ffb84d
```

Sugestão Light:

```text
warning #f59e0b
```

Não usar botão terciário colorido em excesso.

---

# 44. Botão destrutivo

```css
background: var(--color-danger);
color: #ffffff;
```

Sempre:

```text
border preta
+
hard shadow
```

---

# 45. Disabled

```text
surface neutra
texto faint
sombra reduzida
sem movimento
```

Exemplo:

```css
opacity: 0.55;
box-shadow: 2px 2px 0 var(--color-border);
```

---

# 46. Focus

Dark:

```css
box-shadow:
  0 0 0 3px #bb00ff;
```

Light:

```css
box-shadow:
  0 0 0 3px #d946ef;
```

Focus deve ser extremamente visível.

---

# 47. Inputs

Estrutura:

```css
background: var(--color-surface);
color: var(--color-text);

border:
  2px solid var(--color-border);

border-radius:
  4px;
```

---

# 48. Input Focus Dark

```css
border-color: #00ff33;

box-shadow:
  0 0 0 3px #bb00ff;
```

---

# 49. Input Focus Light

```css
border-color: #315bea;

box-shadow:
  0 0 0 3px #d946ef;
```

---

# 50. Input Error

```css
border-color: var(--color-danger);
```

Mensagem:

```text
Esta informação é obrigatória.
```

sempre visível.

---

# 51. Input Disabled

```text
surface-sunken
+
texto faint
+
sem shadow de foco
```

---

# 52. Textarea

Segue exatamente o padrão dos inputs.

Para mensagens:

```text
Enter
→ enviar

Shift + Enter
→ nova linha
```

Quando aplicável.

---

# 53. Select

Dropdown:

```text
border 2px
shadow 8px
surface
radius 4px
```

Opção selecionada Dark:

```text
background verde
texto preto
```

Light:

```text
background azul
texto branco
```

---

# 54. Checkbox

Desmarcado:

```text
surface
+
border 2px
```

Marcado Dark:

```text
verde neon
+
check preto
```

Marcado Light:

```text
azul
+
check branco
```

---

# 55. Radio

Selecionado:

Dark:

```text
ring verde
+
centro verde
```

Light:

```text
ring azul
+
centro azul
```

---

# 56. Switch

Dark ligado:

```text
track #00ff33
thumb #090b10
```

Light ligado:

```text
track #315bea
thumb branco
```

Track deve possuir:

```text
border 2px solid
```

---

# 57. Badges

No Neo Brutalism, badges também possuem borda.

```css
border:
  2px solid var(--color-border);

box-shadow:
  2px 2px 0 var(--color-border);

border-radius:
  2px;
```

---

# 58. Badge Novo

Dark:

```text
verde
```

Light:

```text
verde
```

---

# 59. Badge Beta

```text
azul
```

---

# 60. Badge Em breve

```text
roxo
```

---

# 61. Badge Sucesso

```text
verde
```

---

# 62. Badge Aviso

```text
laranja / âmbar
```

---

# 63. Badge Erro

```text
vermelho
```

---

# 64. Badge Info

Dark:

```text
verde ou azul auxiliar
```

Light:

```text
azul
```

---

# 65. Badge Neutro

```text
cinza
```

---

# 66. Tags

Formato:

```text
┌──────────────┐
│ Tecnologia × │
└──────────────┘
```

Borda:

```text
2px
```

Radius:

```text
2px
```

Sem pill exagerada.

---

# 67. Cards

Neo Brutalism cards devem parecer blocos físicos.

```css
background:
  var(--color-surface);

border:
  3px solid var(--color-border);

border-radius:
  6px;

box-shadow:
  var(--shadow-sm);
```

---

# 68. Card Hover

Quando interativo:

```css
transform: translate(-2px, -2px);
box-shadow: var(--shadow-md);
```

---

# 69. Card Selected Dark

```css
border-color: #00ff33;
```

Pode utilizar:

```css
background: #0d3a19;
```

com moderação.

---

# 70. Card Selected Light

```css
border-color: #315bea;
background: #dfe7ff;
```

---

# 71. Navegação

Sidebar Dark:

```css
background: #10141b;
```

---

# 72. Navegação ativa Dark

```css
background: #00ff33;
color: #090b10;
```

Adicionar barra lateral:

```css
background: #bb00ff;
```

---

# 73. Navegação Light

Sidebar:

```css
background: #111827;
color: #ffffff;
```

Mesmo no tema claro, a sidebar pode permanecer escura.

Isso cria contraste e preserva a personalidade Neo Brutalism.

---

# 74. Item ativo Light

```css
background: #315bea;
color: #ffffff;
```

Barra:

```css
background: #d946ef;
```

---

# 75. Canal ativo

Dark:

```text
verde neon
```

ou:

```text
verde soft + border verde
```

Dependendo da densidade.

---

# 76. Modais

Modal padrão:

```text
border 3px
radius 4–6px
shadow 12px
```

Dark:

```css
background: #171c25;
border-color: #020306;
box-shadow: 12px 12px 0 #05060a;
```

---

# 77. Backdrop Dark

```css
background:
  rgba(9, 11, 16, 0.82);
```

Evitar blur forte.

Neo Brutalism prefere separação nítida.

---

# 78. Modal Light

```css
background: #fffdf7;
border: 3px solid #111111;
box-shadow: 12px 12px 0 #111111;
```

---

# 79. Modal destrutivo

A moldura pode utilizar:

```text
vermelho
```

Exemplo:

```css
border-color: var(--color-danger);
```

Título:

```text
TEM CERTEZA?
```

Botão final:

```text
EXCLUIR
```

---

# 80. Sheets Mobile

Sheet pode manter:

```text
border-top: 3px solid
```

e sombra sólida.

Não precisa necessariamente ter cantos arredondados.

---

# 81. Alerts

Alertas possuem:

```text
border 2px
```

ou:

```text
3px
```

e sem blur.

---

# 82. Success Alert

Dark:

```text
border verde
```

Light:

```text
border verde
```

---

# 83. Warning Alert

```text
border warning
```

---

# 84. Error Alert

```text
border danger
```

---

# 85. Info Alert

Dark:

```text
border verde/azul
```

Light:

```text
border azul
```

---

# 86. Tabelas

Tabelas devem parecer grades.

Utilizar:

```text
bordas claras e deliberadas
```

Header:

```text
surface-raised
+
bold
+
uppercase pequeno
```

---

# 87. Linha hover Dark

```css
background:
  #0d3a19;
```

---

# 88. Linha hover Light

```css
background:
  #dfe7ff;
```

---

# 89. Menus

Dropdown/Context menu:

```text
border 2px
shadow 8px
radius 4px
```

Não utilizar efeito de vidro.

---

# 90. Item hover Dark

```text
verde soft
```

---

# 91. Item selecionado Dark

```text
verde neon
+
texto preto
```

---

# 92. Menus destrutivos

Separar visualmente:

```text
────────────
Excluir
Banir
Sair
```

Utilizar vermelho.

---

# 93. Tooltips

Também podem possuir linguagem brutalista.

```text
background forte
border 2px
radius 2px
```

Sem sombras borradas.

---

# 94. Progress Bar

Track:

```text
border 2px
```

Fill Dark:

```text
verde
```

Fill Light:

```text
azul
```

Pode utilizar padrão segmentado.

---

# 95. Scrollbar Dark

Track:

```text
surface
```

Thumb:

```text
verde
```

Hover:

```text
roxo
```

---

# 96. Scrollbar Light

Track:

```text
cinza muito claro
```

Thumb:

```text
azul
```

---

# 97. Avatares

Avatares podem continuar circulares.

Eles são uma exceção válida ao radius rígido.

Status deve usar:

```text
border grossa
```

para se destacar.

---

# 98. Speaker ativo

Dark:

```css
box-shadow:
  0 0 0 3px #00ff33,
  5px 5px 0 #05060a;
```

---

# 99. Speaker ativo Light

```css
box-shadow:
  0 0 0 3px #315bea,
  5px 5px 0 #111111;
```

---

# 100. Mensagens

Não colocar toda mensagem dentro de card brutalista.

Isso tornaria o chat excessivamente pesado.

Utilizar Neo Brutalism em:

```text
headers
composer
ações
menus
separadores
hover
```

e manter a área de texto relativamente limpa.

---

# 101. Composer

Pode utilizar:

```text
border 3px
shadow 4px
radius 4px
```

Dark:

```css
background: #171c25;
```

Focus:

```text
borda verde
+
ring roxo
```

---

# 102. DM própria

Se a DM utilizar bubble própria:

Dark:

```text
verde soft
+
border 2px verde
```

Evitar:

```text
verde neon preenchendo um bubble enorme
```

---

# 103. Voice Tiles

Tiles do canal de voz são bons candidatos ao estilo brutalista.

```text
border grossa
+
hard shadow
```

Speaker ativo:

```text
verde
```

Screen share:

```text
borda forte
```

---

# 104. Screen Share ativo

Dark:

```text
border verde neon
```

Tela destacada pode possuir:

```text
shadow 8px
```

---

# 105. Ícones

Preferir SVG outline.

Stroke:

```text
1.75–2px
```

Em botões Neo Brutalism, ícones podem parecer um pouco mais pesados.

---

# 106. Ícones coloridos

Usar com moderação.

Principalmente:

```text
verde
roxo
warning
danger
```

Não criar uma interface arco-íris.

---

# 107. Z-index

```css
--z-base: 0;
--z-sticky: 10;
--z-dropdown: 100;
--z-popover: 200;
--z-modal: 500;
--z-toast: 600;
--z-tooltip: 700;
```

---

# 108. Motion

Hover:

```text
deslocamento curto
```

Não utilizar:

```text
scale grande
bounce
spring exagerado
```

---

# 109. Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

Evitar remoção que prejudique estados essenciais.

---

# 110. Responsividade

A estética Neo Brutalism não deve provocar:

```text
overflow
```

por causa das sombras.

Considerar no layout:

```text
shadow offset
```

ao calcular gaps e paddings.

---

# 111. Mobile

No mobile:

- diminuir sombras;
- preservar border 2px;
- diminuir offsets;
- manter touch target >= 44px.

Sugestão:

```text
Desktop shadow:
8px

Mobile:
4px
```

---

# 112. Mobile Button

Pode utilizar:

```text
shadow 3px
```

para não desperdiçar área útil.

---

# 113. Mobile Modal

Utilizar:

```text
border 2–3px
shadow 4px
```

não `12px`.

---

# 114. CSS base

```css
:root[data-style-theme='neo'] {
  --font-body:
    'Space Grotesk',
    'Segoe UI',
    system-ui,
    sans-serif;

  --font-display:
    'Space Grotesk',
    'Arial Black',
    sans-serif;

  --font-mono:
    'IBM Plex Mono',
    Consolas,
    monospace;

  --font-label:
    600 10px/1.2 var(--font-mono);

  --border-width:
    2px;

  --border-width-strong:
    3px;

  --radius-control:
    4px;

  --radius-panel:
    6px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  --motion-fast: 140ms;
  --motion-normal: 200ms;
}
```

---

# 115. Dark CSS recomendado

```css
:root[data-style-theme='neo'][data-color-mode='dark'] {
  --color-canvas: #090b10;

  --color-surface: #171c25;
  --color-surface-raised: #222936;
  --color-surface-sunken: #10141b;

  --color-border: #020306;
  --color-border-soft: #303846;
  --color-border-strong: #020306;

  --color-text: #f7f2e8;
  --color-text-strong: #ffffff;
  --color-text-muted: #d6d8e0;
  --color-text-faint: #969dac;

  --color-accent: #00ff33;
  --color-accent-hover: #00d92b;
  --color-accent-contrast: #090b10;
  --color-accent-soft: #0d3a19;

  --color-secondary: #bb00ff;
  --color-secondary-soft: #321040;

  --color-warning: #ffb84d;
  --color-danger: #e84545;
  --color-success: #13a86b;
  --color-info: #00ff33;

  --color-overlay:
    rgba(9, 11, 16, 0.88);

  --shadow-sm:
    4px 4px 0 #05060a;

  --shadow-panel:
    8px 8px 0 #05060a;

  --shadow-modal:
    12px 12px 0 #05060a;

  --shadow-button:
    4px 4px 0 #05060a;

  --focus-ring:
    0 0 0 3px #bb00ff;
}
```

---

# 116. Light CSS recomendado

```css
:root[data-style-theme='neo'][data-color-mode='light'] {
  --color-canvas: #f4f1e8;

  --color-surface: #fffdf7;
  --color-surface-raised: #ffffff;
  --color-surface-sunken: #e8edf7;

  --color-border: #111111;
  --color-border-soft: #374151;
  --color-border-strong: #000000;

  --color-text: #111827;
  --color-text-strong: #05070a;
  --color-text-muted: #374151;
  --color-text-faint: #6b7280;

  --color-accent: #315bea;
  --color-accent-hover: #2448bd;
  --color-accent-contrast: #ffffff;
  --color-accent-soft: #dfe7ff;

  --color-secondary: #d946ef;
  --color-secondary-soft: #f8ddff;

  --color-warning: #f59e0b;
  --color-danger: #e54848;
  --color-success: #109861;
  --color-info: #2563eb;

  --color-overlay:
    rgba(244, 241, 232, 0.88);

  --shadow-sm:
    4px 4px 0 #111111;

  --shadow-panel:
    8px 8px 0 #111111;

  --shadow-modal:
    12px 12px 0 #111111;

  --shadow-button:
    4px 4px 0 #111111;

  --focus-ring:
    0 0 0 3px #d946ef;
}
```

---

# 117. Botão Neo Brutalism

Exemplo conceitual:

```css
.neo-button {
  border:
    var(--border-width)
    solid
    var(--color-border);

  border-radius:
    var(--radius-control);

  background:
    var(--color-accent);

  color:
    var(--color-accent-contrast);

  box-shadow:
    var(--shadow-button);

  font-family:
    var(--font-body);

  font-weight:
    700;

  transition:
    transform var(--motion-fast),
    box-shadow var(--motion-fast),
    background var(--motion-fast);
}

.neo-button:hover:not(:disabled) {
  transform:
    translate(-2px, -2px);
}

.neo-button:active:not(:disabled) {
  transform:
    translate(2px, 2px);

  box-shadow:
    1px 1px 0
    var(--color-border);
}

.neo-button:focus-visible {
  outline: none;
  box-shadow:
    var(--focus-ring),
    var(--shadow-button);
}
```

---

# 118. Cards Neo Brutalism

```css
.neo-card {
  background:
    var(--color-surface);

  border:
    var(--border-width-strong)
    solid
    var(--color-border);

  border-radius:
    var(--radius-panel);

  box-shadow:
    var(--shadow-sm);
}
```

---

# 119. Modais Neo Brutalism

```css
.neo-modal {
  background:
    var(--color-surface);

  border:
    var(--border-width-strong)
    solid
    var(--color-border);

  border-radius:
    var(--radius-panel);

  box-shadow:
    var(--shadow-modal);
}
```

---

# 120. Inputs Neo Brutalism

```css
.neo-input {
  background:
    var(--color-surface);

  color:
    var(--color-text);

  border:
    var(--border-width)
    solid
    var(--color-border);

  border-radius:
    var(--radius-control);

  min-height:
    40px;

  padding:
    8px 12px;
}

.neo-input:focus {
  outline:
    none;

  border-color:
    var(--color-accent);

  box-shadow:
    var(--focus-ring);
}
```

---

# 121. Tema aplicado

No sistema de temas:

```text
Estilo:
Neo Brutalism

Modo:
Sistema
Claro
Escuro
```

---

# 122. Preview na tela de configurações

O card de seleção pode mostrar:

```text
NEO BRUTALISM

██████
█ ▣ █
██████

Bordas fortes
Sombras duras
Alto contraste
```

---

# 123. Preview Dark

Mostrar pelo menos:

```text
sidebar preta
canal ativo verde
card escuro
botão verde
focus roxo
```

---

# 124. Preview Light

Mostrar:

```text
fundo creme
sidebar preta
botão azul
destaque roxo
bordas pretas
sombras sólidas
```

---

# 125. Não alterar funcionalidade

Selecionar Neo Brutalism não pode alterar:

```text
posição estrutural dos componentes
navegação
dados
permissões
LiveKit
Supabase
mensagens
voz
responsividade funcional
```

Apenas apresentação visual.

---

# 126. Componentes prioritários para tematização

Validar principalmente:

```text
Button
Input
Textarea
Select
Choice
Toggle
Checkbox
Avatar
Badge
Tag
Modal
Menu
Tooltip
Alert
Tabs
Card
Sidebar
Composer
Voice Tile
Screen Share
```

---

# 127. Consistência com redesigns

As documentações:

```text
12 — Mensagens Diretas
13 — Home/Amigos
14 — Servidor/Canais
15 — Chat do Servidor
16 — Configurações
```

definem layout e UX.

Neo Brutalism deve aplicar sua camada visual sobre esses mesmos layouts.

---

# 128. Exemplo

O mesmo botão:

### Default Theme

```text
[ Salvar ]
```

### Neo Brutalism

```text
┌─────────────┐
│   SALVAR    │
└─────────────┘
    ██████████
```

A funcionalidade permanece idêntica.

---

# 129. Alto contraste

Neo Brutalism exige contraste forte.

Dark:

```text
texto claro sobre fundo escuro
```

Light:

```text
texto muito escuro sobre fundo claro
```

Não sacrificar legibilidade em nome da estética.

---

# 130. Evitar exageros

Apesar de ser brutalista, não aplicar:

```text
shadow 12px
```

em todo elemento.

Hierarquia:

```text
inputs
→ sem hard shadow constante

buttons
→ shadow pequeno

cards
→ shadow médio

modal
→ shadow grande
```

---

# 131. Não transformar tudo em caixa

Textos normais de chat não precisam ter:

```text
border
shadow
background
```

O brutalismo deve aparecer principalmente na estrutura e nos controles.

---

# 132. Não usar gradientes como regra

Neo Brutalism deve privilegiar:

```text
cores sólidas
```

Evitar gradientes como componente central.

---

# 133. Não usar glassmorphism

Proibido como linguagem principal:

```text
backdrop blur forte
glass cards
borda transparente brilhante
superfície translúcida
```

Isso pertence a outros Style Themes.

---

# 134. Texturas

Podem existir texturas extremamente discretas.

Dark:

```css
--texture-opacity:
  0.024;
```

Light:

```css
--texture-opacity:
  0.025;
```

Não prejudicar leitura.

---

# 135. Regra para o tema claro

O tema claro NÃO deve replicar a antiga combinação:

```text
índigo
+
amarelo
```

como identidade dominante.

A nova identidade será:

```text
creme
+
azul
+
roxo
+
preto
```

com cores de estado próprias.

---

# 136. Regra para o tema escuro

O tema escuro deve preservar obrigatoriamente:

```text
#090b10
#171c25
#222936

#00ff33
#bb00ff

#f7f2e8
```

Mudanças futuras devem preservar essa identidade geral.

---

# 137. Acessibilidade

Todos os componentes devem manter:

- foco visível;
- navegação por teclado;
- ARIA apropriado;
- contraste;
- estados disabled reconhecíveis;
- touch targets adequados;
- suporte a reduced motion.

Neo Brutalism não é justificativa para reduzir acessibilidade.

---

# 138. Mobile

Validar:

```text
390px
430px
768px
```

Sombras não podem provocar scroll horizontal.

---

# 139. Desktop

Validar:

```text
1366×768
1440×900
1920×1080
```

---

# 140. Critérios de aceite

O tema só estará concluído quando:

1. Dark utilizar a paleta oficial definida neste documento.
2. Light utilizar a nova paleta clara.
3. Space Grotesk estiver funcionando.
4. IBM Plex Mono estiver disponível para labels técnicas.
5. Botões tiverem movimento físico.
6. Sombras forem sólidas e sem blur.
7. Cards principais utilizarem bordas fortes.
8. Modais possuírem presença visual brutalista.
9. Inputs tiverem foco claro.
10. Focus ring estiver visível.
11. Dark e Light utilizarem o mesmo comportamento.
12. Mobile não possuir overflow causado por shadows.
13. Todos os redesigns continuarem funcionais.
14. Nenhuma funcionalidade for acoplada ao tema.
15. Usuário puder trocar para outro Style Theme sem reload problemático.

---

# 141. Resultado esperado

O Dark deve transmitir:

```text
cyber
+
brutalista
+
verde neon
+
preto
+
roxo
+
alto contraste
```

O Light deve transmitir:

```text
editorial
+
brutalista
+
creme
+
azul forte
+
roxo
+
preto
```

Ambos devem parecer:

```text
o mesmo tema
```

em modos de cor diferentes.

---

# 142. Personalidade do Neo Brutalism

Comparação:

```text
Concord Default
→ sóbrio
→ moderno
→ discreto
→ confortável
```

```text
Concord Neo Brutalism
→ forte
→ físico
→ expressivo
→ contrastante
```

---

# 143. Regra de prioridade

Ao implementar:

```text
1. Funcionalidade
2. Acessibilidade
3. Design System compartilhado
4. Neo Brutalism
5. Decoração
```

Nunca inverter essa ordem.

---

# 144. Implementação recomendada

Criar ou adaptar aproximadamente:

```text
apps/web/src/theme/themes/
├── concord.css
├── neo.css
└── ...
```

Não substituir o arquivo do tema padrão.

---

# 145. Registry

Adicionar Neo Brutalism ao registry existente.

Conceitualmente:

```ts
{
  id: 'neo',
  label: 'Neo Brutalism',
  available: true
}
```

Respeitar a estrutura atual de `theme-registry.ts`.

---

# 146. Não duplicar componentes

Não criar:

```text
NeoButton
NeoInput
NeoModal
NeoToggle
```

apenas para alterar visual.

Preferir:

```text
Button
Input
Modal
Toggle
```

recebendo tokens diferentes através do tema.

---

# 147. Instrução para o Codex

Ao implementar este Design System:

1. leia primeiro a arquitetura atual em `apps/web/src/theme`;
2. preserve o funcionamento de `ThemeProvider`, `ThemeControls`, `theme-registry` e `useTheme`;
3. não substitua o tema Concord existente;
4. crie Neo Brutalism como Style Theme adicional;
5. mantenha Dark e Light como Color Modes;
6. utilize exatamente a paleta Dark especificada neste documento;
7. utilize a nova paleta Light especificada neste documento;
8. não duplique componentes;
9. aplique o visual através de tokens e seletores de tema;
10. preserve funcionalidades e estados;
11. valide foco e acessibilidade;
12. valide todos os componentes compartilhados;
13. valide as telas redesenhadas;
14. valide desktop e mobile;
15. execute os testes existentes;
16. não faça alterações não relacionadas.

---

# 148. Referência visual

A imagem aprovada deve orientar:

```text
força das bordas
sombras
radius
tipografia
densidade
hierarquia
composição dos componentes
```

O documento é a referência definitiva para:

```text
tokens
cores
comportamento
regras
```

Caso exista diferença entre a imagem e este documento:

```text
este documento vence
```

---

# 149. Definição final

O Neo Brutalism do Concord deve ser imediatamente reconhecível através de:

```text
Space Grotesk
+
IBM Plex Mono
+
bordas de 2–3px
+
cantos quase retos
+
hard shadows
+
movimento físico
+
alto contraste
```

Dark:

```text
#090b10
+
#00ff33
+
#bb00ff
```

Light:

```text
#f4f1e8
+
#315bea
+
#d946ef
+
#111111
```

Esse é o Style Theme **Neo Brutalism 2.0** oficial do Concord.
