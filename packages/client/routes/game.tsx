import { useEffect, useRef, useState, useCallback } from 'react'
import * as melon from 'https://esm.run/melonjs'
import GameLayout from '~/components/GameLayout.tsx'
import { AssetsCache, AssetsConfig, TPoint } from '~/types/game.ts'
import config from '~/lib/config.ts'
import melonLoadAssets from '~/lib/utils/melon-load-assets.ts'
import { indexToPosition } from '~/lib/utils/point.ts'
import GameStateContext from '~/lib/context/GameStateContext.ts'
import MelonPlayer from '~/components/game/MelonPlayer.tsx'
import createInitialGrid from '~/lib/utils/create-initial-grid.ts'

let ticker = 0

export default function Game() {
  const canvasRef = useRef<boolean>(false)
  const loaderRef = useRef<boolean>(false)
  const screenElement = useRef<HTMLDivElement>(null)

  const [assets, setAssets] = useState<AssetsCache | undefined>()
  const [bomb, setBomb] = useState<melon.Sprite>()
  const [playerSprite, setPlayerSprite] = useState<melon.Sprite>()
  const [text, setText] = useState<melon.Text>()

  // game grid constructor
  const [grid, setGrid] = useState(createInitialGrid())

  const [position, setPosition] = useState<TPoint>({
    x: 0,
    y: 0
  })

  const isReady = canvasRef.current && assets != null

  useEffect(() => {
    if (!isReady) return
    console.log('render my grid', grid)

    const size = config.graphics.block_size_px
    const svgImage = new Image(size, size)
    svgImage.src = assets.static_ice.data

    // prob replace this with filter, but does filter give a good index?
    grid.forEach((cell, index) => {
      if (cell !== 'immutable_ice') return

      const { x, y } = indexToPosition(index)

      melon.game.world.addChild(new melon.Sprite(
        x * config.graphics.block_size_px,
        y * config.graphics.block_size_px, {
          image: svgImage,
          anchorPoint: new melon.Vector2d(0, 0),
        }
      ))
    })

  }, [isReady])

  // asset loader job
  useEffect(() => {
    if (loaderRef.current) return

    loaderRef.current = true

    console.log('start loading assets')
    const assets: AssetsConfig = {
      bomb: 'assets/game/bomb.svg',
      static_ice: 'assets/game/static_ice.svg',
      missing_texture: 'assets/game/missing_texture_block.svg',
    }

    melonLoadAssets(assets)
      .then(nextState => {
        setAssets(prevState => {
          return {
            ...prevState,
            ...nextState
          }
        })
      })
  }, [])

  useEffect(() => {
    console.log('tick mount') // make it so that this mount is only once? ...or split each bit of frame logic into their own function
    const tick = () => {
      if (!melon.state.isCurrent(melon.state.DEFAULT)) return

      if (text) text.setText(`hallo ${ticker++} ${position.x} ${position.y}`)
      if (bomb) {
        bomb.pos.x = melon.game.viewport.width / 2
        bomb.pos.y = melon.game.viewport.height / 2
      }

      // if (playerSprite) {
      //
      // }
    }

    melon.event.on(melon.event.GAME_UPDATE, tick)

    return () => melon.event.off(melon.event.GAME_UPDATE, tick)
  }, [bomb, text])

  useEffect(() => {
    if (!playerSprite) return

    //position.x * config.graphics.block_size_px + config.graphics.block_size_px / 2
    playerSprite.pos.x = position.x * config.graphics.block_size_px + config.graphics.block_size_px / 2
    playerSprite.pos.y = position.y * config.graphics.block_size_px + config.graphics.block_size_px / 2
  }, [playerSprite, position])

  useEffect(() => {
    if (!isReady || !assets) return
    // if (!assets) return
    // melon.state.DEFAULT
    // const buildScene = () => {
    //   if (!melon.state.isCurrent(melon.state.DEFAULT)) return
    //   console.log('melon state changed')
    // console.log('viewport', melon.game.viewport.width, melon.game.viewport.height)
    // set a gray background color
    melon.game.world.backgroundColor.parseCSS('#202020')

    // add a font text display object
    setText(
      melon.game.world.addChild(new melon.Text(10, 10, {
        font: 'Arial',
        size: 160,
        fillStyle: '#FFFFFF',
        textBaseline: 'top',
        textAlign: 'left',
        text: 'Hello World!'
      }))
    )

    const bombSize = config.graphics.block_size_px * 0.75
    const svgImage = new Image(bombSize, bombSize)
    svgImage.src = assets.bomb.data

    setBomb(melon.game.world.addChild(
      new melon.Sprite(
        melon.game.viewport.width / 2,
        melon.game.viewport.height / 2, {
          image: svgImage,
          anchorPoint: new melon.Vector2d(0.5, 0.5),
        }
      )
    ))

    const player = new Image(config.graphics.block_size_px, config.graphics.block_size_px)
    player.src = assets.missing_texture.data

    setPlayerSprite(melon.game.world.addChild(
      new melon.Sprite(
        melon.game.viewport.width / 2,
        melon.game.viewport.height / 2, {
          image: player,
          anchorPoint: new melon.Vector2d(0.5, 0.5),
        }
      )
    ))
    // }

    // melon.event.on(melon.event.STATE_CHANGE, buildScene)
    //
    // buildScene()
    //
    // return () => melon.event.off(melon.event.STATE_CHANGE, buildScene)
  }, [assets, isReady])

  useEffect(() => {
    if (screenElement.current == null || canvasRef.current) return

    // initialize the display canvas once the device/browser is ready
    if (!melon.video.init(100, 100, {
      // antiAlias: true,
      parent: 'screen',
      scaleMethod: 'flex'
    })) {
      // todo: turn this into a critical failure / render a message, no alert
      alert('Your browser does not support HTML5 canvas.')
      return
    }

    melon.state.change(melon.state.DEFAULT, true)

    canvasRef.current = true
  }, [screenElement])

  return (
    <GameLayout>
      <div id="screen" ref={screenElement}></div>
      <GameStateContext.Provider value={{ grid, isReady, playerPosition: position, setPlayerPosition: setPosition }}>
        <div>
          <span>test</span>
        </div>
        <MelonPlayer/>
      </GameStateContext.Provider>
    </GameLayout>
  )
}
