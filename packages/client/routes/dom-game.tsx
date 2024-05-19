import { useEffect, useRef, useCallback, useState } from 'react'
import GameLayout from '~/components/GameLayout.tsx'
import Sprite from '~/components/game/Sprite.tsx'
import Screen from '~/components/game/Screen.tsx'
import { TFrameDelta, TFrameTimestamp, TFrameNumber } from '~/types/game.ts'
import RenderContext from '~/lib/context/RenderContext.ts'
import CustomDemoSprite from '~/components/game/CustomDemoSprite.tsx'
import { TCustomEventTickDetail } from '~/types/context.ts'

const DomGame = () => {
  const [rotation, setRotation] = useState<number>(0)
  const spriteAnimation = useCallback((delta: TFrameDelta) => {
    const addedRotation = (delta * 0.05)

    setRotation((prevState) => {
      return (prevState + addedRotation) % 360
    })
  }, [])

  const frameIdRef = useRef<TFrameNumber>(0)
  const deltaRef = useRef<TFrameDelta>()
  const animate = useCallback((timestamp: TFrameTimestamp) => {
    const frame = frameIdRef.current
    const delta: TFrameDelta = timestamp - (deltaRef.current || 0)

    if (screenRef.current) {
      const event = new CustomEvent<TCustomEventTickDetail>('tick', { detail: { delta, frame, timestamp } })
      screenRef.current.dispatchEvent(event)
    }

    spriteAnimation(delta)
    deltaRef.current = timestamp
    frameIdRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
    }
  }, [])

  const screenRef = useRef<HTMLDivElement | null>(null)

  return <GameLayout>
    dom layout
    <RenderContext.Provider value={{ pixelSize: 48, screen: screenRef.current }}>
      <Screen ref={screenRef}>
        <Sprite x={3} y={3} rot={rotation} size={2} key="rotator"/>
        <Sprite x={1} y={2} size={1} key="demo"/>
        <Sprite x={0} y={0} size={1} offset={[0, 0]} key="top-left-alignment" imagePath="/assets/game/static_ice.svg"/>
        <CustomDemoSprite/>
      </Screen>
    </RenderContext.Provider>
  </GameLayout>
}

export default DomGame
