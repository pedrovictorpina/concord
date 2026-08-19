export type ScreenShareQuality = 'automatic' | 'high' | 'medium' | 'low'

export const screenShareQualities: Record<ScreenShareQuality, { label: string; detail: string; resolution: { width: number; height: number; frameRate: number } }> = {
  automatic: { label: 'Automatica', detail: 'Adapta bitrate e camadas a conexao.', resolution: { width: 1280, height: 720, frameRate: 15 } },
  high: { label: 'Alta', detail: '1080p · 30 FPS para rede estavel.', resolution: { width: 1920, height: 1080, frameRate: 30 } },
  medium: { label: 'Media', detail: '720p · 15 FPS para uso geral.', resolution: { width: 1280, height: 720, frameRate: 15 } },
  low: { label: 'Baixa', detail: '480p · 10 FPS para economizar dados.', resolution: { width: 854, height: 480, frameRate: 10 } },
}
