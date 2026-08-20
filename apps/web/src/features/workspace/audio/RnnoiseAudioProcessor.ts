import type { AudioProcessorOptions, Track, TrackProcessor } from 'livekit-client'
import { createRnnoiseGraph } from './rnnoise-graph'
import type { RnnoiseGraph } from './rnnoise-graph'

export class RnnoiseAudioProcessor implements TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
  readonly name = 'concord-rnnoise'
  processedTrack?: MediaStreamTrack

  private graph: RnnoiseGraph | null = null

  async init(options: AudioProcessorOptions) {
    this.graph = await createRnnoiseGraph(options.audioContext, options.track)
    this.processedTrack = this.graph.outputTrack
  }

  async restart(options: AudioProcessorOptions) {
    this.teardown()
    this.graph = await createRnnoiseGraph(options.audioContext, options.track)
    this.processedTrack = this.graph.outputTrack
  }

  async destroy() {
    this.teardown()
  }

  private teardown() {
    this.graph?.destroy()
    this.graph = null
    this.processedTrack = undefined
  }
}
