# Concord Design System — Tema Padrão

**Versão:** 1.0  
**Tema principal:** Concord Dark  
**Tema complementar:** Concord Light  
**Status:** Design System oficial do Concord  
**Objetivo:** definir uma linguagem visual consistente, moderna, acessível e reutilizável para todas as interfaces do Concord.

---

# 1. Visão geral

O tema padrão do Concord deve transmitir:

```text
moderno
+
tecnológico
+
sóbrio
+
social
+
acessível
+
limpo
```

A identidade principal utiliza:

```text
fundos escuros azulados
+
verde como cor da marca
+
azul como accent complementar
+
alto contraste
+
bordas discretas
+
superfícies em camadas
```

O Concord não deve parecer:

```text
completamente preto
```

nem:

```text
excessivamente colorido
```

O objetivo é manter uma aparência confortável para uso prolongado em:

- mensagens;
- chamadas de voz;
- compartilhamento de tela;
- comunidades;
- configurações;
- administração.

---

# 2. Princípios do Design System

## Consistência

Componentes equivalentes devem utilizar os mesmos:

- tamanhos;
- espaçamentos;
- estados;
- cores;
- comportamentos.

---

## Acessibilidade

Garantir:

- contraste adequado;
- foco visível;
- suporte a teclado;
- `aria-label`;
- estados que não dependam somente de cor;
- áreas clicáveis confortáveis.

---

## Clareza

A interface deve ser facilmente escaneável.

Priorizar:

```text
conteúdo
↓
ação principal
↓
ações secundárias
↓
metadados
```

---

## Feedback

Toda ação relevante deve deixar claro:

```text
idle
hover
active
loading
success
warning
error
disabled
```

---

## Responsividade

Os mesmos padrões devem funcionar em:

```text
desktop
laptop
tablet
mobile
```

---

# 3. Tipografia

## Fonte principal

Utilizar:

```css
font-family:
  Inter,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Fonte preferencial:

```text
Inter
```

Fallbacks devem funcionar sem quebrar o layout.

---

# 4. Pesos tipográficos

```text
400 — Regular
500 — Medium
600 — Semi Bold
700 — Bold
```

Evitar utilizar pesos fora dessa escala sem necessidade.

---

# 5. Escala tipográfica

| Token | Tamanho | Line-height | Peso |
|---|---:|---:|---:|
| Display 1 | 32px | 40px | 700 |
| Display 2 | 24px | 32px | 700 |
| Heading 1 | 20px | 28px | 600 |
| Heading 2 | 16px | 24px | 600 |
| Heading 3 | 14px | 20px | 600 |
| Body Large | 16px | 24px | 400 |
| Body Base | 14px | 20px | 400 |
| Body Small | 12px | 16px | 400 |
| Caption | 11px | 16px | 400 |

---

# 6. Uso recomendado

## Display 1

Utilizar apenas em títulos de grande destaque.

Exemplo:

```text
Configurações
```

---

## Display 2

Títulos principais de páginas.

Exemplo:

```text
Amigos
```

---

## Heading 1

Seções principais.

```text
Informações da conta
```

---

## Heading 2

Subseções.

```text
Canais de voz
```

---

## Heading 3

Cards, labels importantes e agrupamentos.

---

## Body Base

Texto padrão da aplicação.

---

## Body Small

Metadados, descrições e conteúdo secundário.

---

## Caption

Horários, badges pequenos e informações auxiliares.

---

# 7. Paleta principal

## Brand

```css
--color-brand: #22C55E;
```

Uso:

- ação principal;
- estado selecionado;
- indicadores ativos;
- status positivo;
- elementos da identidade Concord.

---

## Brand Hover

```css
--color-brand-hover: #16A34A;
```

Utilizar em:

```text
hover de botão primário
```

---

## Brand Soft

```css
--color-brand-soft: #14532D;
```

Uso:

- backgrounds selecionados;
- badges suaves;
- superfícies com destaque verde.

---

# 8. Accent

## Accent

```css
--color-accent: #3B82F6;
```

Uso:

- links;
- informação;
- recursos auxiliares;
- destaque secundário.

---

## Accent Soft

```css
--color-accent-soft: #1E40AF;
```

---

# 9. Neutros

Baseados em uma escala fria azulada.

```css
--neutral-50:  #F8FAFC;
--neutral-100: #F1F5F9;
--neutral-200: #E2E8F0;

