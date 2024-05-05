import { Stage, Container, Text } from '@pixi/react'
import { useState, useEffect } from 'react'
import { TGameState } from '../lib/types'
import { indexToPosition } from './lib/utils'
import assetsLoader from './assets'
import AssetsContext from './lib/AssetsContext'
import config from './config.json'
import Header from './lib/components/Header'
import Bomb from './lib/components/game/Bomb'
import Bunny from './lib/components/game/Bunny'
import StaticIce from './lib/components/game/StaticIce'
import GameStateContext from './lib/GameStateContext'
import Player from './lib/components/game/Player'

export const App = () => {
  const [grid, setGrid] = useState(() => {
    let newGridLayout: TGameState['grid'] = []

    for (let ix = 0; config.grid.size.width > ix; ix++) {
      const rows = config.grid.ice_immutable_pattern.length

      for (let iy = 0; config.grid.size.height > iy; iy++) {
        const row = config.grid.ice_immutable_pattern[iy % rows]
        const cell = row[ix % row.length]


        const index = ix + config.grid.size.width * iy
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
  }, [])

  return assets ? (
    <main>
      <Header/>
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
          <GameStateContext.Provider value={{ grid }}>
            <Bunny/>
            <Container x={0} y={0}>
              {grid.map((cell, index) => {
                const { x, y } = indexToPosition(index)

                if (cell === 'immutable_ice') {
                  // console.log('ice ice', x, y)
                  return <StaticIce x={x} y={y} key={`${x}_${y}`}/>
                }

                return null
              })}
              <Bomb x={5} y={6}/>
              <Player/>
            </Container>

            <Container x={400} y={330}>
              <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }}/>
            </Container>
          </GameStateContext.Provider>
        </AssetsContext.Provider>
      </Stage>
    </main>
  ) : <div>Loading game...</div>
}

export default App
