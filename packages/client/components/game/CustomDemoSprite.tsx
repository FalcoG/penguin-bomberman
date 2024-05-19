import { useState } from 'react'
import Sprite from '~/components/game/Sprite.tsx'
import useFrame from '~/lib/hooks/useFrame.ts'

const CustomDemoSprite = () => {
  useFrame(({ delta }) => {
    setRot((prevState) => {
      return (prevState + (delta * 0.5)) % 360
    })
  })

  const [rot, setRot] = useState(0)

  return <Sprite x={5} y={5} rot={rot}/>
}

export default CustomDemoSprite
