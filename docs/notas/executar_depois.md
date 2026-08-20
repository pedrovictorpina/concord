Etapa 11 — Supressão de ruído

Arquivo:

docs/etapas/11-supressao-ruido-rnnoise.md

Para executar depois:

Leia integralmente `docs/etapas/11-supressao-ruido-rnnoise.md` antes de alterar qualquer código.


Analise rapidamente o estado atual da implementação de voz do Concord e confirme se as premissas da documentação ainda correspondem ao código atual.


Depois implemente a etapa seguindo o documento como especificação técnica.


Objetivos principais:
- manter WebRTC como supressão padrão;
- adicionar RNNoise como modo de supressão aprimorada;
- manter todo o processamento no cliente;
- não utilizar Krisp ou qualquer serviço pago;
- não processar áudio no backend;
- evitar dupla supressão WebRTC + RNNoise;
- preservar cancelamento de eco;
- integrar corretamente com LiveKit;
- garantir fallback automático para WebRTC se RNNoise falhar;
- preservar troca de microfone e demais configurações de voz;
- garantir que o teste de microfone utilize o mesmo processamento da chamada.


Implemente de forma incremental seguindo a ordem descrita no documento.


Não faça refatorações fora do escopo.


Execute primeiro testes e validações relacionados à voz e somente depois uma validação mais ampla do projeto.


Ao final informe:
1. o que foi implementado;
2. arquivos alterados;
3. testes executados;
4. qualquer divergência necessária em relação à documentação;
5. pendências reais, se existirem.


Não faça commit nem push.
Etapa 12 — Mensagens diretas

Arquivos:

docs/etapas/12-redesign-mensagens-diretas.md
docs/etapas/imagens/12-redesign-mensagens-diretas.png

Para executar depois:

Leia integralmente `docs/etapas/12-redesign-mensagens-diretas.md`.


Use também `docs/etapas/imagens/12-redesign-mensagens-diretas.png` como referência visual obrigatória.


Antes de alterar código, confira rapidamente o estado atual de:
- DirectMessagePanel;
- HomeSidebar;
- estilos relacionados;
- fluxo atual de envio e recebimento de mensagens.


Implemente o redesign seguindo o documento.


A imagem deve orientar:
- composição;
- hierarquia;
- espaçamento;
- proporções;
- organização das mensagens;
- cabeçalho;
- composer;
- densidade visual.


NÃO copie literalmente as cores da imagem. Utilize o design system e os tokens de tema do Concord.


Preserve todas as funcionalidades existentes.


Priorize:
- cabeçalho da conversa;
- melhor apresentação do usuário;
- presença/status quando disponível;
- agrupamento visual de mensagens;
- separadores reais de data;
- melhor hierarquia entre mensagens próprias e recebidas;
- novo composer;
- textarea com crescimento limitado;
- Enter para enviar;
- Shift+Enter para nova linha;
- estados vazio, loading e erro;
- comportamento correto de scroll;
- desktop e mobile.


Não implemente nesta etapa funcionalidades futuras sem backend real, como:
- reactions;
- attachments;
- GIFs;
- read receipts;
- chamadas privadas;
- threads;
- edição ou exclusão de mensagens, salvo se já estiverem realmente suportadas.


Não faça refatorações fora do escopo.


Ao terminar:
1. execute testes relacionados;
2. valide desktop e mobile;
3. valide tema claro e escuro;
4. compare visualmente o resultado com a imagem;
5. informe arquivos alterados e eventuais divergências.


Não faça commit nem push.
Etapa 13 — Home / Amigos

Arquivos:

docs/etapas/13-redesign-home-amigos.md
docs/etapas/imagens/13-redesign-home-amigos.png

Para executar depois:

Leia integralmente `docs/etapas/13-redesign-home-amigos.md`.


Use `docs/etapas/imagens/13-redesign-home-amigos.png` como referência visual obrigatória.


Antes de implementar, confira rapidamente o estado atual de:
- FriendsHome;
- HomeSidebar;
- presença de amigos;
- solicitações;
- convites;
- estilos relacionados.


Implemente o redesign seguindo a documentação.


A imagem deve orientar layout, hierarquia, densidade e composição, mas as cores devem continuar utilizando o design system do Concord.


Preserve todas as funcionalidades reais existentes:
- listar amigos;
- buscar;
- presença;
- abrir mensagem direta;
- adicionar amigo;
- aceitar solicitação;
- aceitar convite;
- mostrar atividade em voz quando já disponível.


