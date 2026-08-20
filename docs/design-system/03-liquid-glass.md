# Concord Design System — Liquid Glass

**Versão:** 1.0  
**Style Theme:** Liquid Glass  
**Modo padrão recomendado:** Dark  
**Status:** Tema alternativo oficial do Concord  
**Objetivo:** criar uma experiência visual inspirada na linguagem Liquid Glass de interfaces modernas da Apple, utilizando transparência, blur, refração, profundidade, highlights e camadas, sem alterar a arquitetura funcional do Concord.

---

# 1. Conceito

O Liquid Glass do Concord deve transmitir:

```text
leve
+
fluido
+
premium
+
imersivo
+
moderno
+
espacial
```

Sua identidade deve ser reconhecida principalmente através de:

```text
superfícies translúcidas
+
backdrop blur
+
bordas luminosas
+
highlights internos
+
profundidade em camadas
+
cantos amplamente arredondados
+
sombras suaves
+
movimentos fluidos
```

O resultado deve lembrar interfaces modernas de:

```text
iOS
+
iPadOS
+
macOS
```

sem tentar reproduzir exatamente componentes proprietários da Apple.

---

# 2. Princípio arquitetural

Liquid Glass é um:

```text
Style Theme
```

e não uma aplicação diferente.

Estrutura:

```text
Concord
├── Default
│   ├── Dark
│   └── Light
│
├── Neo Brutalism
│   ├── Dark
│   └── Light
│
└── Liquid Glass
    ├── Dark
    └── Light
```

A troca de Style Theme não pode alterar:

```text
dados
funcionalidade
navegação
permissões
LiveKit
Supabase
responsividade funcional
estado dos componentes
```

A mudança é visual.

---

# 3. Nome interno recomendado

Utilizar:

```ts
glass
```

Preferência:

```html
<html
  data-style-theme="glass"
  data-color-mode="dark"
>
```

Evitar nomes excessivamente longos como:

```text
liquid-glass-apple-inspired-theme
```

---

# 4. Filosofia visual

O tema deve aplicar vidro onde ele melhora:

```text
hierarquia
profundidade
separação
contexto
```

Não transformar toda a aplicação em uma superfície transparente.

Princípio:

```text
conteúdo sólido
+
controles de vidro
+
camadas translúcidas
```

---

# 5. Transparência com propósito

Vidro deve ser usado especialmente em:

- sidebars;
- toolbars;
- modais;
- popovers;
- cards elevados;
- composer;
- barras de controle;
- painel de voz;
- controles sobre screen share;
- menus;
- configurações.

Evitar transparência excessiva em:

- grandes listas de mensagens;
- textos longos;
- tabelas densas;
- áreas onde a legibilidade depende de fundo estável.

---

# 6. Tipografia

O visual deve se aproximar da sensação tipográfica dos sistemas Apple.

Entretanto:

**não incluir, distribuir ou baixar arquivos proprietários SF Pro dentro do projeto.**

Utilizar system font stack.

---

# 7. Font stack

```css
--font-body:
  -apple-system,
  BlinkMacSystemFont,
  "SF Pro Text",
  "SF Pro Display",
  "Segoe UI",
  system-ui,
  sans-serif;

--font-display:
  -apple-system,
  BlinkMacSystemFont,
  "SF Pro Display",
  "Segoe UI",
  system-ui,
  sans-serif;

--font-mono:
  "SFMono-Regular",
  "SF Mono",
  "Cascadia Code",
  Consolas,
  monospace;
```

Em dispositivos Apple será utilizada a fonte do próprio sistema quando disponível.

Em Windows/Linux serão utilizados os fallbacks.

---

# 8. Pesos

```text
400 — Regular
500 — Medium
600 — Semibold
700 — Bold
```

O Liquid Glass deve utilizar menos peso visual bruto que Neo Brutalism.

Preferência:

```text
400
500
600
```

---

# 9. Escala tipográfica

| Token | Tamanho | Line-height | Peso |
|---|---:|---:|---:|
| Display 1 | 32px | 40px | 600 |
| Display 2 | 24px | 32px | 600 |
| Heading 1 | 20px | 28px | 600 |
| Heading 2 | 16px | 24px | 600 |
| Heading 3 | 14px | 20px | 600 |
| Body Large | 16px | 24px | 400 |
| Body Base | 14px | 20px | 400 |
| Body Small | 12px | 16px | 400 |
| Caption | 11px | 16px | 400 |

---

# 10. Tracking

Títulos:

```css
letter-spacing: -0.02em;
```

Displays:

```css
letter-spacing: -0.025em;
```

Texto normal:

```css
letter-spacing: normal;
```

---

# 11. Tema Dark

O Dark será o modo principal do Liquid Glass.

Paleta recomendada:

```css
:root[data-style-theme='glass'][data-color-mode='dark'] {
  --color-canvas: #080b10;

  --color-surface: rgba(24, 29, 38, 0.68);
  --color-surface-raised: rgba(38, 45, 58, 0.72);
  --color-surface-sunken: rgba(12, 16, 23, 0.78);

  --color-glass: rgba(28, 34, 45, 0.58);
  --color-glass-raised: rgba(46, 54, 68, 0.62);
  --color-glass-strong: rgba(56, 65, 82, 0.72);

  --color-text: #f4f5f7;
  --color-text-strong: #ffffff;
  --color-text-muted: #c5cad4;
  --color-text-faint: #9199a8;

  --color-accent: #22c55e;
  --color-accent-hover: #16a34a;
  --color-accent-contrast: #ffffff;
  --color-accent-soft: rgba(34, 197, 94, 0.16);

  --color-blue: #3b82f6;
  --color-blue-soft: rgba(59, 130, 246, 0.18);

  --color-purple: #a855f7;
  --color-purple-soft: rgba(168, 85, 247, 0.18);

  --color-border: rgba(255, 255, 255, 0.16);
  --color-border-soft: rgba(255, 255, 255, 0.09);
  --color-border-strong: rgba(255, 255, 255, 0.28);

  --color-highlight: rgba(255, 255, 255, 0.18);
  --color-highlight-strong: rgba(255, 255, 255, 0.32);

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;

  --color-overlay: rgba(3, 6, 12, 0.58);
}
```