--neutral-600: #475569;
--neutral-700: #334155;
--neutral-800: #1E293B;
--neutral-900: #0F172A;
```

---

# 10. Cores de estado

## Success

```css
--color-success: #22C55E;
```

---

## Warning

```css
--color-warning: #F59E0B;
```

---

## Danger

```css
--color-danger: #EF4444;
```

---

## Info

```css
--color-info: #3B82F6;
```

---

## Purple

Cor auxiliar.

```css
--color-purple: #A855F7;
```

Não utilizar como cor principal do Concord.

---

# 11. Gradientes

Gradientes devem ser usados com moderação.

Não utilizar em toda superfície.

---

## Brand Gradient

```css
background:
  linear-gradient(
    135deg,
    #22C55E,
    #16A34A
  );
```

Pode aparecer em:

- banners;
- onboarding;
- componentes promocionais;
- estados de destaque especial.

---

## Accent Gradient

```css
background:
  linear-gradient(
    135deg,
    #3B82F6,
    #A855F7
  );
```

Uso restrito a:

- conteúdos especiais;
- recursos experimentais;
- elementos de apoio visual.

Não substituir o verde principal.

---

# 12. Concord Dark — tema padrão

O modo escuro é o tema principal da aplicação.

---

## Background principal

```css
--color-bg-primary: #0F172A;
```

Uso:

```text
fundo principal da aplicação
```

---

## Background secundário

```css
--color-bg-secondary: #111827;
```

Uso:

- sidebars;
- painéis;
- áreas secundárias.

---

## Background terciário

```css
--color-bg-tertiary: #1E293B;
```

Uso:

- hover;
- seleção;
- superfícies elevadas;
- cards.

---

# 13. Texto — Dark

## Principal

```css
--color-text-primary: #F8FAFC;
```

---

## Secundário

```css
--color-text-secondary: #CBD5E1;
```

---

## Muted

```css
--color-text-muted: #94A3B8;
```

---

## Faint

```css
--color-text-faint: #64748B;
```

---

# 14. Bordas — Dark

## Normal

```css
--color-border: #1F2937;
```

---

## Forte

```css
--color-border-strong: #334155;
```

---

## Accent

```css
--color-border-accent: #22C55E;
```

Usar somente quando houver:

- foco;
- seleção;
- estado ativo.

---

# 15. Concord Light

O tema claro deve manter a mesma identidade do Concord.

Não deve parecer outro produto.

---

## Backgrounds

```css
--color-bg-primary-light: #F8FAFC;
--color-bg-secondary-light: #F1F5F9;
--color-bg-tertiary-light: #E2E8F0;
```

---

## Textos

```css
--color-text-primary-light: #0F172A;
--color-text-secondary-light: #334155;
--color-text-muted-light: #64748B;
```

---

## Bordas

```css
--color-border-light: #CBD5E1;
--color-border-strong-light: #94A3B8;
```

---

# 16. Brand no tema claro

Manter:

```css
#22C55E
```

quando houver contraste suficiente.

Em textos pequenos sobre fundo claro, pode ser necessário usar:

```css
#16A34A
```

para melhorar legibilidade.

---

# 17. Tokens semânticos

Componentes não devem depender diretamente de:

```text
neutral-800
neutral-900
```

sempre que um token semântico estiver disponível.

Preferir:

```css
background: var(--color-surface);
```

e não:

```css
background: #111827;
```

---

# 18. Tokens semânticos recomendados

```css
:root {
  --color-brand: #22C55E;
  --color-brand-hover: #16A34A;
  --color-brand-soft: #14532D;

  --color-accent: #3B82F6;
  --color-accent-soft: #1E40AF;

  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
  --color-purple: #A855F7;
}
```

---

# 19. Tokens do modo escuro

```css
[data-color-mode="dark"] {
  --color-canvas: #0F172A;

  --color-surface: #111827;
  --color-surface-raised: #1E293B;
  --color-surface-sunken: #0B1120;

  --color-text: #F8FAFC;
  --color-text-strong: #FFFFFF;
  --color-text-muted: #94A3B8;
  --color-text-faint: #64748B;

  --color-border: #1F2937;
  --color-border-soft: rgba(148, 163, 184, 0.12);
  --color-border-strong: #334155;

  --color-accent: #22C55E;
  --color-accent-hover: #16A34A;
  --color-accent-soft: rgba(34, 197, 94, 0.12);
  --color-accent-contrast: #FFFFFF;
}
```

---

# 20. Tokens do modo claro

```css
[data-color-mode="light"] {
  --color-canvas: #F8FAFC;

  --color-surface: #FFFFFF;
  --color-surface-raised: #F1F5F9;
  --color-surface-sunken: #E2E8F0;

  --color-text: #0F172A;
  --color-text-strong: #020617;
  --color-text-muted: #64748B;
  --color-text-faint: #94A3B8;

  --color-border: #CBD5E1;
  --color-border-soft: rgba(15, 23, 42, 0.08);
  --color-border-strong: #94A3B8;

  --color-accent: #22C55E;
  --color-accent-hover: #16A34A;
  --color-accent-soft: rgba(34, 197, 94, 0.10);
  --color-accent-contrast: #FFFFFF;
}
```

---

# 21. Espaçamento

Utilizar sistema baseado em:

```text
4px
```

---

## Escala

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

# 22. Regra de espaçamento

Priorizar:

```text
8px
12px
16px
24px
32px
```

Evitar valores arbitrários como:

```text
13px
19px
27px
```

salvo necessidade técnica específica.

---

# 23. Raios de borda

Escala:

```css
--radius-xs: 4px;
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 20px;
--radius-3xl: 24px;
--radius-full: 999px;
```

---

# 24. Uso recomendado dos raios

## 4–6px

- badges;
- tags;
- pequenos controles.

## 8px

- inputs;
- botões.

## 12px

- cards;
- popovers.

## 16px

- painéis maiores.

## 20–24px

- modais;
- áreas especiais.

## 999px

- avatars;
- pills;
- status.

---

# 25. Sombras

Sombras devem ser discretas no tema escuro.

---

## Small

```css
--shadow-sm:
  0 1px 2px rgba(0, 0, 0, 0.20);
