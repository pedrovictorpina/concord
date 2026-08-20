# Concord — Supressão de Ruído: WebRTC + RNNoise

**Status:** Planejamento técnico
**Objetivo:** Evoluir a supressão de ruído do Concord mantendo custo operacional zero e processamento no dispositivo do usuário.

---

## 1. Contexto

O Concord já possui uma implementação funcional de tratamento de áudio baseada nas capacidades nativas do navegador.

Atualmente existem:

* `echoCancellation`;
* `noiseSuppression`;
* `autoGainControl`;
* `voiceIsolation`, quando suportado;
* escolha de dispositivo de entrada;
* escolha de dispositivo de saída;
* teste de microfone;
* persistência das preferências em `localStorage`;
* atualização das constraints durante uma chamada através de `LocalAudioTrack.restartTrack()`.

A implementação atual está concentrada principalmente em:

```text
apps/web/src/features/workspace/
├── voice-preferences.ts
├── VoiceSettings.tsx
├── useLiveRoom.ts
└── useVoiceSession.ts
```

O microfone é publicado pelo LiveKit usando:

```ts
room.localParticipant.setMicrophoneEnabled(
  true,
  audioCaptureOptions(processingRef.current),
)
```

O Concord também já reinicia a track quando as configurações de processamento são alteradas.

A documentação existente já identificava um `TrackProcessor` como caminho natural para processamento próprio de áudio.

---

# 2. Problema

A supressão nativa do WebRTC é adequada para a maioria dos casos, porém sua qualidade depende:

* do navegador;
* do sistema operacional;
* do dispositivo;
* da implementação interna do WebRTC.

Ela costuma lidar bem com:

* ruído constante;
* ventiladores;
* ar-condicionado;
* ruído ambiente moderado;
* algum ruído de teclado;
* eco proveniente dos alto-falantes.

Porém não oferece ao Concord controle direto sobre o algoritmo de supressão.

O objetivo é oferecer uma opção de maior qualidade sem:

* Krisp;
* APIs pagas;
* processamento de áudio no servidor;
* GPU;
* cobrança por minuto;
* aumentar o consumo da infraestrutura LiveKit.

---

# 3. Decisão de arquitetura

O Concord terá dois mecanismos de supressão de ruído.

```text
                        MICROFONE
                            │
                    Cancelamento de eco
                            │
             ┌──────────────┴──────────────┐
             │                             │
         PADRÃO                       APRIMORADA
             │                             │
    WebRTC / Navegador                RNNoise WASM
             │                             │
             └──────────────┬──────────────┘
                            │
                           Opus
                            │
                         LiveKit
                            │
                           Rede
```

Além deles deverá continuar existindo a possibilidade de desativar a supressão.

Na interface:

```text
Supressão de ruído

○ Desativada

● Padrão
  Processamento nativo do navegador.
  Menor consumo de recursos e recomendado para a maioria dos casos.

○ Aprimorada
  RNNoise executado localmente.
  Maior redução de ruído com maior uso de processamento.
```

Internamente:

```ts
export type NoiseSuppressionMode =
  | 'off'
  | 'webrtc'
  | 'rnnoise'
```

Evitar nomes internos como:

```ts
'standard'
'high'
```

porque eles representam intensidade e não identificam qual tecnologia está sendo utilizada.

---

# 4. Comportamento dos modos

## 4.1 Desativada

Objetivo: entregar áudio o mais próximo possível da captura original.

Configuração sugerida:

```ts
{
  noiseSuppression: false,
  voiceIsolation: false
}
```

`echoCancellation` e `autoGainControl` podem continuar obedecendo às preferências do usuário no modo personalizado.

No perfil Estúdio:

```ts
{
  echoCancellation: false,
  autoGainControl: false,
  noiseSuppression: false,
  voiceIsolation: false
}
```

---

## 4.2 Padrão — WebRTC

Será o modo padrão do Concord.

Configuração recomendada:

```ts
{
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true
}
```