---

# 12. Identidade Dark

A paleta principal é:

```text
PRETO AZULADO
+
CINZA TRANSLÚCIDO
+
VERDE CONCORD
+
AZUL
+
ROXO
```

Hierarquia:

```text
verde
→ marca e ação principal

azul
→ informação e interação auxiliar

roxo
→ recursos especiais

branco translúcido
→ bordas e highlights
```

---

# 13. Fundo do Dark

O canvas não deve ser totalmente preto.

Utilizar:

```css
#080b10
```

Pode receber gradientes ambientais extremamente discretos.

Exemplo:

```css
background:
  radial-gradient(
    circle at 20% 10%,
    rgba(59, 130, 246, 0.08),
    transparent 34%
  ),
  radial-gradient(
    circle at 85% 70%,
    rgba(168, 85, 247, 0.06),
    transparent 30%
  ),
  #080b10;
```

---

# 14. Tema Light

O Light deve parecer vidro claro sobre superfícies luminosas.

```css
:root[data-style-theme='glass'][data-color-mode='light'] {
  --color-canvas: #f3f6fb;

  --color-surface: rgba(255, 255, 255, 0.68);
  --color-surface-raised: rgba(255, 255, 255, 0.82);
  --color-surface-sunken: rgba(229, 235, 244, 0.72);

  --color-glass: rgba(255, 255, 255, 0.56);
  --color-glass-raised: rgba(255, 255, 255, 0.74);
  --color-glass-strong: rgba(255, 255, 255, 0.88);

  --color-text: #20242c;
  --color-text-strong: #101217;
  --color-text-muted: #596273;
  --color-text-faint: #818b9d;

  --color-accent: #16a34a;
  --color-accent-hover: #15803d;
  --color-accent-contrast: #ffffff;
  --color-accent-soft: rgba(22, 163, 74, 0.12);

  --color-blue: #2563eb;
  --color-blue-soft: rgba(37, 99, 235, 0.12);

  --color-purple: #9333ea;
  --color-purple-soft: rgba(147, 51, 234, 0.12);

  --color-border: rgba(64, 76, 96, 0.16);
  --color-border-soft: rgba(64, 76, 96, 0.09);
  --color-border-strong: rgba(64, 76, 96, 0.26);

  --color-highlight: rgba(255, 255, 255, 0.72);
  --color-highlight-strong: rgba(255, 255, 255, 0.94);

  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-info: #2563eb;

  --color-overlay: rgba(225, 232, 242, 0.58);
}
```

---

# 15. Fundo Light

Pode possuir luz ambiental sutil:

```css
background:
  radial-gradient(
    circle at 15% 5%,
    rgba(37, 99, 235, 0.08),
    transparent 36%
  ),
  radial-gradient(
    circle at 90% 75%,
    rgba(147, 51, 234, 0.06),
    transparent 32%
  ),
  #f3f6fb;
```

---

# 16. Verde Concord

Mesmo com a estética Liquid Glass, verde continua sendo a principal identidade da marca.

Dark:

```css
#22c55e
```

Light:

```css
#16a34a
```

Usar em:

- CTA;
- presença online;
- sucesso;
- item ativo;
- speaker ativo;
- pequenas áreas da marca.

---

# 17. Azul

Azul possui importância maior neste tema do que no Default.

Utilizar em:

- links;
- informação;
- controles auxiliares;
- foco alternativo;
- elementos de profundidade.

---

# 18. Roxo

Utilizar em:

- Beta;
- experimental;
- recursos especiais;
- ambient lighting;
- pequenos highlights.

Não utilizar como cor predominante.

---

# 19. Superfícies Liquid Glass

Definir níveis.

```text
Canvas
↓
Glass
↓
Glass Raised
↓
Glass Strong
↓
Overlay
```

---

# 20. Glass básico

Uso:

- sidebar;
- painel;
- cards normais.

```css
background:
  var(--color-glass);

backdrop-filter:
  blur(18px) saturate(140%);

-webkit-backdrop-filter:
  blur(18px) saturate(140%);
```

---

# 21. Glass Raised

Uso:

- composer;
- toolbar;
- dropdown;
- cards interativos.

```css
background:
  var(--color-glass-raised);

backdrop-filter:
  blur(24px) saturate(150%);

-webkit-backdrop-filter:
  blur(24px) saturate(150%);
```

---

# 22. Glass Strong

Uso:

- modal;
- menu importante;
- control center;
- painel flutuante.

```css
background:
  var(--color-glass-strong);

backdrop-filter:
  blur(32px) saturate(160%);

-webkit-backdrop-filter:
  blur(32px) saturate(160%);
```

---

# 23. Blur não deve ser exagerado

Não utilizar:

```text
blur(60px)
blur(100px)
```

sem necessidade.

Faixa recomendada:

```text
16px–32px
```

---

# 24. Fallback sem backdrop-filter

Nem todo browser/dispositivo terá desempenho adequado.

Quando:

