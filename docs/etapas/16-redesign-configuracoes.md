# Concord — Etapa 16: Redesign de Configurações

**Status:** Planejamento visual e técnico  
**Referência visual:** mockup aprovado da Etapa 16  
**Objetivo:** transformar o atual `SettingsDialog` em uma central de configurações moderna, organizada e escalável, preservando todas as funções reais existentes e preparando a interface para futuras configurações.

---

## 1. Objetivo

A área de configurações deve deixar de parecer um modal extenso com vários formulários e passar a funcionar como uma verdadeira central de controle do Concord.

Prioridades:

```text
organização
+
hierarquia
+
clareza
+
feedback
+
facilidade de navegação
+
responsividade
```

A referência visual deve orientar a composição, não a criação de funcionalidades inexistentes.

---

## 2. Estrutura aprovada

Desktop:

```text
┌──────────────────┬──────────────────────────────────────────────┬──────────────────────┐
│ Configurações    │ Conteúdo                                    │ Resumo contextual     │
│                  │                                             │                      │
│ CONTA            │ Minha conta                                 │ [Avatar]             │
│ Minha conta      │                                             │ Nome                 │
│ Perfil           │ Informações                                 │ @username            │
│                  │ ┌─────────────────────────────────────────┐ │                      │
│ PREFERÊNCIAS     │ │ Nome                                    │ │ Ações rápidas        │
│ Aparência        │ │ Username                                │ │                      │
│ Voz              │ └─────────────────────────────────────────┘ │                      │
│ Notificações     │                                             │                      │
│                  │ Preferências                                │                      │
│ COMUNIDADES      │ ...                                         │                      │
│ Servidores       │                                             │                      │
│ Canais           │                                             │                      │
│ Permissões       │                                             │                      │
│                  │                                             │                      │
│ [Sair]           │                                             │                      │
└──────────────────┴──────────────────────────────────────────────┴──────────────────────┘
```

---

## 3. Regra sobre o mockup

O mockup aprovado apresenta alguns recursos que ainda não existem no Concord, como:

```text
email da conta
senha
2FA
sessões ativas
privacidade avançada
idioma
atalhos
acessibilidade extensa
Premium
faturamento
aplicativos autorizados
```

Esses recursos **não devem ser implementados apenas para reproduzir a imagem**.

A referência serve para orientar:

```text
layout
navegação
densidade
cards
tipografia
organização
hierarquia
```

O Codex deve reproduzir a qualidade visual e estrutural da referência utilizando somente dados e funcionalidades reais do projeto.

---

## 4. Estado atual

O componente central é:

```text
apps/web/src/features/workspace/SettingsDialog.tsx
```

Atualmente ele concentra:

```text
Perfil
Tema
Voz
Servidores
Servidor
Canais
Notificações
Permissões
```

O principal problema não é falta de funcionalidade.

O problema é que muitas funcionalidades diferentes estão concentradas em um único componente grande e possuem pouca diferenciação visual.

A Etapa 16 deve melhorar:

```text
organização
+
componentização
+
navegação
+
hierarquia visual
```

sem reescrever a lógica já funcional sem necessidade.

---

# NAVEGAÇÃO

## 5. Reorganizar as categorias

Em vez de uma lista plana:

```text
Perfil
Tema
Voz
Servidores
Servidor
Canais
Notificações
Permissões
```

organizar em grupos.

### CONTA

```text
Minha conta
```

### PREFERÊNCIAS

```text
Aparência
Voz e áudio
Notificações
```

### SERVIDORES

```text
Meus servidores
Servidor atual
Canais
Permissões
```

### SESSÃO

```text
Sair da conta
```

---

## 6. IDs internos

Não é obrigatório alterar os identificadores internos atuais.

Pode continuar utilizando:

```ts
type SettingsTab =
  | 'profile'
  | 'appearance'
  | 'voice'
  | 'servers'
  | 'server'
  | 'channels'
  | 'notifications'
  | 'permissions'
```

A mudança pode ser majoritariamente visual.

---

## 7. Minha conta

O item visual:

```text
Perfil
```

deve preferencialmente passar a ser apresentado como:

```text
Minha conta
```

Internamente ele ainda pode utilizar:

```ts
profile
```