```

Uso:

- botão;
- input elevado;
- elementos pequenos.

---

## Medium

```css
--shadow-md:
  0 4px 12px rgba(0, 0, 0, 0.25);
```

Uso:

- dropdown;
- menu;
- popover.

---

## Large

```css
--shadow-lg:
  0 12px 24px rgba(0, 0, 0, 0.35);
```

Uso:

- modal;
- painel flutuante.

---

# 26. Botões

Tipos oficiais:

```text
Primário
Secundário
Terciário
Destrutivo
Desabilitado
```

---

# 27. Botão primário

Uso:

```text
ação principal da tela
```

Exemplos:

```text
Salvar
Entrar
Enviar
Criar
Confirmar
```

Visual:

```css
background: var(--color-accent);
color: var(--color-accent-contrast);
```

Hover:

```css
background: var(--color-accent-hover);
```

---

# 28. Botão secundário

Uso:

- ações alternativas;
- cancelar;
- gerenciar;
- opções secundárias.

Visual:

```text
surface
+
border
```

---

# 29. Botão terciário

Uso:

- ações de baixa prioridade;
- toolbars;
- menus;
- ícones.

Normalmente sem background permanente.

---

# 30. Botão destrutivo

Utilizar:

```css
background: var(--color-danger);
```

Exemplos:

```text
Excluir servidor
Banir
Sair
Apagar
```

Não utilizar vermelho para ações comuns.

---

# 31. Botão disabled

Deve possuir:

```text
menor contraste
+
cursor apropriado
+
sem hover de ação
```

Não depender apenas de `opacity: 0.2`.

O texto ainda deve ser legível.

---

# 32. Altura dos controles

Recomendação:

```text
Small:   32px
Default: 40px
Large:   44–48px
```

A maioria dos inputs deve utilizar:

```text
40px
```

---

# 33. Inputs

Estados oficiais:

```text
default
hover
focus
disabled
error
success
```

---

# 34. Input padrão

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
color: var(--color-text);
border-radius: var(--radius-md);
```

