import { TFrameTimestamp, TPoint } from '~/types/mod.ts'
import { TFrameDelta, TFrameNumber } from '~/types/game.ts'

export interface TGameState {
  grid: Array<'immutable_ice' | false>
  isReady: boolean
  playerPosition: TPoint
  setPlayerPosition: React.Dispatch<React.SetStateAction<TPoint>>
}

export type TCustomEventTickDetail = { delta: TFrameDelta, timestamp: TFrameTimestamp, frame: TFrameNumber }
export type TCustomEventTick = CustomEvent<TCustomEventTickDetail>
export type TCustomEventTickListener = CustomEventInit<TCustomEventTickDetail>
export interface TRenderContext {
  pixelSize: number
  screen: HTMLDivElement | null
}
