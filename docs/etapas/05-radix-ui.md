# Etapa 05 - Radix UI no front

## Objetivo

Substituir os controles feitos a mao pelos primitivos acessiveis do Radix, sem mudar a
aparencia: mesmo CSS, mesmos tokens, mesmas tres familias visuais nos dois modos de cor.

## Estado antes

- dialogos: `div.server-dialog-backdrop` + `section[role=dialog]` escritos a mao em
  `CreateServerDialog`, `InviteLinkDialog`, `PeopleDialog` e `SettingsDialog`, sem foco preso,
  sem `Esc` e sem devolucao de foco;
- menu do servidor: `<details><summary>`, que nao fecha ao clicar fora nem navega por setas;
- dicas dos botoes `+`: `::after` com `content: attr(data-tooltip)`, invisivel para leitor de tela;
- abas das configuracoes: `button` com classe `active`, sem `role=tab`;
- seletor de qualidade da tela: `section[role=dialog]` posicionado com `position: fixed`;
- `select`, `checkbox` e avatares nativos espalhados por seis componentes;
- erro do workspace: `<p class="workspace-error">` fixo, sem como fechar.

## Estado depois

- `radix-ui` (pacote unico) como dependencia de `@concord/web`;
- `apps/web/src/components/ui/`: `Modal` (Dialog), `Choice` (Select), `Toggle` (Checkbox),
  `Avatar`, `Hint` (Tooltip) e `ErrorToast` (Toast);
- `DropdownMenu` no menu do servidor, `Tabs` nas secoes das configuracoes e `Popover` no
  seletor de qualidade, ancorado no botao TELA em vez de posicionado a mao;
- `Tooltip.Provider` em `main.tsx`;
- CSS migrado de classes de estado para atributos do Radix (`[data-state]`, `[data-highlighted]`);
- avatares agora tem fallback de iniciais quando a foto falha em carregar.

Decisoes e consequencias em `docs/decisoes/0008-radix-ui-como-base-de-componentes.md`.

## Criterios de aceite

1. Abrir qualquer dialogo prende o foco, fecha com `Esc` e devolve o foco ao gatilho.
2. O menu do servidor abre por clique ou teclado, navega por setas e fecha ao clicar fora.
3. As secoes das configuracoes respondem como abas (`role=tab`, setas do teclado).
4. Estilo, tipo de canal e cargo do membro funcionam como `combobox` com teclado.
5. Manter conectado, silenciar servidor e permissoes por canal respondem como `checkbox`.
6. Nada muda de aparencia nas tres familias visuais, nos dois modos e no mobile.
7. O erro do workspace pode ser fechado pelo usuario.

## Validacao

- `pnpm check` e `pnpm lint`;
- `pnpm test:e2e` (15 jornadas) com as assercoes atualizadas para `tab`, `combobox`, `option`
  e `checkbox`;
- capturas conferidas em `concord` e `ios`, desktop e viewport movel de 390px.

## Fora deste recorte

- `ScrollArea` nas listas de mensagens e canais;
- `Toast` para os feedbacks de formulario, que seguem inline com `role="status"`;
- `AlertDialog` no lugar dos `window.confirm` de excluir servidor e banir membro;
- `Form` do Radix para validacao de campos.
