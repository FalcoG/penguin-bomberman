import { TPoint, TypeCoordinateX, TypeCoordinateY } from '~/types/game.ts'
import config from '~/lib/config.ts'

export function distancePointToPoint (
  origin: TPoint,
  target: TPoint
) {
  return Math.sqrt(
    Math.pow(origin.x - target.x, 2) +
    Math.pow(origin.y - target.y, 2)
  )
}

export function positionToCoords (x: TypeCoordinateX, y: TypeCoordinateY): TPoint {
  return {
    x: x * config.graphics.block_size_px + config.graphics.block_size_px/2,
    y: y * config.graphics.block_size_px + config.graphics.block_size_px/2,
  }
}

export function indexToPosition (index: number) {
  const x = index % config.grid.size.width
  const y = Math.floor(index / config.grid.size.width)

  return { x, y }
}

export function pointToIndex ({ x, y }: TPoint) {
  const flatX = Math.round(x)
  const flatY = Math.round(y)
  if (flatX >= config.grid.size.width) return -1
  return flatY*config.grid.size.width + flatX
}
