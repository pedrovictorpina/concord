# ADR 0008 - Radix UI como base de componentes

## Status

Aceita em 2026-08-19.

## Contexto

A interface era construida com elementos nativos e improvisos: dialogos eram `div` com
`role="dialog"` escritos a mao, o menu do servidor era um `<details>`, as dicas dos botoes `+`
eram `::after` com `attr(data-tooltip)`, as abas das configuracoes eram botoes com classe
`active` e o aviso de erro era um `<p>` fixo. Nada disso prendia o foco, respondia a `Esc`,
devolvia o foco ao gatilho, navegava por setas ou anunciava estado para leitor de tela.

O projeto ja tem um sistema de temas proprio: tokens semanticos, tres familias visuais
(`concord`, `ios`, `brutal`) e dois modos de cor (ver ADR 0004). Qualquer biblioteca de
componentes com estilo proprio brigaria com isso.

## Decisao

Adotar **Radix Primitives** pelo pacote unico `radix-ui`, sem estilo imposto. O CSS e os tokens
do Concord seguem sendo a unica fonte de aparencia.

Os primitivos ficam encapsulados em `apps/web/src/components/ui/`, que e o padrao a ser usado
antes de escrever qualquer controle novo:

| Wrapper | Primitivo | Uso |
| --- | --- | --- |
| `Modal` | `Dialog` | criar servidor, convite por link, pessoas, configuracoes |
| `Choice` | `Select` | estilo do tema, tipo de canal, cargo do membro |
| `Toggle` | `Checkbox` | manter conectado, silenciar servidor, permissoes por canal |
| `Avatar` | `Avatar` | toda foto/iniciais de pessoa ou servidor |
| `Hint` | `Tooltip` | dicas dos botoes de acao |
| `ErrorToast` | `Toast` | aviso de erro do workspace |

Sem wrapper, usados direto onde ha uma unica ocorrencia: `DropdownMenu` no menu do servidor,
`Tabs` nas secoes das configuracoes e `Popover` no seletor de qualidade da tela.

## Consequencias

- Foco preso no dialogo, `Esc` para fechar, foco devolvido ao gatilho e `aria-*` correto passam
  a ser comportamento padrao, sem codigo por tela.
- O nome acessivel do dialogo vem de `Dialog.Title`: **nao** sobrescrever o `id` gerado pelo
  Radix, senao o `aria-labelledby` do conteudo aponta para um id inexistente e o dialogo perde
  o nome.
- Controles deixam de ser elementos nativos: `Select` virou `role="combobox"` + `role="option"`,
  `Checkbox` virou `role="checkbox"` e as abas viraram `role="tab"`. Os testes Playwright usam
  esses papeis; `selectOption` nao se aplica mais.
- Estado visual vem de atributos de dados (`[data-state="open"]`, `[data-state="active"]`,
  `[data-highlighted]`), nao de classes proprias.
- Conteudo em portal (dialogos, menus, popovers, tooltips) sai da arvore do `.app-shell`. Regras
  de CSS que dependiam de aninhamento precisam de seletor proprio.
- No mobile, o `Select` do Radix nao abre o seletor nativo do sistema. Em troca, mantem a mesma
  aparencia nas tres familias visuais.
- Feedback de formulario continua inline com `role="status"` dentro do proprio dialogo; toast
  fica reservado ao erro global, que nao tem contexto na tela.

## Alternativas descartadas

- **Radix Themes**: traz componentes estilizados e seu proprio sistema de cores, o que
  substituiria o registro de temas do Concord.
- **Manter o feito a mao**: cada dialogo novo repetiria os mesmos erros de foco e teclado.
- **shadcn/ui**: pressupoe Tailwind, que o projeto nao usa.