para evitar mudanças desnecessárias.

---

## 8. Navegação lateral

Cada item deve possuir:

```text
[ícone] Nome da seção
```

Exemplo:

```text
👤 Minha conta
🎨 Aparência
🔊 Voz e áudio
🔔 Notificações
```

Na implementação final, preferir SVGs consistentes em vez de emojis.

### Estado normal

```text
texto muted
background transparente
```

### Hover

```text
surface-raised
```

### Ativo

```text
accent-soft
+
texto forte
+
indicador visual
```

Não depender exclusivamente da cor para indicar a aba selecionada.

---

## 9. Ícones

Usar SVGs internos consistentes.

Sugestão conceitual:

```text
Minha conta      pessoa
Aparência        paleta
Voz e áudio      alto-falante
Notificações     sino
Servidores       servidor
Canais           #
Permissões       escudo
```

Não instalar uma biblioteca grande de ícones apenas para esta etapa se o projeto já possui `WorkspaceIcons` ou solução equivalente.

---

# LAYOUT

## 10. Configurações devem ocupar mais espaço

Hoje as configurações são abertas dentro do componente `Modal`.

No desktop, o modal deve se comportar visualmente como uma página de configurações ampla.

Sugestão:

```css
width: min(1200px, calc(100vw - 64px));
height: min(820px, calc(100dvh - 64px));
```

Os valores exatos devem se adaptar ao design system existente.

Objetivo:

```text
não parecer um formulário apertado
```

e sim:

```text
parecer uma central de configurações
```

---

## 11. Estrutura em três áreas

Em desktop amplo:

```text
Navigation
Content
Context
```

Representação:

```text
┌──────────────┬────────────────────────────┬─────────────────┐
│ Navegação    │ Conteúdo                   │ Contexto        │
└──────────────┴────────────────────────────┴─────────────────┘
```

---

## 12. Painel contextual direito

O painel direito deve possuir conteúdo relacionado à seção atual.

Não criar um painel vazio apenas para reproduzir o mockup.

### Minha conta

Mostrar:

```text
Avatar
Nickname
@username
status
```

e ações relevantes.

### Servidor atual

Mostrar:

```text
Nome do servidor
Cargo atual
Servidor silenciado ou não
```

### Voz e áudio

Mostrar:

```text
Microfone selecionado
Saída selecionada
Volume
Perfil de processamento
```

---

## 13. Breakpoints

Sugestão conceitual:

```text
>= 1250px
→ três colunas

900px–1249px
→ navegação + conteúdo

< 900px
→ comportamento mobile
```

O painel direito contextual deve ser o primeiro a desaparecer.

---

# MINHA CONTA

## 14. Cabeçalho

```text
Minha conta

Gerencie como você aparece no Concord.
```

---

## 15. Card principal

Estrutura:

```text
┌──────────────────────────────────────────────────┐
│ [Avatar]                                         │
│                                                  │
│ Nome de exibição          Pedro                  │
│ Nome de usuário           pedrovictorpina        │
│                                                  │
│                         [Editar]                 │
└──────────────────────────────────────────────────┘
```

O formulário não precisa estar sempre completamente aberto.

Pode permanecer editável normalmente se isso simplificar a implementação.

O importante é melhorar sua hierarquia visual.

---

## 16. Avatar

O Concord já suporta:

```text
upload de arquivo
+
URL
```

Na nova interface apresentar:

```text
[Avatar grande]

[Alterar foto]
```

O upload deve ser a ação principal.

A URL pode continuar disponível como opção secundária ou avançada.

---

## 17. Prévia do avatar

Preservar a prévia existente.

Ela deve aparecer integrada ao perfil em vez de isolada abaixo de vários inputs.

---

## 18. Não exibir email

O mockup apresenta email da conta.

Se o `WorkspaceIdentity` utilizado pela tela não fornecer email:

```text
NÃO inventar email
```

Não adicionar schema ou consulta apenas para copiar a imagem.

---

## 19. Segurança da conta

Não criar nesta etapa:

```text
senha
2FA
sessões ativas
dispositivos conectados
```

sem backend correspondente.

Esses itens podem virar uma etapa própria futuramente:

```text
Account Security
```

---

# SESSÃO

## 20. Sair da conta

