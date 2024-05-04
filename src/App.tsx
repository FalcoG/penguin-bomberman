import { Stage, Container, Sprite, Text, useTick } from '@pixi/react'
import { useState, createContext, useContext, useCallback, useEffect } from 'react'
import { TextStyle } from 'pixi.js'
import { OutlineFilter } from 'pixi-filters'
import {
  TGameState,
  TPoint,
  TypeCoordinateX,
  TypeCoordinateY
} from '../lib/types'
import { distancePointToPoint } from './utils'
import assetsLoader from './assets'
import AssetsContext from './AssetsContext'

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

const positionToCoords = (x: TypeCoordinateX, y: TypeCoordinateY): TPoint => {
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

const pointToIndex = ({ x, y }: TPoint) => {
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

  const [isMovingUp, setIsMovingUp] = useState<boolean>(false)
  const [isMovingLeft, setIsMovingLeft] = useState<boolean>(false)
  const [isMovingDown, setIsMovingDown] = useState<boolean>(false)
  const [isMovingRight, setIsMovingRight] = useState<boolean>(false)

  const gameState = useContext(GameStateContext);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'w' || e.key === 'ArrowUp') return setIsMovingUp(true)
    if (e.key === 'a' || e.key === 'ArrowLeft') return setIsMovingLeft(true)
    if (e.key === 's' || e.key === 'ArrowDown') return setIsMovingDown(true)
    if (e.key === 'd' || e.key === 'ArrowRight') return setIsMovingRight(true)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    console.log('add evt key')

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'w' || e.key === 'ArrowUp') return setIsMovingUp(false)
    if (e.key === 'a' || e.key === 'ArrowLeft') return setIsMovingLeft(false)
    if (e.key === 's' || e.key === 'ArrowDown') return setIsMovingDown(false)
    if (e.key === 'd' || e.key === 'ArrowRight') return setIsMovingRight(false)
  }, [])

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp)

    return () => document.removeEventListener('keyup', handleKeyUp)
  }, [handleKeyUp])

  useTick((delta, ticker) => {
    const velocity: TPoint = { x: 0, y: 0 }

    if (isMovingUp) velocity.y += -1
    if (isMovingLeft) velocity.x += -1
    if (isMovingDown) velocity.y += 1
    if (isMovingRight) velocity.x += 1

    if (velocity.x !== 0 || velocity.y !== 0) {
      setPosition((prevState) => {
        const justOverTheEdge = 0.0000001
        let targets: Array<{ point: TPoint, velocity: TPoint }> = []

        if (velocity.y !== 0) {
          targets.push({
            point: {
              x: Math.round(prevState.x),
              y: Math.round(prevState.y + velocity.y)
            },
            velocity: { x: 0, y: velocity.y }
          })
        }

        if (velocity.x !== 0) {
          targets.push({
            point: {
              x: Math.round(prevState.x + velocity.x),
              y: Math.round(prevState.y)
            },
            velocity: { x: velocity.x, y: 0 }
          })
        }

        // sort for the closest target
        targets.sort((a, b) => {
          return distancePointToPoint(prevState, a.point) - distancePointToPoint(prevState, b.point)
        })

        // find the closest walkable block
        const targetBlockFind = targets.find((target) => {
          const blockPoint = {
            x: Math.round(prevState.x + target.velocity.x * (0.5 + justOverTheEdge)),
            y: Math.round(prevState.y + target.velocity.y * (0.5 + justOverTheEdge))
          }
          return gameState?.grid[pointToIndex(blockPoint)] === false
        })

        const speedMod = 1

        // prevent state spam
        if (!targetBlockFind) {
          return prevState
        } else {
          return {
            x: targetBlockFind.velocity.y !== 0
              ? Math.round(prevState.x)
              : prevState.x + ((targetBlockFind.velocity.x * speedMod * gameOptions.movement_speed) * delta),
            y: targetBlockFind.velocity.x !== 0
              ? Math.round(prevState.y)
              : prevState.y + ((targetBlockFind.velocity.y * speedMod * gameOptions.movement_speed) * delta)
          }
        }
      })
    }
  })

  let rotation = 0
  // todo: calculate rotation

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
        angle={rotation}
      />
      {/*<Text*/}
      {/*  text={`${JSON.stringify(movement, null, 2)}`}*/}
      {/*  x={gameOptions.graphics.block_size_px}*/}
      {/*  y={gameOptions.graphics.block_size_px}*/}
      {/*  anchor={{ x: 1, y: 1 }}*/}
      {/*  style={*/}
      {/*    new TextStyle({*/}
      {/*      fontSize: 14,*/}
      {/*      stroke: '#00ff00',*/}
      {/*      strokeThickness: 3,*/}
      {/*    })*/}
      {/*  }*/}
      {/*/>*/}
    </Container>
  )
}

const StaticIce = ({ x, y }: TPoint) => {
  const assets = useContext(AssetsContext)

  return (
    <Sprite
      texture={assets?.static_ice}
      height={gameOptions.graphics.block_size_px}
      width={gameOptions.graphics.block_size_px}
      anchor={{x: 0.5, y: 0.5}}
      {...positionToCoords(x, y)}
    />
  )
}

const Bomb = ({ x, y }: TPoint) => {
  const assets = useContext(AssetsContext)

  return (
    <Sprite
      texture={assets?.bomb}
      height={gameOptions.graphics.block_size_px*0.75}
      width={gameOptions.graphics.block_size_px*0.75}
      anchor={{x: 0.5, y: 0.5}}
      {...positionToCoords(x, y)}
      filters={[new OutlineFilter(3, 0xFF0000)]}
    />
  )
}

const GameStateContext = createContext<TGameState | null>(null)

export const App = () => {
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

  const [assets, setAssets] = useState<Awaited<ReturnType<typeof assetsLoader>> | undefined>(undefined)

  useEffect(() => {
    console.log('Assets loader')
    assetsLoader()
      .then((assets) => {
        setAssets(assets)
      })
  }, []);

  return assets
    ? (
      <Stage
        options={{
          background: 0x222222,
          resizeTo: window,
          resolution: window.devicePixelRatio
        }}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <AssetsContext.Provider value={assets}>
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
        </AssetsContext.Provider>
      </Stage>
  ) : <div>Loading game...</div>;
};

export default App