Onde `voiceIsolation` estiver disponível, ele poderá continuar sendo aproveitado pelo perfil de voz.

O processamento acontece antes do envio ao LiveKit:

```text
Microfone
   ↓
Processamento WebRTC do navegador
   ↓
MediaStreamTrack
   ↓
LiveKit
```

### Vantagens

* nenhum pacote adicional obrigatório para este modo;
* baixíssimo consumo de CPU;
* baixa latência;
* suporte amplo;
* funciona mesmo se RNNoise falhar;
* nenhum custo adicional.

Este deve ser o **fallback universal**.

---

# 5. Aprimorada — RNNoise

O modo Aprimorado utilizará RNNoise compilado para WebAssembly.

O processamento deverá acontecer integralmente no cliente.

```text
Microfone
   ↓
WebRTC Echo Cancellation
   ↓
MediaStreamTrack original
   ↓
AudioWorklet
   ↓
RNNoise WASM
   ↓
MediaStreamTrack processada
   ↓
LiveKit
```

Nenhum áudio deverá ser enviado para uma API externa.

Nenhum áudio deverá ser processado pelo backend do Concord.

O LiveKit continuará apenas transportando a track já processada.

---

# 6. Não utilizar duas supressões simultaneamente

Este é um requisito importante.

Quando RNNoise estiver ativo:

```ts
noiseSuppression: false
voiceIsolation: false
```

O cancelamento de eco poderá permanecer ativo:

```ts
echoCancellation: true
```

O ganho automático também poderá continuar habilitado:

```ts
autoGainControl: true
```

Portanto:

```text
ERRADO

Microfone
 ↓
WebRTC Noise Suppression
 ↓
Voice Isolation
 ↓
RNNoise
 ↓
LiveKit
```

A dupla supressão pode provocar:

* voz metálica;
* finais de palavras cortados;
* respiração removida excessivamente;
* perda de frequências da voz;
* pumping;
* distorções.

O correto será:

```text
Microfone
 ↓
Echo Cancellation
 ↓
RNNoise
 ↓
LiveKit
```

---

# 7. Biblioteca RNNoise candidata

A primeira opção a ser avaliada deverá ser:

```text
@sapphi-red/web-noise-suppressor
```

O projeto fornece um `RnnoiseWorkletNode` baseado em RNNoise e utiliza `AudioWorklet` + WebAssembly.

Também oferece implementação baseada em Speex e Noise Gate, porém essas não fazem parte do escopo inicial.

A biblioteca é MIT e utiliza RNNoise através do `@shiguredo/rnnoise-wasm`.

RNNoise também possui licença permissiva compatível com o objetivo do Concord.

### Regra

Não acoplar todo o sistema de voz diretamente à biblioteca.

Criar uma camada própria do Concord:

```text
Concord
 ↓
ConcordRnnoiseProcessor
 ↓
@sapphi-red/web-noise-suppressor
 ↓
RNNoise WASM
```

Dessa forma a biblioteca poderá ser substituída posteriormente sem alterar `useLiveRoom`.

---

# 8. Integração com LiveKit

O LiveKit possui suporte nativo ao conceito de:

```ts
LocalAudioTrack.setProcessor()
```

e:

```ts
LocalAudioTrack.stopProcessor()
```

O processor intercepta o áudio local antes que ele seja transmitido aos outros participantes.

A integração deverá ocorrer somente na track:

```ts
Track.Source.Microphone
```

Nunca aplicar RNNoise em:

```ts
Track.Source.ScreenShareAudio
```

O áudio de jogos, músicas, vídeos e compartilhamento de tela precisa continuar sem supressão.

---

# 9. Novo processor

Criar aproximadamente:

```text
apps/web/src/features/workspace/audio/
└── RnnoiseAudioProcessor.ts
```

Responsabilidades:

