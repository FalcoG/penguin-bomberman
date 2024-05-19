import { useState } from 'react'
import Sprite from '~/components/game/engine/Sprite.tsx'
import useFrame from '~/lib/hooks/useFrame.ts'
import { TPoint } from '~/types/game.ts'
import Grid from '~/components/game/Grid.tsx'
import createInitialGrid from '~/lib/utils/create-initial-grid.ts'
import GameStateContext from '~/lib/context/GameStateContext.ts'
import Player from '~/components/game/Player.tsx'

const Scene = () => {
  const [rot, setRot] = useState(0)
  const [x, setX] = useState(0)

  // game grid constructor
  const [grid, setGrid] = useState(createInitialGrid())

  const [position, setPosition] = useState<TPoint>({
    x: 0,
    y: 0
  })

  useFrame(({ delta }) => {
    setRot((prevState) => (prevState + (delta * 0.1)) % 360)
    setX((prevState) => (prevState + (delta * 0.001)) % 5)
  })

  return <GameStateContext.Provider
    value={{
      grid,
      isReady: true,
      playerPosition: position,
      setPlayerPosition: setPosition
    }}
  >
    <Sprite x={x} y={3} rot={rot} size={2} key="rotator"/>
    <Grid grid={grid}/>
    <Player/>
  </GameStateContext.Provider>
}

export default Scene