A ação de sair atualmente está dentro da área de perfil.

Mover visualmente para uma área própria:

```text
Sessão

[Sair da conta]
```

Preferencialmente no final da navegação lateral.

A ação deve continuar usando o callback existente:

```ts
onExit
```

---

## 21. Visual destrutivo

O botão deve utilizar estilo destrutivo.

Não colocá-lo próximo aos botões comuns de salvar.

---

# APARÊNCIA

## 22. Estrutura

```text
Aparência

Personalize como o Concord é exibido.

Tema
[Concord]

Modo de cor
[Sistema] [Claro] [Escuro]
```

---

## 23. Preservar ThemeControls

O projeto já possui:

```text
ThemeControls.tsx
```

com suporte a:

```text
estilo
modo sistema
claro
escuro
```

Não duplicar essa lógica no `SettingsDialog`.

A Etapa 16 deve apenas modernizar sua apresentação.

---

## 24. Preview de tema

Se for simples, adicionar uma pequena prévia.

Exemplo:

```text
┌───────────────────────┐
│ Concord               │
│                       │
│ # geral               │
│ mensagem              │
└───────────────────────┘
```

Não renderizar uma segunda aplicação completa dentro das configurações.

---

## 25. Cores de destaque

O mockup mostra seleção de cores de destaque.

Só implementar se o sistema de temas atual já suportar isso.

Caso contrário:

```text
fora do escopo
```

---

## 26. Densidade da interface

O mockup mostra:

```text
Padrão
Compacta
Espaçosa
```

Não implementar se não existir suporte global no design system.

Pode ser planejado para etapa futura.

---

# VOZ E ÁUDIO

## 27. Importância

Esta deve ser uma das áreas mais completas da central de configurações.

O Concord já possui:

```text
microfone
saída de áudio
volume
perfis
supressão
cancelamento de eco
ganho automático
teste de microfone
```

Reaproveitar toda a lógica existente.

---

## 28. Estrutura

```text
Voz e áudio

DISPOSITIVOS

Microfone
[Microfone padrão                         ▼]

Saída
[Alto-falante padrão                     ▼]

Volume da chamada
────────────●──────── 80%


PROCESSAMENTO

Perfil de entrada

[ Voz ]
[ Estúdio ]
[ Personalizado ]


SUPRESSÃO DE RUÍDO

[ Desativada ]
[ Padrão ]
[ Aprimorada ]


TESTE DE MICROFONE

[Testar microfone]

████████████░░░░
```

---

## 29. Integração com a documentação de supressão

Quando a etapa WebRTC + RNNoise estiver implementada, a UI deve utilizar:

```text
Desativada
Padrão
Aprimorada
```

Internamente:

```ts
off
webrtc
rnnoise
```

ou a estrutura adotada pela etapa de supressão.

Não voltar para uma nomenclatura baseada apenas em:

```text
low
standard
high
```

---

## 30. Perfis de entrada

Redesenhar como cards:

```text
Voz

Recomendado para chamadas.
```

```text
Estúdio

Áudio sem processamento.
```

```text
Personalizado

Controle manual dos filtros.
```

---

## 31. Perfil recomendado

O perfil normal de voz deve receber indicação discreta:

```text
Recomendado
```

Não usar um banner exagerado.

---

## 32. Teste de microfone

Melhorar visualmente o meter atual.

Pode ser:

```text
Entrada

▁▂▃▅▇████▆▃
```

ou uma barra:

```text
██████████████░░░░░░
```

A lógica existente deve ser preservada.

---

## 33. Estado de teste

Quando ativo:

```text
Testando seu microfone...
```

Botão:

```text
[Parar teste]
```

Quando parado:

```text
[Testar microfone]
```

---

## 34. Limitações do navegador

Mensagens como:

```text
Este navegador não permite escolher a saída de áudio.
```

devem continuar aparecendo.

Apresentar como callout discreto e contextual.

---

# NOTIFICAÇÕES

## 35. Responsabilidade

A aba deve tratar somente notificações e alertas.

Hoje ela também contém:

```text
Apelido neste servidor
```

Essa configuração não pertence semanticamente aqui.

---

## 36. Mover apelido

Mover:

```text
Apelido neste servidor
```