Priorize:
- nova organização da Home;
- filtros claros por presença;
- contadores;
- ordenação por status;
- linhas de amigos mais informativas;
- seleção de amigo;
- painel contextual direito;
- Ativo agora;
- solicitações mais visíveis;
- convites;
- formulário de adicionar amigo;
- responsividade;
- experiência mobile.


Não invente:
- sugestões de amizade;
- amigos em comum;
- atividade de jogos;
- chamadas privadas;
- dados sociais inexistentes.


Se esses elementos aparecerem na imagem, trate-os apenas como inspiração de layout.


Mantenha consistência visual com a Etapa 12.


Depois:
1. execute testes relacionados;
2. valide desktop e mobile;
3. valide temas;
4. compare o resultado com a imagem de referência;
5. reporte mudanças e pendências.


Não faça commit nem push.
Etapa 14 — Servidor e canais

Arquivos:

docs/etapas/14-redesign-servidor-canais.md
docs/etapas/imagens/14-redesign-servidor-canais.png

Para executar depois:

Leia integralmente `docs/etapas/14-redesign-servidor-canais.md`.


Use `docs/etapas/imagens/14-redesign-servidor-canais.png` como referência visual obrigatória.


Antes de alterar código, confira o estado atual dos componentes responsáveis por:
- ServerRail;
- ChannelPanel;
- cabeçalho do servidor;
- categorias;
- canais de texto;
- canais de voz;
- participantes mostrados na sidebar;
- usuário atual no rodapé;
- menus administrativos.


Implemente o redesign seguindo o documento.


A imagem deve orientar principalmente:
- largura e proporção da navegação;
- hierarquia do servidor;
- organização de categorias;
- destaque do canal ativo;
- estados de não lido;
- canais de voz;
- participantes conectados;
- organização do rodapé.


Utilize sempre os tokens e temas existentes do Concord.


Preserve:
- troca de servidor;
- troca de canal;
- criação de canais;
- canais de texto e voz;
- não lidas;
- menções;
- participantes em voz;
- permissões;
- menus;
- convites;
- ações administrativas;
- rodapé do usuário.


Remova ou reduza elementos de navegação puramente futuros que estejam poluindo a interface e ainda não possuam funcionalidade real.


Não implemente funcionalidades falsas apenas para reproduzir o mockup.


Mantenha consistência com as Etapas 12 e 13.


Depois da implementação:
1. valide vários servidores;
2. valide servidor com muitos canais;
3. valide canais de voz com participantes;
4. valide desktop e mobile;
5. valide temas;
6. compare visualmente com a referência.


Não faça commit nem push.
Etapa 15 — Chat do servidor

Arquivos:

docs/etapas/15-redesign-chat-servidor.md
docs/etapas/imagens/15-redesign-chat-servidor.png

Para executar depois:

Leia integralmente `docs/etapas/15-redesign-chat-servidor.md`.


Use `docs/etapas/imagens/15-redesign-chat-servidor.png` como referência visual obrigatória.


Antes de alterar código, confira rapidamente o estado atual de:
- ChatPanel;
- MemberPanel;
- composer;
- busca de mensagens;
- lista de mensagens;
- lista de membros;
- integração com WorkspaceShell;
- CSS relacionado.


Implemente o redesign seguindo a documentação como especificação principal.


A imagem deve orientar:
- cabeçalho do canal;
- estrutura central do chat;
- hierarquia das mensagens;
- composer;
- painel de membros;
- densidade;
- espaçamento;
- proporções.


Não copie cores fixas da imagem. Utilize o design system do Concord.


Preserve toda funcionalidade existente:
- carregar mensagens;
- enviar mensagem;
- Realtime;
- busca;
- links;
- mensagens editadas;
- painel de membros;
- busca de membros;
- cargos;
- moderação;
- mostrar/ocultar membros.


Priorize:
- cabeçalho do canal mais limpo;
- agrupamento visual de mensagens consecutivas;
- separadores reais de data;
- estado inicial do canal mais adequado ao produto final;
- melhor apresentação de links;
- textarea no composer;
- Enter para enviar;
- Shift+Enter para nova linha;
- scroll correto;
- melhor apresentação de membros e cargos;
- responsividade.


Não implemente apenas porque aparece no mockup:
- reactions;
- threads;
- replies;
- anexos;
- GIFs;
- presentes;
- eventos de servidor;
- rich embeds;
- funcionalidades de pins que ainda não tenham backend real.


