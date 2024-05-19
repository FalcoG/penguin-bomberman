import { useState } from 'react'
import Sprite from '~/components/game/engine/Sprite.tsx'
import useFrame from '~/lib/hooks/useFrame.ts'

const Scene = () => {
  const [rot, setRot] = useState(0)

  useFrame(({ delta }) => {
    setRot((prevState) => (prevState + (delta * 0.1)) % 360)
  })

  return <>
    <Sprite x={3} y={3} rot={rot} size={2} key="rotator"/>
  </>
}

export default Scene
