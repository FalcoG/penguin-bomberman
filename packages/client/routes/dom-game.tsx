import { useState } from 'react'
import GameLayout from '~/components/GameLayout.tsx'
// import Sprite from '~/components/game/engine/Sprite.tsx'
import Screen from '~/components/game/engine/Screen.tsx'
import CustomDemoSprite from '~/components/game/CustomDemoSprite.tsx'
import Scene from '~/components/game/Scene.tsx'
import PerfOverlay from '~/components/game/engine/PerfOverlay.tsx'

const DomGame = () => {
  const [count, setCount] = useState(0)
  return <GameLayout>
    dom layout
    <b onClick={(() => setCount((prevState) => prevState + 1))}>klick mich {count}</b>
    <Screen pixelSize={64}>
      <PerfOverlay/>
      <Scene/>
      {/*<Sprite x={1} y={2} size={1} key="demo"/>*/}
      {/*<Sprite x={0} y={0} size={1} offset={[0, 0]} key="top-left-alignment" imagePath="/assets/game/static_ice.svg"/>*/}
      <CustomDemoSprite/>
    </Screen>
  </GameLayout>
}

export default DomGame
