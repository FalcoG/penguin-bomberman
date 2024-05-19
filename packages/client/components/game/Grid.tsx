import React from 'react'
import { indexToPosition } from '~/lib/utils/point.ts'
import { TGameState } from '~/types/context.ts'
import Sprite from '~/components/game/engine/Sprite.tsx'

const Grid = ({ grid }: { grid: TGameState['grid'] }) => {
  return <>
    {grid.map((cell, index) => {
      if (cell !== 'immutable_ice') return

      const { x, y } = indexToPosition(index)

      return <Sprite x={x} y={y} offset={[0, 0]} key={`${x}-${y}`} imagePath="/assets/game/static_ice.svg"/>
    })}
  </>
}

export default Grid