---

# 35. Input focus

```css
border-color: var(--color-accent);
```

Pode adicionar:

```css
box-shadow:
  0 0 0 3px rgba(34, 197, 94, 0.12);
```

---

# 36. Input error

```css
border-color: var(--color-danger);
```

Mensagem:

```text
Explique claramente o problema.
```

Não mostrar apenas uma borda vermelha.

---

# 37. Placeholder

Utilizar:

```css
color: var(--color-text-faint);
```

Placeholder nunca deve parecer texto preenchido.

---

# 38. Inputs com ícones

Suportar:

```text
[🔍 Buscar]
```

e:

```text
[Texto                    ×]
```

Ícones devem possuir padding adequado e não reduzir demais a área do texto.

---

# 39. Textarea

Utilizar o mesmo padrão visual dos inputs.

Para mensagens:

```text
auto-grow
```

até aproximadamente:

```text
5–6 linhas
```

depois:

```text
scroll interno
```

---

# 40. Select

Deve seguir a mesma linguagem de input.

Evitar estilo nativo completamente diferente quando possível.

---

# 41. Checkbox

Estados:

```text
desmarcado
marcado
disabled
```

Marcado utiliza:

```text
verde da marca
```

---

# 42. Radio

Selecionado:

```text
ring verde
+
centro verde
```

Não utilizar check como visual de radio.

---

# 43. Switch

## Ativado

```text
track verde
+
thumb claro
```

## Desativado

```text
track neutro
+
thumb secundário
```

---

# 44. Badges

Tipos oficiais:

```text
Novo
Beta
Em breve
Sucesso
Aviso
Erro
Info
Neutro
```

---

# 45. Badge Novo

```text
verde
```

---

# 46. Badge Beta

```text
azul
```

---

# 47. Badge Em breve

```text
roxo
```

---

# 48. Badge Sucesso

```text
verde
```

---

# 49. Badge Aviso

```text
âmbar
```

---

# 50. Badge Erro

```text
vermelho
```

---

# 51. Badge Info

```text
azul
```

---

# 52. Badge Neutro

```text
cinza
```

---

# 53. Tags

Exemplo:

```text
[RPG ×]
[Tecnologia ×]
[Comunidade ×]
```

Utilizar para:

- categorias;
- filtros;
- labels editáveis.

Não utilizar badge e tag como se fossem o mesmo componente.

---

# 54. Avatar

Formatos:

```text
imagem
iniciais
placeholder
ação adicionar
```

Tamanhos recomendados:

```css
--avatar-xs: 24px;
--avatar-sm: 32px;
--avatar-md: 40px;
--avatar-lg: 56px;
--avatar-xl: 72px;
--avatar-2xl: 96px;
```

---

# 55. Presence

Status deve aparecer sobre ou próximo ao avatar.

Estados:

```text
online
away
busy
offline
```

Sugestão:

```text
online  → green
away    → amber
busy    → red
offline → muted
```

---

# 56. Barras de progresso

Normal:

```text
track neutro
+
fill verde
```

Exemplo:

```text
████████████░░░░ 60%
```

---

# 57. Loading progress

Pode utilizar movimento suave.

Evitar animações muito chamativas.

Respeitar:

```css
prefers-reduced-motion
```

---

# 58. Alerts

Tipos:

```text
Success
Warning
Error
Information
```

---

## Success

```text
✓ Sucesso!

A ação foi realizada com sucesso.
```

---

## Warning

```text
⚠ Atenção!

Revise as informações antes de continuar.
```

---

## Error

```text
Erro!

Não foi possível concluir a ação.
```

---

## Information

```text
Informação

Veja mais detalhes sobre esta ação.
```

---

# 59. Alert visual