```css
@supports not (backdrop-filter: blur(1px))
```

utilizar uma superfície mais opaca.

Exemplo Dark:

```css
background:
  rgba(24, 29, 38, 0.96);
```

Light:

```css
background:
  rgba(255, 255, 255, 0.96);
```

---

# 25. Performance

Backdrop blur pode ser caro.

Não aplicar `backdrop-filter` individualmente em centenas de mensagens.

Priorizar:

```text
painéis
headers
composer
menus
modais
toolbars
```

---

# 26. Bordas

Liquid Glass utiliza bordas finas.

```css
--border-width: 1px;
```

Evitar:

```text
2–3px
```

como padrão.

---

# 27. Bordas de vidro

Dark:

```css
border:
  1px solid rgba(255, 255, 255, 0.16);
```

Light:

```css
border:
  1px solid rgba(64, 76, 96, 0.16);
```

---

# 28. Highlight superior

Alguns elementos elevados podem possuir highlight interno.

```css
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.14);
```

Light:

```css
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.85);
```

---

# 29. Bordas fortes

Somente para:

- focus;
- alertas;
- erro;
- elementos selecionados.

Não utilizar uma borda forte permanente em todo card.

---

# 30. Raios

Liquid Glass utiliza raios generosos.

```css
--radius-xs: 6px;
--radius-sm: 10px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-3xl: 30px;
--radius-pill: 999px;
```

---

# 31. Radius dos controles

```css
--radius-control: 12px;
```

---

# 32. Radius dos painéis

```css
--radius-panel: 18px;
```

---

# 33. Radius dos modais

Sugestão:

```text
20–24px
```

---

# 34. Pills

Utilizar em:

- segmented control;
- filter chips;
- estados;
- toolbar compacta.

```css
border-radius:
  999px;
```

---

# 35. Sombras

Sombras devem ser:

```text
largas
+
macias
+
transparentes
```

---

# 36. Dark Shadows

```css
--shadow-sm:
  0 6px 18px rgba(0, 0, 0, 0.18);

--shadow-md:
  0 12px 32px rgba(0, 0, 0, 0.26);

--shadow-panel:
  0 18px 48px rgba(0, 0, 0, 0.34);

--shadow-modal:
  0 28px 80px rgba(0, 0, 0, 0.46);
```

---

# 37. Light Shadows

```css
--shadow-sm:
  0 6px 18px rgba(41, 55, 82, 0.08);

--shadow-md:
  0 12px 32px rgba(41, 55, 82, 0.12);

--shadow-panel:
  0 18px 48px rgba(41, 55, 82, 0.16);

--shadow-modal:
  0 28px 80px rgba(41, 55, 82, 0.22);
```

---

# 38. Profundidade

Não criar profundidade apenas com shadow.

Combinar:

```text
transparência
+
blur
+
border
+
highlight
+
shadow
```

---

# 39. Efeito de refração

O navegador não oferece refração física completa de forma simples e barata.

Representar o efeito através de:

- gradientes internos;
- highlights;
- transparência;
- saturação;
- blur;
- pseudo-elements.

---

# 40. Glass highlight

Exemplo:

```css
.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.16),
      transparent 36%
    );

  border-radius:
    inherit;
}
```

Manter extremamente discreto.

---

# 41. Não simular lente em tudo

Efeitos complexos de:

```text
refraction
lens distortion
chromatic aberration
```

devem ser reservados para poucos elementos especiais.

Não aplicar no corpo de mensagens.

---

# 42. Espaçamento

Base:

```text
4px
```

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

# 43. Densidade

Liquid Glass deve parecer confortável.

Usar mais frequentemente:

```text
12px
16px
20px
24px
```

em vez de layouts excessivamente compactos.

---

# 44. Botões

Tipos:

```text
Primário
Secundário
Terciário
Destrutivo
Disabled
Icon Button
```

---

# 45. Botão primário

Dark:

```css
background:
  linear-gradient(
    180deg,
    #2bd967,
    #16a34a
  );

color:
  #ffffff;
```

Pode possuir:

```css
box-shadow:
  inset 0 1px 0 rgba(255,255,255,.22),
  0 8px 20px rgba(22,163,74,.22);
```

---

# 46. Primário Light

```css
background:
  linear-gradient(
    180deg,
    #22c55e,
    #15803d
  );
```

---

# 47. Botão secundário

Utilizar glass.

```css
background:
  var(--color-glass-raised);

border:
  1px solid var(--color-border);

backdrop-filter:
  blur(18px);
```

---

# 48. Botão terciário

Quase transparente.

```css
background:
  rgba(255,255,255,.04);
```

ou transparente.

Hover deve ganhar superfície.

---

# 49. Botão destrutivo

Usar vermelho, mas preservar o vidro.

Exemplo:

```css
background:
  linear-gradient(
    180deg,
    rgba(239,68,68,.94),
    rgba(185,28,28,.94)
  );
```

---

# 50. Icon Buttons

São importantes neste tema.

Formato preferido:

```text
círculo
```

ou:

```text
rounded square
```

com superfície translúcida.

Exemplo:

```css
width: 38px;
height: 38px;

border-radius:
  999px;
```

---

# 51. Hover dos botões

Movimento sutil:

```css
transform:
  scale(1.02);
```

ou:

```css
transform:
  translateY(-1px);
```

Não utilizar deslocamento físico brutalista.

---

# 52. Active

```css
transform:
  scale(0.97);
```

Isso cria sensação de controle touch.

---

# 53. Focus

Focus deve continuar claramente visível.

Dark:

```css
box-shadow:
  0 0 0 3px rgba(34, 197, 94, 0.26);
```

