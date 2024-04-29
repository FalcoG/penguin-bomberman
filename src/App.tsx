import { Stage, Container, Sprite, Text, useTick } from '@pixi/react'
import { useState, createContext, useContext, useCallback, useEffect } from 'react'
import { TextStyle } from 'pixi.js'
import {TGameState, TPlayerMovement, TypeCoordinates2D, TypeCoordinateX, TypeCoordinateY} from "../lib/types";
// import StaticIceAsset from './static_ice.svg?url'
//
// console.log('ice?!', JSON.stringify(StaticIceAsset))

const gameOptions = {
  graphics: {
    block_size_px: 64
  },
  grid: {
    size: {
      width: 13,
      height: 11
    },
    ice_immutable_pattern: [
      [false, false],
      [false, true]
    ]
  }, // w*h
  movement_speed: 0.05,
  movement_collision_margin: 0.1, // must be below 0.5!
}

const positionToCoords = (x: TypeCoordinateX, y: TypeCoordinateY): TypeCoordinates2D['object'] => {
  return {
    x: x * gameOptions.graphics.block_size_px + gameOptions.graphics.block_size_px/2,
    y: y * gameOptions.graphics.block_size_px + gameOptions.graphics.block_size_px/2,
  }
}

const indexToPosition = (index: number) => {
  const x = index % gameOptions.grid.size.width
  const y = Math.floor(index / gameOptions.grid.size.width)

  return { x, y }
}

const positionToIndex = (x: TypeCoordinateX, y: TypeCoordinateY) => {
  const flatX = Math.round(x)
  const flatY = Math.round(y)
  if (flatX >= gameOptions.grid.size.width) return -1
  return flatY*gameOptions.grid.size.width + flatX
}

const Bunny = () => {
  const [rotation, setRotation] = useState(0)

  useTick((delta) => {
    setRotation((rotation + 0.1 * delta) % 360)
  })

  return (
    <Sprite
      image="https://pixijs.io/pixi-react/img/bunny.png"
      x={400}
      y={270}
      rotation={rotation}
      anchor={{ x: 0.5, y: 0.5 }}
      mousedown={() => {console.log('mousedown bunny')}}
    />
  )
}

const Player = () => {
  const [position, setPosition] = useState<{ x: number, y: number}>({
    x: 0,
    y: 0
  })

  const gameState = useContext(GameStateContext);
  const [movement, setMovement] = useState<TPlayerMovement>({
    direction: 'right',
    velocity: { x: 0, y: 0 },
  })

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let movementState: TPlayerMovement;

    if (e.key === 'd' || e.key === 'ArrowRight') {
      movementState = {
        direction: 'right',
        velocity: { x: 1, y: 0 },//todo: coll check (x4)
      }
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
      movementState = {
        direction: 'left',
        velocity: { x: -1, y: 0 },
      }
    } else if (e.key === 'w' || e.key === 'ArrowUp') {
      movementState = {
        direction: 'up',
        velocity: { x: 0, y: -1 },
      }
    } else if (e.key === 's' || e.key === 'ArrowDown') {
      movementState = {
        direction: 'down',
        velocity: { x: 0, y: 1 },
      }
    }

    setMovement((prevState) => {
      if (movementState) {
        if (
          prevState.velocity.x !== movementState.velocity.x ||
          prevState.velocity.y !== movementState.velocity.y
        ) {
          return movementState
        }
      }
      return prevState
    })
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    console.log('add evt key')

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (
      (e.key === 'd' || e.key === 'ArrowRight') ||
      (e.key === 'a' || e.key === 'ArrowLeft') ||
      (e.key === 'w' || e.key === 'ArrowUp') ||
      (e.key === 's' || e.key === 'ArrowDown')
    ) {
      setMovement((prevState) => ({
        direction: prevState.direction,
        velocity: { x: 0, y: 0 }
      }))
    }

  }, [])

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp)

    return () => document.removeEventListener('keyup', handleKeyUp)
  }, [handleKeyUp])

  useTick((delta, ticker) => {
    if (movement.velocity.x !== 0 || movement.velocity.y !== 0) {
      setPosition((prevState) => {
        const justOverTheEdge = 0.0000001
        const targetAbsoluteCoordinates = [
          Math.round(prevState.x + movement.velocity.x*(0.5+justOverTheEdge)),
          Math.round(prevState.y + movement.velocity.y*(0.5+justOverTheEdge))
        ]

        const targetBlock = gameState?.grid[positionToIndex(
          targetAbsoluteCoordinates[0],
          targetAbsoluteCoordinates[1]
        )]

        const calculatedVelocity = {
          ...movement.velocity
        }

        if (targetBlock !== false) {
          calculatedVelocity.x = 0
          calculatedVelocity.y = 0
        }

        const speedMod = 1

        const x = calculatedVelocity.y !== 0
          ? Math.round(prevState.x)
          : prevState.x + ((calculatedVelocity.x * speedMod * gameOptions.movement_speed) * delta)

        const y = calculatedVelocity.x !== 0
          ? Math.round(prevState.y)
          : prevState.y + ((calculatedVelocity.y * speedMod * gameOptions.movement_speed) * delta)

        return {
          x,
          y,
        }
      })
    }
  })

  return (
    <Container x={position.x*gameOptions.graphics.block_size_px+gameOptions.graphics.block_size_px/2} y={position.y*gameOptions.graphics.block_size_px+gameOptions.graphics.block_size_px/2}>
      <Text text={`Player 1 ${position.x} ${position.y}`} y={-gameOptions.graphics.block_size_px*0.6} anchor={{ x: 0.5, y: 0.5 }} style={
        new TextStyle({
          fontSize: 14,
          stroke: '#ffffff',
          strokeThickness: 3,
        })
      } />
      <Sprite
        image="https://minecraft.wiki/images/EntitySprite_leatherworker.png?05433"
        height={gameOptions.graphics.block_size_px*0.8}
        width={gameOptions.graphics.block_size_px*0.8}
        anchor={{x: 0.5, y: 0.5}}
      />
      <Text
        text={`${JSON.stringify(movement, null, 2)}`}
        x={gameOptions.graphics.block_size_px}
        y={gameOptions.graphics.block_size_px}
        anchor={{ x: 1, y: 1 }}
        style={
          new TextStyle({
            fontSize: 14,
            stroke: '#00ff00',
            strokeThickness: 3,
          })
        }
      />
    </Container>
  )
}