Cada alert deve combinar:

```text
ícone
+
título
+
mensagem
+
cor semântica
```

Não utilizar somente background colorido.

---

# 60. Modais

Tipos principais:

```text
Default Modal
Confirm Modal
Sheet Mobile
```

---

# 61. Modal padrão

Estrutura:

```text
┌────────────────────────────┐
│ Título do modal         ×  │
│                            │
│ Descrição                  │
│                            │
│               Cancelar     │
│               Confirmar    │
└────────────────────────────┘
```

---

# 62. Modal padrão — comportamento

Deve:

- bloquear interação atrás;
- capturar foco;
- permitir `Esc` quando apropriado;
- restaurar foco ao fechar;
- possuir `aria-modal`;
- possuir título acessível.

---

# 63. Confirm Modal

Usado para ações importantes.

Exemplo:

```text
⚠ Tem certeza?

Esta ação não pode ser desfeita.

[Cancelar] [Excluir]
```

---

# 64. Ação destrutiva no modal

O botão destrutivo deve ser claramente diferente do botão de confirmação normal.

---

# 65. Mobile Sheet

No mobile, algumas ações podem utilizar painel inferior.

Exemplo:

```text
────────

Ação do menu

Opção 1
Opção 2
Opção 3
```

O sheet pode ocupar:

```text
auto
```

ou até aproximadamente:

```text
80dvh
```

dependendo do conteúdo.

---

# 66. Cards

Estrutura recomendada:

```css
background: var(--color-surface);
border: 1px solid var(--color-border-soft);
border-radius: var(--radius-lg);
```

Não utilizar sombras fortes em todos os cards.

---

# 67. Card interativo

Hover:

```text
surface-raised
```

Selecionado:

```text
accent-soft
+
border accent
```

---

# 68. Menus e Dropdowns

Usar:

```text
surface-raised
shadow-md
radius-md ou lg
```

Itens:

```text
40px aproximadamente
```

de altura.

---

# 69. Menus destrutivos

Ações como:

```text
Excluir
Banir
Sair
```

devem aparecer em vermelho.

Separar de ações comuns quando possível.

---

# 70. Tooltips

Utilizar para:

- ícones sem texto;
- estados;
- ações secundárias.

Não esconder informação essencial exclusivamente em tooltip.

---

# 71. Ícones

Os ícones devem utilizar uma linguagem consistente.

Preferir:

```text
outline
stroke uniforme
24 × 24
```

Tamanhos comuns:

```text
16px
18px
20px
24px
```

---

# 72. Unicode

Evitar utilizar como ícone final:

```text
⚙
◖
☎
×
➤
```

quando houver SVG correspondente.

Caracteres podem ser utilizados temporariamente durante prototipação.

---

# 73. Navegação

Sidebar ativa:

```text
background accent-soft
+
texto principal
+
ícone accent
```

Hover:

```text
surface-raised
```

---

# 74. Canal ativo

Utilizar o mesmo princípio:

```text
accent-soft
```

Nunca utilizar verde sólido ocupando toda uma sidebar longa sem necessidade.

---

# 75. Status de foco

Todo elemento interativo deve possuir foco visível.

Sugestão:

```css
outline: 2px solid var(--color-accent);
outline-offset: 2px;
```

ou ring equivalente.

---

# 76. Motion

Transições padrão:

```css
--duration-fast: 120ms;
--duration-normal: 180ms;
--duration-slow: 240ms;
```

---

# 77. Easing

```css
--ease-standard:
  cubic-bezier(0.2, 0, 0, 1);
```

---

# 78. Uso de animações

Permitido:

- hover;
- painel entrando;
- modal;
- indicador de fala;
- loading;
- troca de seleção.

Evitar:

- animações decorativas constantes;
- bounce excessivo;
- zoom agressivo.

---

# 79. Reduced motion

Respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

Desativar ou reduzir animações não essenciais.

---

# 80. Dark Mode — exemplo de composição

