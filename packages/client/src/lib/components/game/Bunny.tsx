import { useState } from 'react'
import { Sprite, useTick } from '@pixi/react'

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
      mousedown={() => {
        console.log('mousedown bunny')
      }}
    />
  )
}

export default Bunny