const StaticIce = ({ x, y }: TypeCoordinates2D['object']) => {
  return (
    <Sprite
      image="https://minecraft.wiki/images/BlockSprite_packed-ice.png?d59ba"
      // image={StaticIceAsset}
      // image='./static_ice.svg'
      height={gameOptions.graphics.block_size_px}
      width={gameOptions.graphics.block_size_px}
      anchor={{x: 0.5, y: 0.5}}
      {...positionToCoords(x, y)}
    />
  )
}

const Bomb = ({ x, y }: TypeCoordinates2D['object']) => {
  return (
    <Sprite
      image="https://minecraft.wiki/images/BlockSprite_tnt.png?147d9"
      height={gameOptions.graphics.block_size_px*0.8}
      width={gameOptions.graphics.block_size_px*0.8}
      anchor={{x: 0.5, y: 0.5}}
      {...positionToCoords(x, y)}
    />
  )
}

const GameStateContext = createContext<TGameState | null>(null)

export const App = () => {
  console.log('App')
  const [grid, setGrid] = useState(() => {
    let newGridLayout: TGameState['grid'] = []

    for (let ix = 0; gameOptions.grid.size.width > ix; ix++) {
      const rows = gameOptions.grid.ice_immutable_pattern.length

      for (let iy = 0; gameOptions.grid.size.height > iy; iy++) {
        const row = gameOptions.grid.ice_immutable_pattern[iy % rows]
        const cell = row[ix % row.length]


        const index = ix + gameOptions.grid.size.width*iy
        newGridLayout[index] = cell ? 'immutable_ice' : false
        // console.log('should ice', cell, 'row', row, index, ix, iy)
      }
    }

    return newGridLayout
  })

  return (
    <Stage
      options={{ background: 0x222222, resizeTo: window }}
      width={window.innerWidth}
      height={window.innerHeight}
    >
      <GameStateContext.Provider value={{grid}}>
        <Bunny />
        <Container x={0} y={0}>
          {grid.map((cell, index) => {
            const { x, y } = indexToPosition(index)

            if (cell === 'immutable_ice') {
              // console.log('ice ice', x, y)
              return <StaticIce x={x} y={y} key={`${x}_${y}`} />
            }

            return null
          })}
          <Bomb x={5} y={6} />
          <Player />
        </Container>

        <Container x={400} y={330}>
          <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} />
        </Container>
      </GameStateContext.Provider>
    </Stage>
  );
};

export default App
