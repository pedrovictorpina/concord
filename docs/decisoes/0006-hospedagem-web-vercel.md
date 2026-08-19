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

## Validacao do Preview da Etapa 01

- a branch `codex/etapa-01-identidade-temas` gerou um Preview Ready;
- o alias estavel `https://concord-web-git-codex-etapa-01-128aa4-pedrovictorpinas-projects.vercel.app` carregou a Etapa 01 com as variaveis do Supabase;
- o alias foi permitido no Supabase com `/**` para aceitar o retorno da recuperacao;
- cadastro, sessao, entrega do e-mail, troca real de senha e novo login foram aprovados no ambiente publico;
- a conta e o perfil temporarios usados no teste foram removidos ao final.

## Publicacao da Etapa 01

- o PR #1 foi integrado na `main` pelo merge commit `3df79ff`;
- o deploy de producao `dpl_Hue2goUXh6yAq6h7cwBJKX3foTyp` ficou Ready e publicou o Concord Alpha 01;
- o dominio principal respondeu HTTP 200 e as jornadas de tema, demonstracao e mensagem local foram aprovadas;
- o Site URL do Supabase passou a usar `https://concord-web-pi.vercel.app`;
- `https://concord-web-pi.vercel.app/**` foi adicionado aos redirecionamentos permitidos;
- a verificacao de runtime da Vercel nao encontrou erros depois da publicacao.

## Autor do commit e deploys bloqueados

No plano Hobby a Vercel so constroi commits cujo autor Git pertence a conta dona do projeto. Um
commit de outra identidade aparece no GitHub como check `Vercel: failure` com a descricao
`Deployment was blocked`, com build de 0 ms e sem log — nao e erro de codigo, e o deploy nem
comeca. O erro do `vercel redeploy` nesse caso e `This deployment can not be redeployed. Please
try again from a fresh commit.`

Aconteceu na integracao do PR #5: o merge feito pelo `gh` autenticado como `syg-pedro` gerou o
merge commit `c8b064d` com autor `pedro.v@sygecom.com.br`, e a producao ficou parada na versao
anterior. A saida foi um commit novo na `main` com a identidade `pedrovictorpina`.

Ao integrar PRs, confira `git log -1 --format='%an <%ae>'` antes: os commits que chegam na `main`
precisam ser da identidade dona da conta Vercel.

## Consequencias

- pushes na `main` atualizam producao automaticamente;
- pushes em outras branches geram ambientes de Preview;
- URLs usadas pela recuperacao de senha precisam constar na lista permitida do Supabase;
- o plano Hobby serve ao desenvolvimento pessoal nao comercial; uso comercial exigira revisar o plano ou o provedor;
- aplicativos Electron e React Native nao sao hospedados na Vercel e apenas consomem os mesmos servicos gerenciados.