```text
┌────────────┬───────────────────────────────┐
│ Sidebar    │ # geral                       │
│            │                               │
│ Amigos     │ Pedro                         │
│ Mensagens  │ Olá comunidade! 👋            │
│ Servidores │                               │
│            │                               │
│ Config.    │ + Conversar em #geral         │
└────────────┴───────────────────────────────┘
```

Características:

```text
canvas escuro
sidebar levemente diferente
surfaces elevadas discretas
verde apenas em ações e estados
```

---

# 81. Light Mode — exemplo de composição

```text
┌────────────┬───────────────────────────────┐
│ Sidebar    │ # geral                       │
│            │                               │
│ Amigos     │ Pedro                         │
│ Mensagens  │ Olá comunidade! 👋            │
│ Servidores │                               │
│            │                               │
│ Config.    │ + Conversar em #geral         │
└────────────┴───────────────────────────────┘
```

Características:

```text
fundo branco/cinza muito claro
surfaces suaves
texto azul-preto
bordas discretas
verde permanece como marca
```

---

# 82. Regras para contraste

Texto principal:

```text
alto contraste
```

Texto secundário:

```text
contraste moderado
```

Muted:

```text
não pode ficar ilegível
```

Evitar:

```text
cinza muito escuro em fundo escuro
```

ou:

```text
cinza muito claro em branco
```

---

# 83. Uso da cor verde

O verde é a cor da identidade.

Usar para:

- CTA principal;
- estado ativo;
- speaker ativo quando apropriado;
- sucesso;
- foco;
- presença online;
- detalhes da marca.

Não usar verde em:

- todo texto;
- todas as bordas;
- todos os cards;
- grandes fundos constantes.

---

# 84. Uso do azul

O azul é secundário.

Usar para:

- informação;
- links;
- elementos auxiliares;
- ferramentas secundárias.

Não competir com o verde pela identidade principal.

---

# 85. Uso do roxo

Roxo deve ser raro.

Pode indicar:

- beta;
- experimental;
- recursos especiais;
- gradientes secundários.

---

# 86. Bordas

Prioridade:

```text
border-soft
```

para separar superfícies.

Utilizar:

```text
border-strong
```

somente quando a separação precisar ser evidente.

---

# 87. Superfícies

Hierarquia:

```text
canvas
↓
surface
↓
surface-raised
```

Isso deve criar profundidade sem depender de sombras pesadas.

---

# 88. Componentes reutilizáveis

Sempre que possível, utilizar componentes compartilhados para:

```text
Button
Input
Textarea
Select
Toggle
Choice
Avatar
Badge
Alert
Modal
Tooltip
Menu
```

Não criar uma implementação diferente em cada tela.

---

# 89. Consistência com as Etapas de Redesign

As telas:

```text
Mensagens Diretas
Home/Amigos
Servidor/Canais
Chat do Servidor
Canal de Voz
Configurações
```

devem utilizar este Design System como referência principal.

Os mockups das etapas definem:

```text
layout
```

Este documento define:

```text
linguagem visual
```

Se houver conflito de cor entre mockup e Design System:

```text
Design System vence.
```

---

# 90. Hierarquia das fontes

Evitar excesso de:

```text
BOLD
UPPERCASE
```

Uppercase deve ser usado principalmente em:

```text
labels muito pequenas
categorias
eyebrows
```

Botões normais devem preferir:

```text
Salvar
Criar canal
Gerenciar
```

em vez de:

```text
SALVAR
CRIAR CANAL
GERENCIAR
```

---

# 91. Bordas de controles

Inputs e botões não devem parecer caixas excessivamente grossas.

Padrão:

```text
1px
```

Destaque/focus:

```text
accent
```

---

# 92. Altura mínima de clique

Desktop:

```text
32px mínimo
```

Preferencial:

```text
40px
```

Mobile:

```text
44px
```

sempre que possível.

---

# 93. Scrollbars

Podem ser discretamente estilizadas.

No dark:

```text
track transparente
thumb neutral-700
```

Hover:

```text
neutral-600
```

Não esconder completamente scroll quando ele for importante.

---

# 94. Seleção de texto

Opcional:

```css
::selection {
  background: rgba(34, 197, 94, 0.25);
}
```

