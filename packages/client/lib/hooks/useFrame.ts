import { useContext, useEffect, useMemo } from 'react'
import RenderContext from '~/lib/context/RenderContext.ts'
import { TCustomEventTickListener, TCustomEventTickDetail } from '~/types/context.ts'

type TFrameCallback = (detail: TCustomEventTickDetail) => void

function useFrame(callback: TFrameCallback) {
  const renderContext = useContext(RenderContext)

  const screen = useMemo(() => {
    return renderContext != null && renderContext.screen != null && renderContext.screen
  }, [renderContext])

  useEffect(() => {
    if (!screen) return

    console.log('frame listener init')

    const tick = (e: TCustomEventTickListener) => {
      if (!e.detail) return

      callback(e.detail)
    }

    screen.addEventListener('tick', tick)

    return () => {
      console.log('frame listener exit')

      screen.removeEventListener('tick', tick)
    }
  }, [screen])
}

export default useFrame
