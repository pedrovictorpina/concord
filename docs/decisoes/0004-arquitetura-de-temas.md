# ADR 0004 - Temas por tokens semanticos

- Estado: aceita
- Data: 2026-08-17

## Contexto

O Concord devera oferecer familias visuais bastante diferentes, como uma interpretacao iOS e uma versao neo-brutalista. Trocar somente cores nao e suficiente: tipografia, raios, sombras, densidade e movimento tambem mudam.

## Decisao

Separar familia de estilo e modo de cor. O React mantem a preferencia e aplica atributos no elemento raiz; CSS define tokens semanticos para cada combinacao.

```text
styleTheme: concord | neo | glass
colorMode: system | light | dark
resolvedColorMode: light | dark
```

O registro de temas contem metadados e capacidades. Componentes nao conhecem nomes de temas e nao usam cores literais para estados estruturais.

## Atualizacao 2026-08-21

Os tres design systems oficiais foram escritos em `docs/design-system/` e aplicados. Duas correcoes de arquitetura vieram com eles:

- **Tokens compartilhados saem do tema.** `--space-*`, `--font-size-*` e as escalas de tipografia/z-index/avatar viviam apenas sob `:root[data-style-theme='concord']`, entao trocar de familia deixava ~140 referencias sem valor (paddings e fontes colapsavam). Passaram para `theme/tokens/base.css` em `:root`. Regra: se o token nao muda entre familias, ele nao pertence ao arquivo da familia.
- **Ids alinhados ao design system.** `ios` virou `glass` e `brutal` virou `neo`. Como o id e persistido em `localStorage`, a leitura migra os valores antigos (`legacyStyleThemeIds`), e o bootstrap inline do `index.html` faz a mesma migracao para nao piscar o tema errado no primeiro paint.

Efeitos que dependem do tema (movimento fisico do Neo Brutalism, `backdrop-filter` do Liquid Glass) ficam no CSS da propria familia, com seletor `:root[data-style-theme='...']`, em vez de virar componente novo. O Liquid Glass restringe o vidro a paineis e controles: mensagens e listas longas continuam sobre superficie estavel, por legibilidade e por desempenho em chamada.

## Consequencias

- claro e escuro podem existir em qualquer familia;
- seguir o dispositivo e o comportamento padrao;
- preferencias sao versionadas no armazenamento local;
- adicionar um estilo exige tokens e registro, nao duplicar a aplicacao;
- renomear um estilo exige migracao nos dois pontos que leem o armazenamento;
- diferencas estruturais extremas poderao usar variantes de composicao declaradas pelo tema;
- contraste e responsividade devem ser validados para cada combinacao publicada.