---

# 95. Estado online

Utilizar:

```css
#22C55E
```

---

# 96. Estado away

Utilizar:

```css
#F59E0B
```

---

# 97. Estado busy / DND

Utilizar:

```css
#EF4444
```

---

# 98. Estado offline

Utilizar neutro muted.

---

# 99. Speaker ativo

Pode utilizar:

```text
ring verde
```

ao redor do avatar.

Exemplo:

```css
box-shadow:
  0 0 0 2px var(--color-accent);
```

Não utilizar animação muito forte.

---

# 100. Modal backdrop

Dark:

```css
background:
  rgba(2, 6, 23, 0.72);
```

Pode utilizar blur leve:

```css
backdrop-filter: blur(4px);
```

se performance permitir.

---

# 101. Z-index recomendado

Criar escala consistente.

```css
--z-base: 0;
--z-sticky: 10;
--z-dropdown: 100;
--z-popover: 200;
--z-modal: 500;
--z-toast: 600;
--z-tooltip: 700;
```

Evitar:

```text
z-index: 999999999
```

---

# 102. Container de conteúdo

Em interfaces de chat:

```text
não limitar a coluna inteira com max-width pequeno
```

A área principal deve preencher o espaço.

Conteúdo individual pode ter limites próprios.

---

# 103. Responsividade

Desktop:

```text
múltiplos painéis
```

Mobile:

```text
views sequenciais
```

Evitar simplesmente comprimir quatro colunas em uma tela pequena.

---

# 104. Design mobile

No mobile:

- headers mais compactos;
- ações importantes sempre acessíveis;
- sheets no lugar de menus grandes;
- área segura para notch/home indicator;
- `100dvh`;
- teclado virtual considerado;
- touch targets >= 44px quando possível.

---

# 105. Estados vazios

Estrutura:

```text
ícone discreto

Título

Descrição

[Ação opcional]
```

Evitar estados vazios com:

```text
mensagens técnicas
```

ou:

```text
nomenclatura interna de desenvolvimento
```

---

# 106. Loading

Prioridade:

```text
skeleton simples
ou
spinner discreto
```

Não adicionar bibliotecas externas apenas para loading.

---

# 107. Feedback de sucesso

Preferir toast ou mensagem contextual.

Exemplo:

```text
✓ Alterações salvas.
```

---

# 108. Feedback de erro

Exemplo:

```text
Não foi possível salvar as alterações.

[Tentar novamente]
```

Sempre que possível oferecer ação para recuperação.

---

# 109. Componentes destructive

A cor vermelha deve ser reservada para risco.

Não usar vermelho como destaque decorativo.

---

# 110. CSS Variables recomendadas

Base inicial:

```css
:root {
  /* Brand */
  --color-brand: #22C55E;
  --color-brand-hover: #16A34A;
  --color-brand-soft: #14532D;

  /* Accent */
  --color-accent-blue: #3B82F6;
  --color-accent-blue-soft: #1E40AF;
  --color-purple: #A855F7;

  /* State */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;

  /* Space */
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

  /* Radius */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 999px;

  /* Shadow */
  --shadow-sm:
    0 1px 2px rgba(0, 0, 0, 0.20);

  --shadow-md:
    0 4px 12px rgba(0, 0, 0, 0.25);

  --shadow-lg:
    0 12px 24px rgba(0, 0, 0, 0.35);

  /* Motion */
  --duration-fast: 120ms;
  --duration-normal: 180ms;
  --duration-slow: 240ms;

  --ease-standard:
    cubic-bezier(0.2, 0, 0, 1);

  /* Layers */
  --z-base: 0;
  --z-sticky: 10;
  --z-dropdown: 100;
  --z-popover: 200;
  --z-modal: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}
```

---

# 111. Tema padrão

O Concord deve iniciar utilizando:

```text
Style Theme:
Concord

Color Mode:
Dark
```

Se o usuário escolher:

```text
Sistema
```

respeitar a preferência do sistema operacional.

---

# 112. Nome oficial do tema

Utilizar:

```text
Concord
```

como identificador do estilo.

Modo:

