import { TGameState, TPoint } from '../lib/types'

export function distancePointToPoint (
  origin: TPoint,
  target: TPoint
) {
  return Math.sqrt(
    Math.pow(origin.x - target.x, 2) +
    Math.pow(origin.y - target.y, 2)
  )
}

export function calculateMovePoint (
  grid: TGameState['grid'],
  velocity: TPoint
) {

}
