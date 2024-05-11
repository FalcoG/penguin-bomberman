import { TPoint } from '~/types/mod.ts'

export interface TGameState {
  grid: Array<'immutable_ice' | false>
  isReady: boolean
  playerPosition: TPoint
  setPlayerPosition: React.Dispatch<React.SetStateAction<TPoint>>
}