para:

```text
Servidor atual
```

em uma seção:

```text
Seu perfil neste servidor
```

---

## 37. Estado atual de notificações

A funcionalidade real atual inclui principalmente:

```text
Silenciar servidor
```

Portanto a interface deve começar por isso.

---

## 38. Card

```text
Notificações do servidor

Silenciar servidor                        [toggle]

Oculta alertas e contadores deste servidor.
```

---

## 39. Não inventar preferências

Não criar toggles funcionais falsos como:

```text
Mensagens diretas
Menções
Convites
Eventos de voz
Solicitações
```

sem estado/backend correspondentes.

Essas opções podem ser planejadas futuramente.

---

# MEUS SERVIDORES

## 40. Tela

```text
Meus servidores

Gerencie os servidores dos quais você participa.
```

---

## 41. Lista

Transformar a lista existente em cards/rows:

```text
[Servidor] Comunidade Concord
           Proprietário

                              [Gerenciar]
```

Outro exemplo:

```text
[Servidor] Amigos
           Membro

                              [Gerenciar]
```

---

## 42. Cargo

Mostrar badge discreto:

```text
Proprietário
Moderador
Membro
```

---

## 43. Seleção

Preservar:

```ts
onSelectServer(server.id)
```

Quando clicar em Gerenciar:

```text
selecionar servidor
↓
abrir Servidor atual
```

---

# SERVIDOR ATUAL

## 44. Cabeçalho

```text
Comunidade Concord

Configurações do servidor.

Seu cargo: Proprietário
```

---

## 45. Informações principais

Preservar:

```text
Nome
Descrição
```

Somente proprietário pode editar conforme as regras atuais.

---

## 46. Perfil neste servidor

Mover o apelido para cá.

Estrutura:

```text
Seu perfil neste servidor

Apelido
[Pedro]

[Salvar apelido]
```

---

## 47. Links de convite

O Concord já possui:

```text
gerar convite
listar links
contar usos
revogar
```

Redesenhar como:

```text
Links de convite

abc123                         5 usos
                              [Revogar]

xyz789                         2 usos
                              [Revogar]

[Gerar novo link]
```

---

## 48. Link recém-gerado

Mostrar:

```text
Link criado

https://...
[Copiar]
```

Se já existir mecanismo simples de clipboard.

Não criar dependência nova.

---

## 49. Marcar servidor como lido

Manter ação:

```text
Marcar servidor como lido
```

como ação secundária.

Não precisa de destaque equivalente a salvar configurações.

---

# ZONA DE PERIGO

## 50. Área separada

No final de `Servidor atual`:

```text
Zona de perigo
```

---

## 51. Membro ou moderador

Mostrar:

```text
Sair do servidor
```

---

## 52. Proprietário

Mostrar:

```text
Excluir servidor
```

---

## 53. Confirmações

Evitar `window.confirm` como experiência final.

Preferir o componente `Modal` já existente.

Exemplo:

```text
Excluir Comunidade Concord?

Esta ação não pode ser desfeita.

[Cancelar] [Excluir servidor]
```

---

# CANAIS

## 54. Cabeçalho

```text
Canais

Gerencie a estrutura do servidor.

[+ Criar canal]
[+ Criar categoria]
```

---

## 55. Lista

```text
CANAIS DE TEXTO

# geral                           [Editar] [...]
# desenvolvimento                 [Editar] [...]
# ideias                          [Editar] [...]

CANAIS DE VOZ

🔊 Geral                          [Editar] [...]
🔊 Reunião                        [Editar] [...]
```

---

## 56. Criar canal

A lógica atual pode ser mantida.

Campos:

```text
Nome
Tipo
```

Tipo:

```text
[ # Texto ]
[ 🔊 Voz ]
```

---

## 57. Editar canal

Ao selecionar um canal:

```text
Editar canal

Nome
[geral]

Tipo
[Texto]

[Salvar]
[Cancelar]
```

---

## 58. Remover canal

A ação deve ser secundária/destrutiva.

Não colocar:

```text
Editar
Remover
```

com o mesmo peso visual.

Pode usar:

```text
[Editar] [...]
```

com `Remover` no menu.

---

# CATEGORIAS

## 59. Estado atual

