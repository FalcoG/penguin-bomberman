import { useState } from 'react'
import GameLayout from '~/components/GameLayout.tsx'
// import Sprite from '~/components/game/engine/Sprite.tsx'
import Screen from '~/components/game/engine/Screen.tsx'
import CustomDemoSprite from '~/components/game/CustomDemoSprite.tsx'
import Scene from '~/components/game/Scene.tsx'
import PerfOverlay from '~/components/game/engine/PerfOverlay.tsx'
import config from '~/lib/config.ts'
import HeaderGame from '~/components/HeaderGame.tsx'
import GamePictureFrame from '~/components/GamePictureFrame.tsx'

const DomGame = () => {
  const [count, setCount] = useState(0)
  return <GameLayout>
    dom layout
    <b onClick={(() => setCount((prevState) => prevState + 1))}>klick mich {count}</b>
    <HeaderGame/>
    <GamePictureFrame>
      <Screen width={config.grid.size.width} height={config.grid.size.height}>
        <PerfOverlay/>
        <Scene/>
        {/*<Sprite x={1} y={2} size={1} key="demo"/>*/}
        {/*<Sprite x={0} y={0} size={1} offset={[0, 0]} key="top-left-alignment" imagePath="/assets/game/static_ice.svg"/>*/}
        <CustomDemoSprite/>
      </Screen>
    </GamePictureFrame>
    <p>
      Penguin Bomberman 2024
      <br/>
      <sub>https://example.com/</sub>
    </p>
  </GameLayout>
}

export default DomGame
