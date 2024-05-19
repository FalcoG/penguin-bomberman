import { useEffect, useRef, useCallback, useState } from 'react'
import GameLayout from '~/components/GameLayout.tsx'
import Sprite from '~/components/game/Sprite.tsx'
import Screen from '~/components/game/Screen.tsx'
import { TFrameDelta, TFrameTimestamp, TFrameNumber } from '~/types/game.ts'

const DomGame = () => {
  const [rotation, setRotation] = useState<number>(0)
  const spriteAnimation = useCallback((delta: TFrameDelta) => {
    const addedRotation = (delta * 0.05)

    setRotation((prevState) => {
      return (prevState + addedRotation) % 360
    })
  }, [])

  const frameIdRef = useRef<TFrameNumber>();
  const deltaRef = useRef<TFrameDelta>();
  const animate = useCallback((timestamp: TFrameTimestamp) => {
    const frame = frameIdRef.current
    const delta: TFrameDelta = timestamp - (deltaRef.current || 0)

    spriteAnimation(delta)
    deltaRef.current = timestamp;
    frameIdRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, []);

  return <GameLayout>
    dom layout
    <Screen pixelSize={48}>
      <Sprite x={3} y={3} rot={rotation} size={2} key='rotator'/>
      <Sprite x={1} y={2} size={1} key='demo'/>
      <Sprite x={0} y={0} size={1} offset={[0, 0]} key='top-left-alignment' imagePath='/assets/game/static_ice.svg' />
    </Screen>
  </GameLayout>
}

export default DomGame