```ts
class RnnoiseAudioProcessor {
  name = 'concord-rnnoise'

  processedTrack?: MediaStreamTrack

  async init(options) {
    // criar AudioContext / graph
    // carregar WASM
    // carregar AudioWorklet
    // conectar entrada ao RNNoise
    // criar MediaStreamDestination
    // definir processedTrack
  }

  async destroy() {
    // desconectar nodes
    // parar track processada
    // liberar referências
    // fechar recursos criados pelo processor
  }
}
```

O código exato deverá seguir a interface `TrackProcessor` da versão do `livekit-client` instalada no momento da implementação.

O projeto atualmente utiliza:

```text
livekit-client ^2.22.0
```

---

# 10. Carregamento sob demanda

RNNoise não deverá fazer parte do caminho inicial obrigatório da aplicação.

Preferir:

```ts
const module = await import('@sapphi-red/web-noise-suppressor')
```

somente quando:

```ts
noiseSuppressionMode === 'rnnoise'
```

Objetivos:

* não aumentar desnecessariamente o carregamento inicial;
* não inicializar WASM para usuários utilizando WebRTC;
* não criar `AudioContext` sem necessidade;
* reduzir consumo de memória.

Fluxo:

```text
Concord inicia
 ↓
WebRTC padrão
 ↓
RNNoise NÃO carregado

Usuário seleciona Aprimorada
 ↓
import()
 ↓
WASM
 ↓
AudioWorklet
 ↓
Processor
```

---

# 11. Mudança no modelo de preferências

Atualmente existem propriedades que podem representar estados redundantes:

```ts
noiseSuppression
suppressionLevel
voiceIsolation
```

A evolução recomendada é centralizar a decisão em:

```ts
export type NoiseSuppressionMode =
  | 'off'
  | 'webrtc'
  | 'rnnoise'
```

E:

```ts
export type VoiceProcessing = {
  autoGainControl: boolean
  echoCancellation: boolean
  inputDeviceId: string
  outputDeviceId: string
  outputVolume: number
  profile: VoiceProfile
  noiseSuppressionMode: NoiseSuppressionMode
}
```

As constraints reais deverão ser derivadas deste estado.

Evitar armazenar simultaneamente:

```ts
noiseSuppressionMode: 'rnnoise'
noiseSuppression: true
voiceIsolation: true
```

porque isso permite configurações logicamente inválidas.

---

# 12. Migração do localStorage

Atualmente as preferências utilizam:

```text
concord.voice.v1
```

A nova estrutura deverá utilizar:

```text
concord.voice.v2
```

ou possuir migração explícita durante a leitura.

Mapeamento recomendado:

```text
v1 off
    ↓
v2 off

v1 standard
    ↓
v2 webrtc

v1 high
    ↓
v2 webrtc
```

Não converter automaticamente:

```text
high → rnnoise
```

Um usuário que utilizava isolamento nativo não deve começar a utilizar um processor WASM mais pesado sem escolher isso.

Depois da migração, a nova configuração poderá ser persistida.

---

# 13. Perfis existentes

Os três perfis podem continuar existindo.

## Voz

Configuração:

```text
Echo cancellation     ON
Auto gain             ON
Noise suppression     WebRTC
```

Sugestão de renomear o texto visual atual:

```text
Isolamento de voz
```

para:

```text
Voz
```

ou:

```text
Comunicação
```

Motivo: "Isolamento de voz" passa a ficar ambíguo quando RNNoise também existe.

---

## Estúdio

Configuração:

```text
Echo cancellation     OFF
Auto gain             OFF
Noise suppression     OFF
```

Voltado para:

* música;
* instrumentos;
* microfones tratados externamente;
* interfaces de áudio;
* usuários que desejam áudio sem processamento.

---

## Personalizado

Permite selecionar:

```text
Supressão

Desativada
Padrão
Aprimorada
```

e alterar os demais controles de áudio.

---

# 14. Alterações em `audioCaptureOptions`

A função não deverá mais decidir apenas através do booleano `noiseSuppression`.

Exemplo conceitual:

```ts
export function audioCaptureOptions(value: VoiceProcessing) {
  const rnnoise = value.noiseSuppressionMode === 'rnnoise'
  const webrtc = value.noiseSuppressionMode === 'webrtc'

  const options: Record<string, unknown> = {
    autoGainControl: value.autoGainControl,
    echoCancellation: value.echoCancellation,
    noiseSuppression: webrtc,
  }

  if (value.inputDeviceId) {
    options.deviceId = value.inputDeviceId
  }

  if (voiceIsolationSupported()) {
    options.voiceIsolation =
      webrtc &&
      value.profile === 'voice'
  }

  return options
}
```

Quando:

```ts
noiseSuppressionMode === 'rnnoise'
```

o navegador deverá receber:

```ts
noiseSuppression: false
voiceIsolation: false
```

RNNoise será aplicado posteriormente.

---

# 15. Ciclo de troca do processor

## WebRTC → RNNoise

Fluxo recomendado:

```text
1. localizar LocalAudioTrack
2. remover processor anterior, se existir
3. restartTrack com noiseSuppression false
4. criar RNNoise processor
5. track.setProcessor(processor)
6. confirmar processor ativo
```

Conceitualmente:

```ts
await track.stopProcessor()

await track.restartTrack(
  audioCaptureOptions(next),
)

await track.setProcessor(
  await createRnnoiseProcessor(),
)
```

---

## RNNoise → WebRTC

```text
1. stopProcessor()
2. restartTrack()
3. WebRTC noiseSuppression true
```

---

## RNNoise → Desativada

```text
1. stopProcessor()
2. restartTrack()
3. noiseSuppression false
4. voiceIsolation false
```

A chamada não deve ser desconectada durante nenhuma dessas operações.

---

# 16. Troca de microfone

O Concord já utiliza:

```ts
room.switchActiveDevice('audioinput', ...)
```

Após uma troca de dispositivo enquanto RNNoise estiver ativo deverá ser confirmado que o processor continua associado à nova track.

Verificar:

```ts
track.getProcessor()
```

Se necessário:

```ts
await track.setProcessor(...)
```

O comportamento exato deve ser validado com a versão instalada do LiveKit.

---

# 17. Teste de microfone

Existe um ponto importante na implementação atual.

Hoje o teste utiliza:

```ts
getUserMedia()
 ↓
AnalyserNode
```

Isso funciona para o WebRTC porque as constraints são passadas diretamente ao `getUserMedia`.

Com RNNoise isso não será suficiente.

No modo Aprimorado o teste precisa seguir:

```text
getUserMedia
 ↓
RNNoise
 ↓
AnalyserNode
```

Caso contrário o Concord mostrará:

> "O teste usa os mesmos filtros da chamada."

mas isso não será verdade.

### Regra de arquitetura

O código responsável pela criação do graph RNNoise deve ser reutilizável por:

```text
LiveKit Processor
```

e:

```text
Teste de microfone
```

Evitar implementar dois algoritmos RNNoise independentes.

---

# 18. UI recomendada

Em `VoiceSettings.tsx`:

```text
Supressão de ruído

[ Desativada      ▼ ]
```

Opções:

```text
Desativada
Sem redução de ruído.

Padrão
Processamento do navegador.
Recomendado.

Aprimorada
RNNoise.
Maior redução de ruído e maior uso de CPU.
```

Durante a primeira versão, "Aprimorada" pode receber:

```text
Aprimorada (Beta)
```

---

# 19. Detecção de suporte

Antes de disponibilizar RNNoise, verificar pelo menos:

```ts
typeof AudioContext !== 'undefined'
```

e:

```ts
'AudioWorkletNode' in window
```

e disponibilidade de WebAssembly.

Quando não suportado:

```text
Aprimorada
Indisponível neste navegador
```

Nunca impedir o usuário de entrar no canal por falta de RNNoise.

---

# 20. Fallback

RNNoise é um recurso adicional.

Se ocorrer erro ao:

* carregar JS;
* carregar WASM;
* carregar AudioWorklet;
* inicializar processor;
* criar `AudioContext`;
* substituir a track;