```text
Dark
Light
System
```

Visualmente pode ser apresentado como:

```text
Concord Dark
Concord Light
```

---

# 113. Não criar temas através de CSS duplicado

A arquitetura deve separar:

```text
Style Theme
```

de:

```text
Color Mode
```

Exemplo:

```text
Concord
├── Dark
└── Light
```

No futuro:

```text
Neo Brutalism
├── Dark
└── Light
```

```text
Liquid Glass
├── Dark
└── Light
```

---

# 114. Preparação para outros temas

Componentes não devem conter:

```css
background: #0F172A;
```

espalhado pelo código.

Preferir:

```css
background: var(--color-canvas);
```

Assim, temas futuros poderão alterar:

```text
cor
border
radius
shadow
tipografia visual
```

sem reconstruir componentes.

---

# 115. O que pode mudar entre Style Themes

Um Style Theme futuro pode alterar:

```text
radius
border width
shadows
surface treatment
accent treatment
button style
card style
modal style
input style
```

---

# 116. O que deve permanecer consistente

Mesmo com outros temas:

```text
component behavior
accessibility
spacing logic
semantic colors
interaction states
responsive behavior
```

devem continuar coerentes.

---

# 117. Estrutura sugerida de tokens

```text
theme/
├── theme-types.ts
├── theme-registry.ts
├── useTheme.ts
│
├── tokens/
│   ├── base.css
│   ├── dark.css
│   └── light.css
│
└── styles/
    └── concord.css
```

A estrutura exata deve respeitar a arquitetura já existente.

Não duplicar sistema de tema já implementado.

---

# 118. Ordem de prioridade visual

Em qualquer tela:

```text
Conteúdo
↓
Ação principal
↓
Navegação
↓
Ações secundárias
↓
Metadados
```

Não fazer todos os elementos competirem pela atenção.

---

# 119. Regra para implementação das etapas de redesign

Ao implementar os redesigns:

```text
documentação da etapa
=
arquitetura + UX + funcionalidade
```

```text
imagem da etapa
=
layout + composição
```

```text
este Design System
=
cores + tipografia + componentes + estilos + estados
```

---

# 120. Prioridade em caso de conflito

Se houver conflito:

```text
1. Funcionalidade real do projeto
2. Design System
3. Documentação da etapa
4. Mockup visual
```

O mockup nunca deve forçar:

- dados fictícios;
- recursos inexistentes;
- cores fora do sistema;
- componentes inconsistentes.

---

# 121. Critérios de aceite do Design System

Uma implementação está consistente quando:

1. Não usa cores fixas desnecessárias.
2. Usa tokens semânticos.
3. Utiliza Inter ou fallback equivalente.
4. Respeita a escala de espaçamento.
5. Respeita a escala de radius.
6. Utiliza botões consistentes.
7. Inputs possuem estados claros.
8. Focus é visível.
9. Modais seguem o mesmo padrão.
10. Alertas utilizam cores semânticas.
11. Dark e Light permanecem funcionais.
12. Mobile continua acessível.
13. Componentes equivalentes possuem o mesmo visual.
14. Verde continua sendo a principal identidade do Concord.
15. Outros temas podem ser adicionados sem reconstruir a aplicação.

---

# 122. Resultado esperado

O Concord deve transmitir:

```text
interface moderna
+
ambiente confortável para uso prolongado
+
identidade própria
+
verde reconhecível
+
fundos azulados escuros
+
componentes consistentes
+
boa acessibilidade
+
estrutura preparada para múltiplos temas
```

---

# 123. Regra final

O tema Concord deve ser:

```text
simples o suficiente para não cansar
```

mas:

```text
marcante o suficiente para possuir identidade
```

A interface não deve depender de efeitos exagerados para parecer moderna.

Priorizar:

```text
tipografia
hierarquia
spacing
contraste
superfícies
feedback
```

antes de efeitos decorativos.

Este documento representa o **Design System padrão oficial do Concord**.

Todos os futuros Style Themes deverão reutilizar a mesma arquitetura de componentes e comportamento, alterando principalmente a camada visual.
