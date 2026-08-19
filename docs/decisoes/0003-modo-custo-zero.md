# ADR 0003 - Modo custo zero

- Estado: aceita
- Data da verificacao: 2026-08-17

## Contexto

O desenvolvimento e o primeiro piloto do Concord devem operar com custo mensal zero. Voz e compartilhamento de tela consomem minutos e transferencia de dados, portanto o produto precisa limitar uso deliberadamente em vez de depender apenas da boa vontade dos usuarios.

## Decisao

Usar somente planos gratuitos, sem habilitar excedentes pagos. Quando uma franquia acabar, novas operacoes podem falhar ate a renovacao mensal. A interface devera explicar o limite sem perder mensagens ou dados.

## Franquias verificadas

Os valores abaixo vieram das paginas oficiais e podem mudar:

- Supabase Free: 500 MB de banco, 1 GB de arquivos, 5 GB de egress, 50 mil usuarios ativos mensais, 200 conexoes Realtime de pico, 2 milhoes de mensagens Realtime e 500 mil Edge Functions por mes. Projetos gratuitos pausam apos uma semana sem atividade.
- LiveKit Cloud Build: 5 mil minutos de participantes WebRTC, 50 GB de transferencia downstream e ate 100 participantes simultaneos. A franquia e um limite rigido: ao terminar, novas operacoes falham sem gerar excedente.
- Cloudflare Pages Free: ate 500 builds mensais, um build simultaneo e 20 mil arquivos por site.
- GitHub Free: 2 mil minutos mensais de Actions e 500 MB de armazenamento para uso medido em repositorios privados.

Fontes:

- https://supabase.com/pricing
- https://docs.livekit.io/deploy/admin/quotas-and-limits/
- https://developers.cloudflare.com/pages/platform/limits/
- https://docs.github.com/en/billing/reference/product-usage-included

## Limites do piloto

- 8 participantes por canal de voz;
- varias telas simultaneas por canal, uma por participante (revisado em 2026-08-19; antes era
  1 tela por canal). O teto pratico continua sendo o de 8 participantes, e o egress cresce com
  o numero de telas assistidas ao mesmo tempo;
- 720p a 15 FPS como padrao;
- sem camera, gravacao ou retransmissao;
- desligar conexoes abandonadas;
- anexos pequenos e cota por usuario;
- projeto privado no GitHub, evitando workflows desnecessarios;
- medidores visiveis antes de convidar usuarios externos.

## Consequencias

- o piloto pode ficar temporariamente sem voz/tela quando a franquia acabar;
- Supabase pode pausar depois de inatividade;
- o projeto Concord pode usar uma organizacao Supabase separada quando a conta principal atingir o limite gratuito de projetos;
- 1080p e grupos maiores ficam adiados;
- os limites precisam ser aplicados no backend, nao apenas escondidos na interface;
- nenhuma promessa de custo zero sera feita para uma operacao publica em escala.
