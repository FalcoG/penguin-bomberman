import { useContext, useEffect, useMemo, useRef } from 'react'
import RenderContext from '~/lib/context/RenderContext.ts'
import { TAddFrameTick, TFrameTick } from '~/types/context.ts'

function useFrame(callback: TFrameTick) {
  const renderContext = useContext(RenderContext)
  const callbackRef = useRef<ReturnType<TAddFrameTick> | null>(null)

  const ready = useMemo(() => {
    return renderContext != null && renderContext.addTick != null && renderContext.removeTick != null && renderContext
  }, [renderContext])

  useEffect(() => {
    if (!ready || callbackRef.current) return

    console.log('frame listener init')
    callbackRef.current = ready.addTick(callback)

    return () => {
      console.log('frame listener exit')

      if (callbackRef.current) {
        ready.removeTick(callbackRef.current)
        callbackRef.current = null
      }
    }
  }, [ready])
}

export default useFrame