o comportamento obrigatório será:

```text
RNNoise falhou
 ↓
remover processor parcial
 ↓
reiniciar track
 ↓
WebRTC noiseSuppression = true
 ↓
continuar chamada
```

Mostrar mensagem não bloqueante:

```text
A supressão aprimorada não pôde ser iniciada.
O Concord voltou para a supressão padrão.
```

Nunca:

```text
RNNoise falhou
 ↓
derrubar chamada
```

---

# 21. Processamento local e privacidade

RNNoise deverá funcionar completamente no dispositivo do usuário.

```text
Microfone
 ↓
RNNoise no navegador
 ↓
LiveKit
```

Não:

```text
Microfone
 ↓
Servidor Concord
 ↓
RNNoise
 ↓
LiveKit
```

Benefícios:

* nenhum custo computacional no backend;
* menor latência;
* maior privacidade;
* nenhum serviço externo de IA;
* nenhuma cobrança por minuto.

---

# 22. Custo operacional

A implementação não deverá alterar o custo de infraestrutura do Concord.

WebRTC:

```text
R$ 0 adicional
```

RNNoise:

```text
R$ 0 adicional
```

O custo é computacionalmente pago pelo próprio dispositivo:

```text
CPU do usuário
+
pequeno consumo adicional de RAM
```

O LiveKit recebe uma única track de voz em ambos os casos.

---

# 23. Desempenho

O modo padrão deverá continuar sendo WebRTC.

RNNoise será opcional justamente porque utiliza mais processamento.

Monitorar durante testes:

```text
CPU
RAM
temperatura
latência
uso de bateria
estabilidade da voz
```

Especialmente em:

* notebooks;
* celulares;
* dispositivos mais antigos.

Não inicializar RNNoise enquanto o usuário estiver em:

```text
off
```

ou:

```text
webrtc
```

---

# 24. Arquivos provavelmente afetados

### Alterar

```text
apps/web/package.json

apps/web/src/features/workspace/
├── voice-preferences.ts
├── VoiceSettings.tsx
└── useLiveRoom.ts
```

### Criar

Sugestão:

```text
apps/web/src/features/workspace/audio/
├── RnnoiseAudioProcessor.ts
├── rnnoise-support.ts
└── rnnoise-graph.ts
```

Responsabilidades:

```text
RnnoiseAudioProcessor.ts
    integração LiveKit

rnnoise-support.ts
    detecção AudioWorklet/WASM

rnnoise-graph.ts
    criação do graph RNNoise reutilizado
    pelo processor e pelo teste
```

---

# 25. Dependência

Candidata inicial:

```bash
pnpm --filter @concord/web add @sapphi-red/web-noise-suppressor
```

Não adicionar outras bibliotecas de supressão nesta etapa.

Antes do merge definitivo verificar novamente:

* licença;
* tamanho dos WASM;
* compatibilidade Vite;
* compatibilidade com browsers alvo;
* manutenção do pacote.

---

# 26. Não implementar nesta etapa

Ficam fora do escopo:

```text
DeepFilterNet
Krisp
Speex como modo público
noise gate
push-to-talk
transcrição
voice changer
equalizador
compressor
limiter
processamento de áudio no servidor
```

A arquitetura criada poderá permitir alguns desses recursos posteriormente.

---

# 27. Testes automatizados

Adicionar testes para:

### Preferências

```text
off → persiste
webrtc → persiste
rnnoise → persiste
```

### Migração

```text
v1 off → v2 off
v1 standard → v2 webrtc
v1 high → v2 webrtc
```

### Constraints

Para `webrtc`:

```text
noiseSuppression = true
```

Para `rnnoise`:

```text
noiseSuppression = false
voiceIsolation = false
```

Para `off`:

```text
noiseSuppression = false
```

---

# 28. Testes manuais

Executar com duas contas conectadas ao mesmo canal.

Cenários mínimos:

```text
voz normal
ventilador
ar-condicionado
teclado mecânico
mouse
TV ao fundo
música ao fundo
outra pessoa falando no ambiente
alto-falante do computador
headset
```