A interface pode permanecer preparada para essas evoluções, mas não deve fingir suporte.


Mantenha consistência visual com as Etapas 12, 13 e 14.


Ao final:
1. execute testes relacionados ao chat;
2. valide servidor com muitas mensagens;
3. valide lista grande de membros;
4. valide desktop/mobile;
5. valide dark/light;
6. compare com a imagem de referência.


Não faça commit nem push.
Etapa 16 — Configurações

Arquivos:

docs/etapas/16-redesign-configuracoes.md
docs/etapas/imagens/16-redesign-configuracoes.png

Para executar depois:

Leia integralmente `docs/etapas/16-redesign-configuracoes.md`.


Use `docs/etapas/imagens/16-redesign-configuracoes.png` como referência visual obrigatória.


Antes de modificar código, analise somente o necessário em:
- SettingsDialog;
- VoiceSettings;
- ThemeControls;
- Modal;
- estilos relacionados;
- callbacks e funcionalidades atualmente disponíveis.


Implemente o redesign seguindo o documento.


O objetivo é transformar SettingsDialog em uma central de configurações moderna e organizada, sem perder funcionalidades existentes.


Priorize:
- navegação agrupada;
- layout amplo;
- melhor hierarquia;
- Minha conta;
- Aparência;
- Voz e áudio;
- Notificações;
- Meus servidores;
- Servidor atual;
- Canais;
- Categorias;
- Permissões;
- Moderação;
- ações destrutivas;
- responsividade;
- mobile.


Componentize SettingsDialog quando houver responsabilidades claras e isso realmente reduzir sua complexidade.


Preserve:
- nickname;
- username;
- avatar;
- logout;
- temas;
- microfone;
- saída de áudio;
- volume;
- processamento de voz;
- teste de microfone;
- gerenciamento de servidores;
- convites;
- canais;
- categorias;
- cargos;
- permissões;
- moderação;
- mute do servidor;
- sair/excluir servidor.


A área de voz deve continuar compatível com a documentação de WebRTC + RNNoise.


NÃO implemente recursos mostrados apenas como inspiração na referência, como:
- email;
- senha;
- 2FA;
- sessões ativas;
- Premium;
- faturamento;
- idioma;
- aplicativos autorizados;
- privacidade avançada;
- NSFW;
- status customizado;
- acessibilidade avançada.


Não altere contratos ou backend para criar esses recursos.


Quando apropriado, substitua `window.confirm` por componentes Modal do próprio Concord.


Mantenha ThemeControls e VoiceSettings como componentes especializados em vez de duplicar suas lógicas.


Depois:
1. teste cada aba;
2. teste ações de proprietário, moderador e membro;
3. valide desktop, laptop e mobile;
4. valide temas claro/escuro/sistema;
5. compare visualmente com o mockup;
6. reporte arquivos alterados, testes e divergências.


Não faça commit nem push.
Prompt para executar todas em sequência

Eu não recomendo fazer tudo em uma única sessão do Codex, principalmente pelo seu limite. Mas pode anotar este também:

Existem várias especificações de implementação em `docs/etapas`.


Não implemente todas de uma vez.


Leia primeiro a documentação da etapa que eu indicar e implemente somente essa etapa.


As etapas atualmente preparadas são:


11 — docs/etapas/11-supressao-ruido-rnnoise.md
12 — docs/etapas/12-redesign-mensagens-diretas.md
13 — docs/etapas/13-redesign-home-amigos.md
14 — docs/etapas/14-redesign-servidor-canais.md
15 — docs/etapas/15-redesign-chat-servidor.md
16 — docs/etapas/16-redesign-configuracoes.md


As imagens correspondentes ficam em:


docs/etapas/imagens/


Quando uma etapa possuir imagem:
- leia primeiro o Markdown;
- use a imagem como referência visual;
- considere o Markdown como especificação funcional e arquitetural;
- considere a imagem como referência de layout, hierarquia e composição;
- não copie cores literalmente;
- use o design system do Concord;
- não implemente funcionalidades fictícias presentes apenas nos mockups.


Implemente uma etapa por vez.


Antes de começar uma nova etapa:
1. finalize a anterior;
2. execute os testes relacionados;
3. verifique git diff;
4. reporte o resultado;
5. aguarde minha autorização para continuar.


Não faça commit nem push.
Eu executaria nesta ordem
11 → Supressão de ruído
12 → Mensagens diretas
13 → Home/Amigos
14 → Servidor/Canais
15 → Chat do servidor
16 → Configurações