Light:

```css
box-shadow:
  0 0 0 3px rgba(22, 163, 74, 0.20);
```

---

# 54. Inputs

Inputs devem utilizar vidro moderado.

```css
background:
  rgba(255, 255, 255, 0.045);

border:
  1px solid var(--color-border);

border-radius:
  var(--radius-control);
```

---

# 55. Input Focus

```css
border-color:
  var(--color-accent);

box-shadow:
  0 0 0 3px
  var(--color-accent-soft);
```

---

# 56. Input Light

```css
background:
  rgba(255,255,255,.62);
```

Focus:

```text
accent verde
```

---

# 57. Input Error

```css
border-color:
  var(--color-danger);
```

Mensagem obrigatória:

```text
Explique o problema.
```

---

# 58. Textarea

Mesma estética do input.

Composer:

```text
auto-grow
até 5–6 linhas
```

---

# 59. Select

Dropdown deve parecer um pequeno painel de vidro flutuante.

```css
background:
  var(--color-glass-strong);

backdrop-filter:
  blur(28px) saturate(150%);

box-shadow:
  var(--shadow-md);
```

---

# 60. Segmented Control

Importante para aproximar a linguagem iOS/macOS.

Exemplo:

```text
┌──────────────────────────┐
│ Sistema │ Claro │ Escuro │
└──────────────────────────┘
```

Container:

```text
glass
```

Selecionado:

```text
surface forte
+
shadow pequeno
```

---

# 61. Checkbox

Pode permanecer quadrado arredondado.

Selecionado:

```text
verde
+
check branco
```

---

# 62. Radio

Selecionado:

```text
ring accent
+
centro accent
```

---

# 63. Switch

A aparência pode se aproximar da linguagem de toggle móvel moderna.

Desligado:

```text
surface neutra
```

Ligado:

```text
verde
```

Thumb:

```text
branco
```

---

# 64. Switch sizing

```css
width: 42px;
height: 24px;
```

Thumb:

```css
20px;
```

---

# 65. Badges

Badges podem usar vidro colorido.

Exemplo:

```css
background:
  rgba(34, 197, 94, 0.12);

border:
  1px solid rgba(34, 197, 94, 0.24);
```

---

# 66. Badge Novo

```text
verde
```

---

# 67. Badge Beta

```text
azul
```

---

# 68. Badge Em breve

```text
roxo
```

---

# 69. Badge Aviso

```text
âmbar
```

---

# 70. Badge Erro

```text
vermelho
```

---

# 71. Tags

Tags devem ser pills discretas.

```text
[RPG ×]
[Tecnologia ×]
[Comunidade ×]
```

Não utilizar bordas pesadas.

---

# 72. Cards

Card padrão:

```css
background:
  var(--color-glass);

backdrop-filter:
  blur(18px) saturate(140%);

border:
  1px solid var(--color-border);

border-radius:
  var(--radius-lg);

box-shadow:
  var(--shadow-sm);
```

---

# 73. Card Hover

```css
background:
  var(--color-glass-raised);

transform:
  translateY(-1px);

box-shadow:
  var(--shadow-md);
```

---

# 74. Card Selected

```css
border-color:
  rgba(34, 197, 94, 0.46);

box-shadow:
  0 0 0 3px rgba(34, 197, 94, 0.10),
  var(--shadow-md);
```

---

# 75. Sidebar

Sidebar é um excelente elemento para vidro.

Dark:

```css
background:
  rgba(14, 18, 25, 0.64);

backdrop-filter:
  blur(28px) saturate(150%);
```

---

# 76. Sidebar Light

```css
background:
  rgba(249, 251, 255, 0.72);

backdrop-filter:
  blur(28px) saturate(140%);
```

---

# 77. Navegação ativa

Não preencher com um bloco verde forte.

Preferir:

```text
glass mais claro
+
ícone verde
+
texto forte
```

Exemplo:

```css
background:
  var(--color-accent-soft);
```

---

# 78. Hover de navegação

```css
background:
  rgba(255,255,255,.06);
```

Dark.

Light:

```css
background:
  rgba(30,50,80,.05);
```

---

# 79. Server Rail

Pode utilizar uma superfície ainda mais translúcida.

Avatares/ícones de servidores podem ter:

```text
circle glass
```

com seleção marcada por glow sutil.

---

# 80. Cabeçalhos

Headers podem ser sticky e translúcidos.

```css
backdrop-filter:
  blur(24px);
```

Isso funciona especialmente bem em:

- chat;
- DM;
- amigos;
- configurações.

---

# 81. Composer

O composer é um elemento chave.

Visual:

```text
     ┌───────────────────────────────┐
     │ +  Mensagem...          ☺ ➤  │
     └───────────────────────────────┘
```

Glass:

```css
background:
  var(--color-glass-raised);

backdrop-filter:
  blur(24px) saturate(150%);

border:
  1px solid var(--color-border);

box-shadow:
  var(--shadow-md);

border-radius:
  18px;
```

---

# 82. Composer flutuante

Pode possuir:

```text
16–20px
```

de margem inferior/lateral para transmitir sensação flutuante.

---

# 83. Mensagens

Não aplicar blur em cada mensagem.

As mensagens devem permanecer sobre uma superfície estável.

Vidro fica principalmente em:

```text
header
composer
ações
menus
painéis
```

---

# 84. DM própria

Bubble própria pode utilizar:

```css
background:
  rgba(34, 197, 94, 0.16);

border:
  1px solid rgba(34, 197, 94, 0.26);
```

Não usar opacidade tão baixa que prejudique leitura.

---