Hoje categorias podem ser exibidas de forma muito simples.

A Etapa 16 deve transformar isso em uma lista clara.

---

## 60. Lista

```text
Categorias

Informações
Geral
Jogos
Reuniões
```

---

## 61. Criar categoria

```text
[+ Nova categoria]
```

Ao ativar:

```text
Nome
[Geral]

[Criar categoria]
```

Preservar backend atual.

---

# PERMISSÕES

## 62. Organização

Separar a tela em:

```text
Cargos
Permissões por canal
Moderação
```

---

## 63. Cargos

Mostrar cards informativos:

```text
Proprietário
Controle completo do servidor.
```

```text
Moderador
Pode administrar canais e membros permitidos.
```

```text
Membro
Pode utilizar os canais liberados.
```

---

## 64. Não recriar sistema de cargos

Utilizar exclusivamente os cargos reais existentes:

```ts
owner
moderator
member
```

Não criar cargos customizados nesta etapa.

---

# PERMISSÕES POR CANAL

## 65. Dados atuais

O projeto já trabalha com:

```ts
canRead
canWrite
canSpeak
```

---

## 66. Apresentação

Canal de texto:

```text
# geral

                   Moderador      Membro

Ver canal              ✓             ✓
Enviar mensagens       ✓             ✓
```

---

## 67. Canal de voz

```text
🔊 Geral

                   Moderador      Membro

Ver canal              ✓             ✓
Falar                   ✓             ✓
```

---

## 68. Interface

Pode utilizar:

- tabela;
- cards;
- grid de toggles.

Priorizar legibilidade.

Não criar dezenas de controles sem identificar claramente o canal e o cargo.

---

# MODERAÇÃO

## 69. Área própria

Dentro de Permissões:

```text
Moderação
```

---

## 70. Membro

Exemplo:

```text
[Avatar] Juliane
         @juliane

[Microfone] [Áudio] [Timeout] [...]
```

---

## 71. Banimento

`Banir` deve ficar dentro de:

```text
...
```

ou uma área destrutiva.

Não colocá-lo como botão comum ao lado de controles cotidianos.

---

## 72. Alteração de cargo

Preservar funcionalidade existente.

Mostrar:

```text
Cargo
[Moderador ▼]
```

somente para quem tiver permissão.

---

# FEEDBACK

## 73. Feedback contextual

Hoje várias operações compartilham um `feedback`.

Visualmente, preferir mensagens próximas do local da ação.

Exemplos:

```text
✓ Perfil salvo.
```

```text
✓ Canal criado.
```

```text
✓ Link de convite revogado.
```

Não é obrigatório reestruturar todo o estado se isso ampliar muito a tarefa.

---

## 74. Estado de envio

Durante operação:

```text
Salvando...
Criando...
Revogando...
```

quando apropriado.

Evitar apenas desabilitar tudo sem feedback.

---

# BOTÕES

## 75. Hierarquia

### Primário

```text
Salvar
Criar
Confirmar
```

### Secundário

```text
Cancelar
Gerenciar
Copiar
```

### Destrutivo

```text
Excluir
Sair
Revogar
Banir
```

---

## 76. Texto dos botões

Reduzir uppercase excessivo.

Em vez de:

```text
SALVAR PERFIL
CRIAR CANAL
GERENCIAR
```

preferir:

```text
Salvar perfil
Criar canal
Gerenciar
```

---

# FORMULÁRIOS

## 77. Estrutura dos campos

Padronizar:

```text
Label

[input]

Texto de ajuda
```

Exemplo:

```text
Nome de usuário

[pedrovictorpina]

Usado para identificar você no Concord.
```

---

## 78. Cards

Agrupar controles relacionados dentro de cards.

Não colocar borda visual forte em cada elemento individual.

---

## 79. Espaçamento

Cada seção deve possuir hierarquia clara entre:

```text
título
descrição
controle
ajuda
feedback
```

---

# RESPONSIVIDADE

## 80. Desktop amplo

```text
navigation
+
content
+
context
```

---

## 81. Laptop

```text
navigation
+
content
```

O painel direito desaparece.

---

## 82. Mobile

No mobile não utilizar sidebar fixa estreita.

Criar uma tela de índice.

