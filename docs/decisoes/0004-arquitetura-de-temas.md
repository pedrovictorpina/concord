# ADR 0004 - Temas por tokens semanticos

- Estado: aceita
- Data: 2026-08-17

## Contexto

O Darkcord devera oferecer familias visuais bastante diferentes, como uma interpretacao iOS e uma versao neo-brutalista. Trocar somente cores nao e suficiente: tipografia, raios, sombras, densidade e movimento tambem mudam.

## Decisao

Separar familia de estilo e modo de cor. O React mantem a preferencia e aplica atributos no elemento raiz; CSS define tokens semanticos para cada combinacao.

```text
styleTheme: darkcord | ios | neo-brutalism | ...
colorMode: system | light | dark
resolvedColorMode: light | dark
```

O registro de temas contem metadados e capacidades. Componentes nao conhecem nomes de temas e nao usam cores literais para estados estruturais.

## Consequencias

- claro e escuro podem existir em qualquer familia;
- seguir o dispositivo e o comportamento padrao;
- preferencias sao versionadas no armazenamento local;
- adicionar um estilo exige tokens e registro, nao duplicar a aplicacao;
- diferencas estruturais extremas poderao usar variantes de composicao declaradas pelo tema;
- contraste e responsividade devem ser validados para cada combinacao publicada.