# 85. Voice Room

Liquid Glass combina especialmente bem com canal de voz.

Tiles:

```text
surface escura
+
glass controls
+
status overlay
```

---

# 86. Voice Controls

Controles inferiores devem parecer uma barra flutuante:

```text
┌──────────────────────────────┐
│ 🎤   🎧   🖥   🔴            │
└──────────────────────────────┘
```

com:

```text
strong glass
+
blur
+
radius pill/large
```

---

# 87. Speaker ativo

Utilizar glow sutil.

```css
box-shadow:
  0 0 0 2px #22c55e,
  0 0 24px rgba(34,197,94,.18);
```

---

# 88. Screen Share

Controles sobre vídeo devem ser vidro translúcido.

Exemplo:

```text
volume
fullscreen
destaque
fechar
```

sobre overlay:

```css
background:
  rgba(12, 16, 23, 0.58);

backdrop-filter:
  blur(18px);
```

---

# 89. Modais

Modais são Glass Strong.

Dark:

```css
background:
  rgba(38, 45, 58, 0.78);

backdrop-filter:
  blur(32px) saturate(160%);

border:
  1px solid rgba(255,255,255,.20);

box-shadow:
  var(--shadow-modal);
```

---

# 90. Modal Light

```css
background:
  rgba(255,255,255,.82);

backdrop-filter:
  blur(32px) saturate(140%);
```

---

# 91. Modal destrutivo

Não transformar o modal inteiro em vermelho.

Manter vidro normal e destacar:

```text
ícone
título
botão destrutivo
```

em vermelho.

---

# 92. Backdrop

Dark:

```css
background:
  rgba(3,6,12,.56);
```

Light:

```css
background:
  rgba(225,232,242,.50);
```

Pode utilizar blur baixo:

```css
backdrop-filter:
  blur(8px);
```

---

# 93. Menus

Context menus devem parecer pequenos painéis flutuantes.

```text
Glass Strong
+
28px blur
+
shadow
+
radius 14px
```

---

# 94. Popovers

Usar mesma família visual dos menus.

Não criar visual diferente para:

```text
dropdown
popover
tooltip
menu
```

sem motivo.

---

# 95. Tooltips

Mais opacos que outros vidros.

Motivo:

```text
legibilidade
```

Dark:

```css
background:
  rgba(32,38,49,.94);
```

---

# 96. Alerts

Alerts podem utilizar tint de cor.

Success:

```text
verde translúcido
```

Warning:

```text
âmbar translúcido
```

Error:

```text
vermelho translúcido
```

Info:

```text
azul translúcido
```

---

# 97. Success Alert

```css
background:
  rgba(34,197,94,.12);

border:
  1px solid rgba(34,197,94,.28);
```

---

# 98. Warning Alert

```css
background:
  rgba(245,158,11,.12);

border:
  1px solid rgba(245,158,11,.28);
```

---

# 99. Error Alert

```css
background:
  rgba(239,68,68,.12);

border:
  1px solid rgba(239,68,68,.28);
```

---

# 100. Info Alert

```css
background:
  rgba(59,130,246,.12);

border:
  1px solid rgba(59,130,246,.28);
```

---

# 101. Scrollbar

Scrollbar deve ser discreta.

Dark:

```text
track transparente
thumb rgba branco 20%
```

Hover:

```text
rgba branco 30%
```

---

# 102. Light Scrollbar

```text
thumb rgba(40,50,70,.20)
```

---

# 103. Progress Bars

Track:

```text
glass sunken
```

Fill:

```text
verde
```

Pode utilizar leve highlight.

---

# 104. Loading

Spinner pode utilizar:

```text
verde
```

com track translúcida.

Não adicionar efeitos excessivos.

---

# 105. Ícones

Estilo:

```text
outline
clean
round
```

Stroke:

```text
1.5–1.8px
```

Mais leve que Neo Brutalism.

---

# 106. Icon Buttons

Preferir:

```text
círculos
+
glass
```

para toolbars.

---

# 107. Motion

Liquid Glass deve possuir animações fluidas.

```css
--motion-fast: 160ms;
--motion-normal: 260ms;
--motion-slow: 380ms;
```

---

# 108. Easing

```css
--ease-standard:
  cubic-bezier(0.2, 0.8, 0.2, 1);
```

---

# 109. Entrada de painel

Exemplo:

```css
opacity: 0;
transform:
  translateY(6px) scale(.985);
```

para:

```css
opacity: 1;
transform:
  translateY(0) scale(1);
```

---

# 110. Hover

Movimentos pequenos.

```text
1–2px
ou
1–2% scale
```

Não utilizar bounce exagerado.

---

# 111. Reduced Motion

Respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

Remover:

- zoom;
- deslocamento;
- animações decorativas.

Preservar feedback essencial.

---

# 112. Transparência reduzida

Idealmente respeitar preferências de acessibilidade quando possível.

Criar fallback como:

```css
@media (prefers-reduced-transparency: reduce)
```

quando suportado.

Como suporte ainda varia, também oferecer tokens facilmente substituíveis.

---

# 113. Performance Mode

Se futuramente necessário, pode existir internamente:

```text
Glass Quality

High
Reduced
```

Não precisa aparecer ao usuário inicialmente.

Modo reduzido pode trocar:

```text
blur 28px
```

por:

```text
blur 12px
```

ou superfícies mais opacas.

---

# 114. Mobile

Liquid Glass deve funcionar particularmente bem no mobile.

Priorizar:

- sheets;
- pills;
- control bars;
- floating composer;
- segmented controls;
- headers translúcidos.

---

# 115. Mobile Safe Area

