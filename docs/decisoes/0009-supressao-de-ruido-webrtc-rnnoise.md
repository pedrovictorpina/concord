# ADR 0009 - Supressao de ruido: WebRTC padrao + RNNoise aprimorada

## Status

Aceita em 2026-08-20.

## Contexto

A supressao de ruido do Concord dependia inteiramente das capacidades nativas do navegador
(`noiseSuppression`, `voiceIsolation`), guardadas como `suppressionLevel: 'off' | 'standard' | 'high'`
mais um `voiceIsolation: boolean` solto em `concord.voice.v1`. Isso permitia estados logicamente
invalidos (ex.: `high` sem `voiceIsolation`) e nao dava ao Concord nenhum controle proprio sobre o
algoritmo de supressao — a qualidade dependia só do navegador/SO/dispositivo.

O modo custo zero (ADR 0003) exclui qualquer solucao paga ou com processamento server-side
(Krisp, DeepFilterNet, cobranca por minuto).

## Decisao

Adotar dois mecanismos de supressao, selecionaveis por `NoiseSuppressionMode: 'off' | 'webrtc' | 'rnnoise'`:

- **`webrtc`** (padrao): `noiseSuppression`/`voiceIsolation` nativos do navegador, como antes.
- **`rnnoise`** (Aprimorada, Beta): [`@sapphi-red/web-noise-suppressor`](https://github.com/sapphi-red/web-noise-suppressor)
  (MIT, RNNoise via WASM) rodando inteiramente no cliente. Nunca ativa `noiseSuppression`/`voiceIsolation`
  nativos ao mesmo tempo, para evitar dupla supressao (voz metalica, cortes, pumping).
- **`off`**: sem nenhuma supressao. So persiste entre sessoes no perfil Estudio; em qualquer outro
  perfil, volta para `webrtc` na proxima leitura (comportamento ja existente antes desta etapa,
  preservado para nao deixar a supressao esquecida desligada).

Preferencias migraram de `concord.voice.v1` para `concord.voice.v2`
(`apps/web/src/features/workspace/voice-preferences.ts`), com leitura de compatibilidade:
`v1 off → v2 off`, `v1 standard`/`high` → `v2 webrtc`. Nunca migra automaticamente para `rnnoise` —
e um modo mais pesado que o usuario precisa escolher.

RNNoise e carregado sob demanda (`import()` dinamico) só quando o usuario escolhe o modo Aprimorada;
o build confirma o WASM e o worklet em chunks separados do bundle principal. O grafo de audio
(`fonte → RNNoise → destino`) vive em `audio/rnnoise-graph.ts` e e reutilizado tanto pelo
`TrackProcessor` do LiveKit (`audio/RnnoiseAudioProcessor.ts`, via `LocalAudioTrack.setProcessor`)
quanto pelo teste de microfone em `VoiceSettings.tsx`, para garantir que os dois usem exatamente o
mesmo processamento.

## Consequencias

- `LocalAudioTrack.restartTrack()` do `livekit-client@2.22.0` ja reexecuta `processor.restart()`
  sozinho quando ha um processor ativo — trocar de microfone ou ajustar outro filtro com RNNoise
  ligado nao exige logica propria de reanexacao.
- Falha ao iniciar RNNoise (WASM, worklet ou `AudioContext`) cai automaticamente para WebRTC sem
  derrubar a chamada, com aviso nao bloqueante.
- A faixa de audio da tela (`Track.Source.ScreenShareAudio`) nunca passa por RNNoise; o processor so
  e anexado na faixa de microfone.
- O projeto ganhou Vitest (`apps/web/vitest.config.ts`, script `pnpm test:unit`) para cobrir a logica
  pura de preferencias/migracao/constraints — antes a validacao era so `pnpm check` + lint + Playwright.
- Qualidade real do RNNoise (voz cortada, som metalico, CPU, bateria) e o comportamento em
  Firefox/Safari/mobile dependem de teste manual comparativo, ainda nao executado.

## Alternativas descartadas

- **Krisp / DeepFilterNet / processamento server-side**: fora do modo custo zero (ADR 0003) por
  cobranca, dependencia externa ou custo de infraestrutura.
- **Migrar `high` automaticamente para `rnnoise`**: RNNoise usa mais CPU; a troca precisa ser uma
  escolha explicita do usuario, nao um upgrade silencioso.
- **Guardar `noiseSuppression`/`voiceIsolation` como booleanos soltos junto do novo modo**: permitiria
  recombinacoes invalidas (ex.: `rnnoise` + `voiceIsolation: true`); o modo agora e a unica fonte de
  verdade e as constraints do navegador sao sempre derivadas dele.