```text
┌────────────────────────────┐
│ ← Configurações            │
├────────────────────────────┤
│ Buscar configurações...    │
│                            │
│ Minha conta            >   │
│ Aparência              >   │
│ Voz e áudio            >   │
│ Notificações           >   │
│                            │
│ Meus servidores        >   │
│ Servidor atual         >   │
│ Canais                 >   │
│ Permissões             >   │
│                            │
│ Sair da conta              │
└────────────────────────────┘
```

---

## 83. Mobile — subpágina

Exemplo Voz e áudio:

```text
┌────────────────────────────┐
│ ← Voz e áudio              │
├────────────────────────────┤
│                            │
│ Microfone                  │
│ [Padrão do sistema      ▼] │
│                            │
│ Alto-falante               │
│ [Padrão do sistema      ▼] │
│                            │
│ Volume                     │
│ ━━━━━━━●━━━━               │
│                            │
│ Processamento              │
│ ...                        │
└────────────────────────────┘
```

---

## 84. Navegação mobile

Fluxo:

```text
Configurações
↓
seleciona categoria
↓
subpágina
↓
voltar
```

Não utilizar oito tabs horizontais.

---

# BUSCA DE CONFIGURAÇÕES

## 85. Recurso opcional

A referência possui busca.

Pode ser implementada localmente se for simples.

Mapear termos conhecidos:

```text
microfone
→ Voz e áudio

tema
→ Aparência

canal
→ Canais

servidor
→ Meus servidores / Servidor atual

permissão
→ Permissões
```

Não criar busca complexa ou backend para isso.

---

# CONSISTÊNCIA COM AS OUTRAS ETAPAS

## 86. Design system comum

As Etapas:

```text
12 — Mensagens Diretas
13 — Home/Amigos
14 — Chat do Servidor
15 — Canal de Voz
16 — Configurações
```

devem parecer partes do mesmo produto.

Compartilhar:

```text
headers
inputs
buttons
cards
radius
spacing
tipografia
ícones
hover
feedback
cores
```

---

# COMPONENTIZAÇÃO

## 87. Problema do SettingsDialog

`SettingsDialog.tsx` já concentra uma grande quantidade de responsabilidades.

A Etapa 16 é uma boa oportunidade para componentizar.

---

## 88. Estrutura sugerida

```text
apps/web/src/features/workspace/settings/

SettingsDialog.tsx
SettingsNavigation.tsx

AccountSettings.tsx
AppearanceSettings.tsx
NotificationSettings.tsx

ServerListSettings.tsx
ServerSettings.tsx
ChannelSettings.tsx
PermissionSettings.tsx
```

`VoiceSettings.tsx` já existe e deve continuar separado.

---

## 89. Responsabilidade final do SettingsDialog

Idealmente:

```text
SettingsDialog
├── layout
├── navegação
├── aba ativa
└── fechamento
```

Ele não deve continuar contendo toda a implementação de todos os formulários.

---

## 90. Não fragmentar demais

Não criar arquivos triviais como:

```text
SettingsTitle.tsx
SettingsParagraph.tsx
SettingsInput.tsx
```

apenas para aumentar componentização.

Extrair áreas com responsabilidade real.

---

# VOICE SETTINGS

## 91. Preservar

Manter:

```text
VoiceSettings.tsx
```

como componente próprio.

Apenas adaptar o visual ao novo sistema.

---

# THEME CONTROLS

## 92. Preservar

Manter:

```text
ThemeControls.tsx
```

como responsável por:

```text
styleTheme
colorMode
resolvedColorMode
```

Não duplicar essa lógica.

---

# FUNCIONALIDADES FORA DO ESCOPO

## 93. Não implementar nesta etapa

```text
email
senha
2FA
sessões
dispositivos conectados
idioma
Premium
faturamento
aplicativos autorizados
privacidade avançada
NSFW
atalhos de teclado
acessibilidade avançada
status customizado
```

Esses itens aparecem na referência apenas para demonstrar a organização visual de uma central de configurações madura.

---

# SEGURANÇA DE AÇÕES

## 94. Confirmações destrutivas

Usar confirmação para:

```text
Excluir servidor
Banir membro
Remover canal, quando apropriado
```

Preferir `Modal` interno em vez de `window.confirm`.