Comparar:

```text
OFF
vs
WebRTC
vs
RNNoise
```

Verificar especialmente se RNNoise:

* não corta início das palavras;
* não corta final das palavras;
* não deixa voz metálica;
* não aumenta significativamente a latência;
* não causa estalos;
* não perde áudio;
* não interrompe a chamada.

---

# 29. Navegadores a validar

Prioridade:

```text
Chrome
Edge
```

Depois:

```text
Firefox
Safari
```

Em mobile:

```text
Chrome Android
Safari iOS
```

Caso RNNoise não funcione em algum deles, WebRTC deve continuar disponível.

---

# 30. Critérios de aceite

A funcionalidade só deve ser considerada concluída quando:

1. O Concord inicia usando WebRTC sem carregar RNNoise.

2. O usuário pode alternar entre:

```text
Desativada
Padrão
Aprimorada
```

sem sair do canal.

3. WebRTC continua funcionando exatamente como fallback.

4. RNNoise é executado somente no cliente.

5. RNNoise não utiliza `noiseSuppression` nativo simultaneamente.

6. O cancelamento de eco continua disponível com RNNoise.

7. O compartilhamento de tela nunca passa por RNNoise.

8. A troca de microfone não remove permanentemente o processor.

9. O teste de microfone utiliza o mesmo processamento da chamada.

10. Preferências sobrevivem ao reload.

11. Falha do WASM não derruba a chamada.

12. Falha do processor volta automaticamente para WebRTC.

13. Nenhum serviço pago é necessário.

14. Nenhum novo processamento é realizado no backend.

15. `pnpm check`, lint e testes continuam passando.

---

# 31. Ordem recomendada para implementação pelo Codex

```text
ETAPA 1
Refatorar VoiceProcessing e criar NoiseSuppressionMode.

        ↓

ETAPA 2
Implementar migração concord.voice.v1 → v2.

        ↓

ETAPA 3
Atualizar audioCaptureOptions.

        ↓

ETAPA 4
Atualizar interface:
Off / Padrão / Aprimorada.

        ↓

ETAPA 5
Adicionar dependência RNNoise.

        ↓

ETAPA 6
Criar rnnoise-graph.ts.

        ↓

ETAPA 7
Criar RnnoiseAudioProcessor.

        ↓

ETAPA 8
Integrar setProcessor/stopProcessor ao useLiveRoom.

        ↓

ETAPA 9
Adicionar fallback automático para WebRTC.

        ↓

ETAPA 10
Fazer teste de microfone passar pelo RNNoise.

        ↓

ETAPA 11
Testar troca de dispositivo durante RNNoise.

        ↓

ETAPA 12
Testes automatizados e manuais.

        ↓

ETAPA 13
Atualizar documentação.
```

---

# 32. Resultado esperado

A arquitetura final deverá ser:

```text
                         CONCORD
                            │
                       Microfone
                            │
                  Echo Cancellation
                            │
              ┌─────────────┼─────────────┐
              │             │             │
             OFF          WEBRTC        RNNOISE
              │             │             │
              │       Noise Suppression   │
              │       Voice Isolation*    │
              │             │             │
              └─────────────┴─────────────┘
                            │
                           Opus
                            │
                         LiveKit
                            │
                       Participantes

* quando suportado pelo navegador
```

O Concord terá assim:

**Padrão**

```text
WebRTC
leve
compatível
zero custo
```

**Aprimorada**

```text
RNNoise WASM
processamento local
maior supressão
zero custo
```

O servidor permanece sem responsabilidade pelo processamento do microfone.

---

# 33. Decisão final

Adotar:

```text
WebRTC como padrão
+
RNNoise como modo aprimorado
```

Não adotar neste momento:

```text
Krisp
DeepFilterNet
processamento server-side
```

A prioridade é preservar:

```text
qualidade
+
baixa latência
+
arquitetura simples
+
fallback confiável
+
custo operacional zero
```
