# @concord/web

Cliente web React/TypeScript do Concord.

## Comandos

Execute a partir da raiz do monorepo:

```powershell
pnpm dev
pnpm check
pnpm lint
pnpm test:e2e
```

Copie `.env.example` para `.env.local` quando o projeto Supabase estiver disponivel. Nunca versione chaves de ambiente.

A captura de tela usa a API nativa do navegador e funciona apenas em contexto seguro (`https` ou `localhost`). O envio para outros participantes sera conectado ao LiveKit Cloud na Etapa 03.