---

## 95. Não perder alterações

Se futuramente existirem formulários com alterações locais complexas, poderá ser implementado aviso de alterações não salvas.

Não é obrigatório nesta etapa.

---

# ACESSIBILIDADE

## 96. Requisitos

Garantir:

- navegação por teclado;
- foco visível;
- labels reais;
- estados ativos claros;
- toggles acessíveis;
- botões de ícone com `aria-label`;
- contraste adequado;
- estados `disabled` claros;
- feedback através de `role="status"` quando apropriado;
- navegação mobile acessível.

---

# ARQUIVOS PRINCIPAIS

## 97. Alterar

```text
apps/web/src/features/workspace/SettingsDialog.tsx
apps/web/src/features/workspace/VoiceSettings.tsx
apps/web/src/features/workspace/WorkspaceShell.css

apps/web/src/components/theme/ThemeControls.tsx
apps/web/src/components/theme/ThemeControls.css
```

---

## 98. Possivelmente criar

```text
apps/web/src/features/workspace/settings/
├── SettingsNavigation.tsx
├── AccountSettings.tsx
├── AppearanceSettings.tsx
├── NotificationSettings.tsx
├── ServerListSettings.tsx
├── ServerSettings.tsx
├── ChannelSettings.tsx
└── PermissionSettings.tsx
```

Criar apenas os componentes que reduzirem de fato a complexidade.

---

# CRITÉRIOS DE ACEITE

## 99. Geral

A Etapa 16 só deve ser considerada concluída quando:

1. A navegação estiver organizada por categorias.
2. A aba atual for facilmente identificável.
3. O conteúdo possuir hierarquia clara.
4. O modal utilizar bem o espaço disponível.
5. O painel contextual funcionar sem ser obrigatório.
6. Nenhuma funcionalidade fictícia tiver sido criada.
7. Configurações existentes continuarem funcionando.
8. Desktop e mobile estiverem adequados.
9. Dark e light mode estiverem funcionando.
10. O visual estiver coerente com as Etapas 12–15.

---

## 100. Minha conta

Preservar:

```text
nickname
username
avatar
logout
```

---

## 101. Aparência

Preservar:

```text
tema
sistema
claro
escuro
```

---

## 102. Voz

Preservar:

```text
microfone
saída
volume
perfil
supressão
cancelamento de eco
ganho automático
teste de microfone
```

Integrar posteriormente:

```text
WebRTC
+
RNNoise
```

conforme documentação própria.

---

## 103. Servidores

Preservar:

```text
selecionar servidor
cargo
gerenciar
```

---

## 104. Servidor atual

Preservar conforme permissão:

```text
nome
descrição
apelido no servidor
convites
links
revogar links
marcar como lido
sair
excluir
```

---

## 105. Canais

Preservar:

```text
criar
editar
remover
tipo
categorias
```

---

## 106. Permissões

Preservar:

```text
roles
channel permissions
moderation
```

---

# TESTES

## 107. Fluxos obrigatórios

Testar:

```text
editar nickname
editar username
trocar avatar
logout
```

```text
trocar tema
trocar modo claro/escuro/sistema
```

```text
trocar microfone
trocar saída
alterar volume
alterar perfil
testar microfone
```

```text
selecionar servidor
editar servidor
salvar apelido
gerar convite
revogar convite
marcar servidor como lido
```

```text
criar canal
editar canal
remover canal
criar categoria
```

```text
alterar permissões
alterar cargos
moderar membro
```

```text
silenciar servidor
sair do servidor
excluir servidor
```

conforme o cargo/permissão da conta utilizada nos testes.

---

# RESPONSIVIDADE A VALIDAR

## 108. Viewports

```text
1920×1080
1440×900
1366×768
1024×768
390px mobile
```

Sem overflow horizontal.

---

# TEMAS A VALIDAR

## 109. Modos

```text
dark
light
system
```

e todos os style themes disponíveis no projeto.

Não usar cores fixas que funcionem apenas no Concord Dark.

---

# ORDEM RECOMENDADA PARA O CODEX

## 110. Implementação

