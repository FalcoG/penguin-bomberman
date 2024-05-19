import { TFrameTimestamp, TPoint } from '~/types/mod.ts'
import { TFrameDelta, TFrameNumber } from '~/types/game.ts'

export interface TGameState {
  grid: Array<'immutable_ice' | false>
  isReady: boolean
  playerPosition: TPoint
  setPlayerPosition: React.Dispatch<React.SetStateAction<TPoint>>
}

export type TFrameTickProps = { delta: TFrameDelta, timestamp: TFrameTimestamp, frame: TFrameNumber }
export type TFrameTick = (data: TFrameTickProps) => void
export type TAddFrameTick = (callback: TFrameTick) => string
export type TRemoveFrameTick = (key: string) => void

export interface TRenderContext {
  pixelSize: number
  addTick: TAddFrameTick,
  removeTick: TRemoveFrameTick,
}
