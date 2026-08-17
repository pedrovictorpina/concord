# ADR 0006 - Hospedagem web na Vercel

- Estado: aceita
- Data: 2026-08-17

## Contexto

O Concord precisa publicar o cliente React/Vite sem manter servidores proprios, com HTTPS, CDN, previews por pull request e integracao simples com o repositorio GitHub. O inicio deve permanecer dentro de um modo de custo zero para desenvolvimento e piloto pessoal.

## Decisao

Usar a Vercel para hospedar somente o cliente web. O Supabase continua responsavel por autenticacao, banco e eventos em tempo real, enquanto voz e compartilhamento de tela permanecem destinados ao LiveKit Cloud.

O projeto Vercel se chama `concord-web` e usa:

- repositorio `pedrovictorpina/concord`;
- branch de producao `main`;
- framework Vite;
- Root Directory `apps/web`;
- Build Command `pnpm build`;
- Output Directory `dist`;
- acesso a arquivos fora do Root Directory para consumir `packages/contracts`;
- variaveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` nos ambientes Production e Preview.

O dominio inicial de producao e `https://concord-web-pi.vercel.app`. Branches e pull requests usam Preview Deployments antes do merge.

## Validacao inicial

- a primeira importacao apontou incorretamente para `packages/contracts` e publicou uma resposta `404`;
- a configuracao foi corrigida para `apps/web`, Vite, `pnpm build` e `dist`;
- o redeploy da `main` ficou Ready em 11 segundos;
- o dominio de producao respondeu HTTP 200 e carregou o cliente da Etapa 00.

## Consequencias

- pushes na `main` atualizam producao automaticamente;
- pushes em outras branches geram ambientes de Preview;
- URLs usadas pela recuperacao de senha precisam constar na lista permitida do Supabase;
- o plano Hobby serve ao desenvolvimento pessoal nao comercial; uso comercial exigira revisar o plano ou o provedor;
- aplicativos Electron e React Native nao sao hospedados na Vercel e apenas consomem os mesmos servicos gerenciados.