Sempre considerar:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
```

---

# 116. Mobile 100dvh

Utilizar:

```css
min-height:
  100dvh;
```

quando apropriado.

Evitar problemas com barras do navegador.

---

# 117. Bottom Sheet

Visual:

```text
╭─────────────────────────────╮
│            ━━━━━            │
│                             │
│ Opção                       │
│ Opção                       │
│ Opção                       │
╰─────────────────────────────╯
```

Glass Strong.

---

# 118. Sheet Radius

Topo:

```text
24–28px
```

Base pode respeitar viewport/safe-area.

---

# 119. Desktop

No desktop, priorizar:

```text
sidebar glass
+
header glass
+
conteúdo estável
+
painéis flutuantes
```

Não tornar o background inteiro borrado.

---

# 120. Configurações

A central da Etapa 16 deve ficar especialmente boa com Liquid Glass.

Sidebar:

```text
glass
```

Conteúdo:

```text
surface semi-opaca
```

Context panel:

```text
glass raised
```

---

# 121. Home/Amigos

Painel de detalhes:

```text
glass raised
```

Lista principal:

```text
surface estável
```

---

# 122. DMs

Header:

```text
glass
```

Composer:

```text
glass raised
```

Mensagens:

```text
surface limpa
```

---

# 123. Servidor

Channel sidebar:

```text
glass
```

Chat:

```text
canvas/surface
```

Member panel:

```text
glass leve
```

---

# 124. Canal de voz

Controle inferior:

```text
Glass Strong
```

Participantes:

```text
surface
```

Screen share controls:

```text
glass overlay
```

---

# 125. CSS base

```css
:root[data-style-theme='glass'] {
  --font-body:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Text",
    "SF Pro Display",
    "Segoe UI",
    system-ui,
    sans-serif;

  --font-display:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Display",
    "Segoe UI",
    system-ui,
    sans-serif;

  --font-mono:
    "SFMono-Regular",
    "SF Mono",
    "Cascadia Code",
    Consolas,
    monospace;

  --radius-control: 12px;
  --radius-panel: 18px;

  --border-width: 1px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  --motion-fast: 160ms;
  --motion-normal: 260ms;
  --motion-slow: 380ms;

  --ease-standard:
    cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

---

# 126. Dark CSS completo base

```css
:root[data-style-theme='glass'][data-color-mode='dark'] {
  --color-canvas: #080b10;

  --color-surface: rgba(24, 29, 38, 0.68);
  --color-surface-raised: rgba(38, 45, 58, 0.72);
  --color-surface-sunken: rgba(12, 16, 23, 0.78);

  --color-glass: rgba(28, 34, 45, 0.58);
  --color-glass-raised: rgba(46, 54, 68, 0.62);
  --color-glass-strong: rgba(56, 65, 82, 0.72);

  --color-border: rgba(255,255,255,.16);
  --color-border-soft: rgba(255,255,255,.09);
  --color-border-strong: rgba(255,255,255,.28);

  --color-text: #f4f5f7;
  --color-text-strong: #ffffff;
  --color-text-muted: #c5cad4;
  --color-text-faint: #9199a8;

  --color-accent: #22c55e;
  --color-accent-hover: #16a34a;
  --color-accent-contrast: #ffffff;
  --color-accent-soft: rgba(34,197,94,.16);

  --color-blue: #3b82f6;
  --color-blue-soft: rgba(59,130,246,.18);

  --color-purple: #a855f7;
  --color-purple-soft: rgba(168,85,247,.18);

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;

  --color-highlight:
    rgba(255,255,255,.18);

  --color-overlay:
    rgba(3,6,12,.58);

  --shadow-sm:
    0 6px 18px rgba(0,0,0,.18);

  --shadow-md:
    0 12px 32px rgba(0,0,0,.26);

  --shadow-panel:
    0 18px 48px rgba(0,0,0,.34);

  --shadow-modal:
    0 28px 80px rgba(0,0,0,.46);
}
```

---

# 127. Light CSS completo base

```css
:root[data-style-theme='glass'][data-color-mode='light'] {
  --color-canvas: #f3f6fb;

  --color-surface: rgba(255,255,255,.68);
  --color-surface-raised: rgba(255,255,255,.82);
  --color-surface-sunken: rgba(229,235,244,.72);

  --color-glass: rgba(255,255,255,.56);
  --color-glass-raised: rgba(255,255,255,.74);
  --color-glass-strong: rgba(255,255,255,.88);

  --color-border: rgba(64,76,96,.16);
  --color-border-soft: rgba(64,76,96,.09);
  --color-border-strong: rgba(64,76,96,.26);

  --color-text: #20242c;
  --color-text-strong: #101217;
  --color-text-muted: #596273;
  --color-text-faint: #818b9d;

  --color-accent: #16a34a;
  --color-accent-hover: #15803d;
  --color-accent-contrast: #ffffff;
  --color-accent-soft: rgba(22,163,74,.12);

  --color-blue: #2563eb;
  --color-blue-soft: rgba(37,99,235,.12);

  --color-purple: #9333ea;
  --color-purple-soft: rgba(147,51,234,.12);

  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-info: #2563eb;

  --color-highlight:
    rgba(255,255,255,.72);

  --color-overlay:
    rgba(225,232,242,.58);

  --shadow-sm:
    0 6px 18px rgba(41,55,82,.08);

  --shadow-md:
    0 12px 32px rgba(41,55,82,.12);

  --shadow-panel:
    0 18px 48px rgba(41,55,82,.16);

  --shadow-modal:
    0 28px 80px rgba(41,55,82,.22);
}
```

---

# 128. Classe base Glass

```css
.glass-surface {
  position: relative;

  background:
    var(--color-glass);

  border:
    var(--border-width)
    solid
    var(--color-border);

  border-radius:
    var(--radius-panel);

  backdrop-filter:
    blur(18px)
    saturate(140%);

  -webkit-backdrop-filter:
    blur(18px)
    saturate(140%);

  box-shadow:
    inset 0 1px 0
      var(--color-highlight),
    var(--shadow-sm);
}
```

---

# 129. Glass Raised

```css
.glass-raised {
  background:
    var(--color-glass-raised);

  backdrop-filter:
    blur(24px)
    saturate(150%);

  -webkit-backdrop-filter:
    blur(24px)
    saturate(150%);

  box-shadow:
    inset 0 1px 0
      var(--color-highlight),
    var(--shadow-md);
}
```

---

# 130. Glass Strong

```css
.glass-strong {
  background:
    var(--color-glass-strong);

  backdrop-filter:
    blur(32px)
    saturate(160%);

  -webkit-backdrop-filter:
    blur(32px)
    saturate(160%);

  box-shadow:
    inset 0 1px 0
      var(--color-highlight),
    var(--shadow-panel);
}
```

---

# 131. Botão Glass

```css
.glass-button {
  min-height:
    40px;

  padding:
    8px 16px;

  border:
    1px solid
    var(--color-border);

  border-radius:
    var(--radius-control);

  background:
    var(--color-glass-raised);

  color:
    var(--color-text);

  backdrop-filter:
    blur(18px);

  transition:
    transform var(--motion-fast)
      var(--ease-standard),
    background var(--motion-fast)
      var(--ease-standard),
    box-shadow var(--motion-fast)
      var(--ease-standard);
}

.glass-button:hover:not(:disabled) {
  transform:
    translateY(-1px);

  background:
    var(--color-glass-strong);
}

.glass-button:active:not(:disabled) {
  transform:
    scale(.97);
}
```

---

# 132. Input Glass

```css
.glass-input {
  min-height:
    40px;

  padding:
    8px 12px;

  border:
    1px solid
    var(--color-border);

  border-radius:
    var(--radius-control);

  background:
    var(--color-glass);

  color:
    var(--color-text);

  backdrop-filter:
    blur(14px);
}

.glass-input:focus {
  outline:
    none;

  border-color:
    var(--color-accent);

  box-shadow:
    0 0 0 3px
    var(--color-accent-soft);
}
```

---

# 133. Modal Glass

```css
.glass-modal {
  background:
    var(--color-glass-strong);

  border:
    1px solid
    var(--color-border-strong);

  border-radius:
    24px;

  backdrop-filter:
    blur(32px)
    saturate(160%);

  -webkit-backdrop-filter:
    blur(32px)
    saturate(160%);

  box-shadow:
    inset 0 1px 0
      var(--color-highlight),
    var(--shadow-modal);
}
```

---

# 134. Fallback para Glass

```css
@supports not (
  backdrop-filter: blur(1px)
) {
  .glass-surface,
  .glass-raised,
  .glass-strong {
    backdrop-filter:
      none;

    -webkit-backdrop-filter:
      none;

    background:
      var(--color-surface-raised);
  }
}
```

---

# 135. Não duplicar componentes

Não criar:

```text
GlassButton
GlassInput
GlassModal
GlassSelect
GlassToggle
```

apenas para aplicar o tema.

Utilizar componentes compartilhados:

```text
Button
Input
Modal
Select
Toggle
```

e alterar aparência via tokens/classes do Style Theme.

---

# 136. Theme Registry

Adicionar ao registry atual.

Conceitualmente:

```ts
{
  id: 'glass',
  label: 'Liquid Glass',
  available: true
}
```

Respeitar a estrutura real de `theme-registry.ts`.

---

# 137. Tela de seleção de tema

Mostrar:

```text
Liquid Glass

Transparência
Profundidade
Blur
Movimento fluido
```

---

# 138. Preview Dark

O preview deve possuir:

```text
canvas escuro
sidebar glass
header translúcido
composer glass
verde como CTA
azul/roxo ambiental
```

---

# 139. Preview Light

Mostrar:

```text
canvas quase branco
sidebar translúcida
cards claros
sombras leves
accent verde
azul auxiliar
```

---

# 140. Consistência com os redesigns

Aplicar sobre:

```text
12 — Mensagens Diretas
13 — Home/Amigos
14 — Servidor/Canais
15 — Chat do Servidor
16 — Configurações
```

sem alterar layouts documentados.

---

# 141. Relação entre documentos

```text
Documentação da tela
→ estrutura e UX

Imagem da tela
→ composição visual

Design System
→ aparência dos componentes

Style Theme Liquid Glass
→ interpretação estética do Design System
```

---

# 142. Não criar Glassmorphism genérico

Liquid Glass não deve virar:

```text
card transparente
+
blur
```

aplicado indiscriminadamente.

Precisa transmitir:

```text
camadas
+
profundidade
+
highlight
+
movimento
+
material
```

---

# 143. Não prejudicar legibilidade

Se o conteúdo atrás do vidro dificultar a leitura:

```text
aumentar opacidade
```

antes de:

```text
aumentar blur infinitamente
```

---

# 144. Não prejudicar performance

Evitar:

```text
centenas de backdrop-filter simultâneos
```

Principalmente em:

- chat longo;
- lista grande de membros;
- lista de amigos;
- canais.

---

# 145. Áreas estáveis

Manter fundos mais sólidos em:

```text
mensagens
listas longas
conteúdo textual
tabelas
```

Aplicar vidro ao redor.

---

# 146. Accessibility

Obrigatório:

- contraste AA quando aplicável;
- foco visível;
- navegação por teclado;
- touch targets adequados;
- `aria-label`;
- estados não baseados somente em cor;
- fallback sem transparência;
- reduced motion;
- conteúdo legível sobre qualquer background.

---

# 147. Mobile

Validar:

```text
390px
430px
768px
```

---

# 148. Desktop

Validar:

```text
1366×768
1440×900
1920×1080
```

---

# 149. Browser testing

Validar especialmente:

```text
Chrome
Edge
Safari
Firefox
```

Safari é importante por causa da linguagem visual pretendida e de `-webkit-backdrop-filter`.

---

# 150. Performance testing

Validar:

- scrolling;
- canais com muitos membros;
- chat longo;
- canal de voz;
- múltiplas telas compartilhadas;
- modal sobre screen share;
- mobile;
- hardware mais simples.

O tema visual não pode degradar significativamente chamadas de voz ou compartilhamento.

---

# 151. Critérios de aceite

Liquid Glass só estará concluído quando:

1. Existir como Style Theme separado.
2. Dark e Light funcionarem.
3. Não substituir o tema Concord.
4. Não substituir Neo Brutalism.
5. Superfícies de vidro possuírem fallback.
6. Blur for usado com moderação.
7. Bordas forem finas.
8. Highlights internos forem sutis.
9. Sombras forem suaves.
10. Raios forem maiores.
11. Botões possuírem movimento fluido.
12. Inputs tiverem focus claro.
13. Modais parecerem camadas elevadas.
14. Sidebars puderem utilizar Glass.
15. Composer parecer flutuante.
16. Voice controls funcionarem bem.
17. Screen share não sofrer queda perceptível de desempenho causada pelo tema.
18. Mobile estiver adequado.
19. Light estiver legível.
20. Dark estiver legível.
21. Reduced Motion funcionar.
22. Fallback sem backdrop-filter funcionar.
23. Nenhuma funcionalidade depender do tema.
24. Componentes compartilhados forem reutilizados.

---

# 152. Diferença entre os temas

## Concord Default

```text
sóbrio
+
moderno
+
prático
+
discreto
```

## Neo Brutalism

```text
forte
+
tátil
+
rígido
+
expressivo
```

## Liquid Glass

```text
fluido
+
translúcido
+
espacial
+
premium
```

---

# 153. Regra de prioridade

```text
1. Funcionalidade
2. Legibilidade
3. Acessibilidade
4. Performance
5. Design System
6. Liquid Glass
7. Efeitos decorativos
```

Nunca sacrificar os cinco primeiros para aumentar o efeito visual.

---

# 154. Implementação recomendada

Estrutura aproximada:

```text
apps/web/src/theme/themes/
├── concord.css
├── neo.css
├── glass.css
└── ...
```

Se o projeto continuar centralizando variantes em outro arquivo, adaptar à arquitetura existente.

Não criar um segundo sistema de temas.

---

# 155. Reutilizar arquitetura existente

Antes de implementar:

```text
ThemeProvider
ThemeContext
ThemeControls
theme-registry
theme-types
useTheme
```

devem ser analisados.

Liquid Glass deve utilizar o mesmo pipeline.

---

# 156. Instrução final para o Codex

Ao implementar este Design System:

1. leia primeiro `docs/design-system/03-liquid-glass.md`;
2. use a imagem aprovada `docs/design-system/imagens/03-liquid-glass.png` como referência visual;
3. analise a arquitetura atual em `apps/web/src/theme`;
4. preserve o funcionamento atual de Style Theme + Color Mode;
5. crie `Liquid Glass` como Style Theme adicional;
6. não substitua `Concord`;
7. não substitua `Neo Brutalism`;
8. utilize system font stack e não inclua arquivos proprietários SF Pro;
9. implemente Dark e Light;
10. utilize tokens semânticos;
11. não duplique componentes;
12. utilize `backdrop-filter` somente onde fizer sentido;
13. implemente fallback quando blur/transparência não forem suportados;
14. evite backdrop blur em listas grandes;
15. preserve desempenho do LiveKit;
16. preserve desempenho de screen sharing;
17. valide focus e contraste;
18. valide reduced motion;
19. valide desktop e mobile;
20. valide Chrome, Edge, Firefox e Safari quando possível;
21. compare visualmente com o mockup aprovado;
22. execute os testes existentes;
23. não faça alterações funcionais fora do escopo;
24. não faça commit nem push.

---

# 157. Referência visual

A imagem aprovada define principalmente:

```text
translucidez
blur
profundidade
cantos
highlights
composição
hierarquia visual
estética iOS/macOS
```

Este documento define:

```text
tokens
regras
comportamento
performance
acessibilidade
implementação
```

Se houver conflito:

```text
documentação
>
mockup
```

---

# 158. Definição final

O Liquid Glass oficial do Concord deve ser reconhecível por:

```text
system typography
+
glass surfaces
+
backdrop blur
+
soft highlights
+
soft shadows
+
large radius
+
fluid motion
+
layered depth
```

Dark:

```text
#080b10
+
vidro cinza-azulado
+
#22c55e
+
#3b82f6
+
#a855f7
```

Light:

```text
#f3f6fb
+
vidro branco
+
#16a34a
+
#2563eb
+
#9333ea
```

A estética deve lembrar uma interface moderna de iOS/macOS, mas continuar claramente sendo o **Concord**.

Esse é o Style Theme **Liquid Glass 1.0** oficial do projeto.