```text
ETAPA 1

Ler:

SettingsDialog.tsx
VoiceSettings.tsx
ThemeControls.tsx
WorkspaceShell.css
CSS de ThemeControls

↓

ETAPA 2

Mapear todas as funcionalidades reais atuais.

Não adicionar funcionalidades
apenas porque aparecem no mockup.

↓

ETAPA 3

Criar layout amplo da central
de configurações.

↓

ETAPA 4

Criar navegação agrupada.

↓

ETAPA 5

Extrair componentes grandes
quando isso reduzir complexidade.

↓

ETAPA 6

Redesenhar Minha conta.

↓

ETAPA 7

Mover ação de logout
para área própria.

↓

ETAPA 8

Redesenhar Aparência.

↓

ETAPA 9

Redesenhar Voz e áudio.

↓

ETAPA 10

Garantir compatibilidade
com a etapa WebRTC + RNNoise.

↓

ETAPA 11

Redesenhar Notificações.

↓

ETAPA 12

Mover apelido do servidor
para Servidor atual.

↓

ETAPA 13

Redesenhar Meus servidores.

↓

ETAPA 14

Redesenhar Servidor atual.

↓

ETAPA 15

Redesenhar links de convite.

↓

ETAPA 16

Criar Zona de perigo.

↓

ETAPA 17

Substituir confirmações nativas
por Modal quando apropriado.

↓

ETAPA 18

Redesenhar Canais.

↓

ETAPA 19

Redesenhar Categorias.

↓

ETAPA 20

Redesenhar Permissões.

↓

ETAPA 21

Redesenhar Moderação.

↓

ETAPA 22

Adicionar painel contextual
para desktop amplo.

↓

ETAPA 23

Responsividade desktop.

↓

ETAPA 24

Mobile.

↓

ETAPA 25

Validar temas.

↓

ETAPA 26

Executar testes direcionados.

↓

ETAPA 27

Executar validação final.

↓

ETAPA 28

Comparar visualmente
com o mockup aprovado.
```

---

# COMPARAÇÃO VISUAL

## 111. Após implementação

Comparar com a referência aprovada considerando:

```text
largura da navegação
largura do conteúdo
painel contextual
hierarquia dos títulos
espaçamento
altura dos inputs
cards
botões
densidade
feedback
organização das categorias
experiência mobile
```

Não modificar o design system apenas para reproduzir exatamente as cores do mockup.

---

# RESULTADO ESPERADO

## 112. Antes

```text
modal grande
+
lista simples de tabs
+
muitos formulários no mesmo componente
+
hierarquia limitada
```

---

## 113. Depois

```text
central de configurações
+
navegação clara
+
categorias organizadas
+
componentes especializados
+
ações seguras
+
feedback contextual
+
desktop bem aproveitado
+
mobile adequado
```

---

# 114. Princípio final

A Etapa 16 deve principalmente:

```text
ORGANIZAR
+
REFINAR
+
COMPONENTIZAR
```

e não:

```text
INVENTAR
```

O Concord já possui grande parte da lógica necessária.

O redesign deve tornar essa lógica muito mais fácil de encontrar, compreender e utilizar.

Recursos mostrados na referência que ainda não existem devem permanecer como possibilidades futuras e só devem ser implementados mediante uma etapa própria de arquitetura e backend.

---

# 115. Instrução final para o Codex

Ao implementar esta documentação:

1. leia primeiro o estado atual de `SettingsDialog`, `VoiceSettings` e `ThemeControls`;
2. use o mockup aprovado da Etapa 16 como referência de layout e hierarquia;
3. preserve todas as configurações funcionais existentes;
4. não implemente funcionalidades fictícias presentes apenas na imagem;
5. não altere contratos ou backend sem necessidade real;
6. prefira refatoração incremental;
7. componentize `SettingsDialog` somente onde houver responsabilidade clara;
8. preserve o sistema atual de temas;
9. preserve a arquitetura de voz existente;
10. mantenha compatibilidade com a futura implementação WebRTC + RNNoise;
11. substitua confirmações nativas por componentes do Concord quando apropriado;
12. valide desktop, laptop e mobile;
13. valide light e dark mode;
14. execute os testes existentes ao final;
15. compare visualmente o resultado com a referência aprovada.

O resultado final deve parecer uma central de configurações madura do Concord, e não apenas um grande formulário dentro de um modal.
