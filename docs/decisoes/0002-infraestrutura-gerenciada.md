# ADR 0002 - Sem servidores proprios

- Estado: aceita
- Data: 2026-08-17

## Contexto

O Concord nao tera equipe ou maquinas dedicadas para operar banco, WebSockets, armazenamento e servidores de midia. Ainda assim, autenticacao, persistencia, eventos em tempo real e um SFU sao necessarios para o produto funcionar com seguranca.

## Decisao

Usar Supabase Hosted para Auth, Postgres, Realtime, Storage e Edge Functions; LiveKit Cloud para voz e compartilhamento de tela; hospedagem estatica/CDN para o cliente web; GitHub para codigo e artefatos.

Uma Edge Function autenticada emitira tokens LiveKit curtos depois de verificar a participacao e as permissoes do usuario no canal. Chaves administrativas permanecerao somente nos cofres de segredos dos provedores.

## Motivos

- nenhuma maquina propria para atualizar, monitorar ou escalar;
- inicio mais rapido e custo proporcional ao uso;
- SFU global gerenciado para midia sensivel a latencia;
- banco Postgres e migrations reduzem o custo de uma migracao futura;
- cada componente pode ser substituido sem reescrever toda a aplicacao.

## Consequencias

- o produto ainda possui custos de infraestrutura, apenas terceirizados;
- planos gratuitos servem para desenvolvimento, nao garantem operacao em escala;
- indisponibilidade ou mudanca de preco dos provedores afeta o produto;
- limites de uso e alertas de custo sao requisitos antes do beta;
- nao usar P2P entre usuarios, pois expoe IPs e piora NAT, seguranca e grupos maiores;
- manter adaptadores e migrations no repositorio para reduzir dependencia dos provedores.
