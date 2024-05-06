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
import PreflightForm from './lib/components/PreflightForm'
import Key from './lib/components/Key'
import Notification from './lib/components/Notification'

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
    // todo: temporarily disabled to show main UI
    // assetsLoader()
    //   .then((assets) => {
    //     setAssets(assets)
    //   })
  }, [])

  return <main>
    <Header/>
    <h2>Welcome!</h2>
    <p><u>Bombs</u> are used to <u>clear a path</u> to your opponent, as well as to <u>defeat your opponent</u></p>

    <p>Press <Key>spacebar</Key> to deploy bombs</p>
    <p>Use <Key>w</Key> <Key>a</Key> <Key>s</Key> <Key>d</Key> or <b>arrow keys</b> to move</p>
    <hr/>
    {/*<Notification type="info">*/}
    {/*  Connecting to the server..*/}
    {/*</Notification>*/}
    {/*<Notification type="error">*/}
    {/*  Unable to connect to the server!*/}
    {/*</Notification>*/}
    <PreflightForm />
    {assets && <Stage
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
    </Stage>}
  </main>
}

export default App