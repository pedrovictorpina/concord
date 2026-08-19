# Etapa 03 - Voz e compartilhamento

## Objetivo

Permitir que membros de um mesmo servidor entrem em canais de voz, publiquem microfone e compartilhem tela pelo LiveKit Cloud, sem expor chaves administrativas no cliente.

## Primeiro recorte

- canal `#voz` criado para servidores novos e existentes;
- cliente web com entrada no canal, microfone e compartilhamento de tela;
- Edge Function `livekit-token` que valida sessao, canal de voz e membresia antes de emitir token de 10 minutos;
- midia trafega diretamente entre navegador e LiveKit Cloud.

## Qualidade da transmissao

Antes de iniciar o compartilhamento, a interface deve permitir escolher:

- `Automatica` como padrao, adaptando qualidade e taxa de quadros conforme a rede;
- `Alta`, para imagem mais nitida quando houver banda suficiente;
- `Media`, equilibrio para a maior parte das chamadas;
- `Baixa`, para conexoes instaveis ou economia de dados.

Os perfis agora definem a captura inicial no LiveKit. O modo automatico mantem 720p/15 FPS e deixa WebRTC/LiveKit adaptar bitrate e camadas; o ajuste dinamico de resolucao permanece para o proximo recorte.

## Segredos necessarios no Supabase

Configure na Edge Function, nunca no `.env` do Vite:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

## Criterios de aceite

1. Um membro autenticado entra somente em canal de voz do proprio servidor.
2. Um nao membro recebe `403` ao pedir token para o canal.
3. O navegador pede permissao antes de ativar microfone ou tela.
4. Ao encerrar a tela pelo seletor do sistema, a publicacao e removida.
5. A tela recebida e reproduzida para os demais participantes.

## Fora deste recorte

- audio de sistema no Windows;
- volume individual e selecao de dispositivo;
- selecao efetiva de qualidade automatica, alta, media e baixa, incluindo 1080p/30 FPS;
- aplicativos Electron e mobile.
