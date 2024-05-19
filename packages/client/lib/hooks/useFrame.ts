import React, { useContext, useEffect, useMemo, useRef } from 'react'
import RenderContext from '~/lib/context/RenderContext.ts'
import { TAddFrameTick, TFrameTick } from '~/types/context.ts'

function useFrame(
  callback: TFrameTick,
  deps: React.DependencyList = []
) {
  const renderContext = useContext(RenderContext)
  const callbackRef = useRef<ReturnType<TAddFrameTick> | null>(null)

  const ready = useMemo(() => {
    return renderContext != null && renderContext.addTick != null && renderContext.removeTick != null && renderContext
  }, [renderContext])

  useEffect(() => {
    if (!ready || callbackRef.current) return

    console.log('frame listener init')
    callbackRef.current = ready.addTick(callback, deps)

    return () => {
      console.log('frame listener exit')

      if (callbackRef.current) {
        ready.removeTick(callbackRef.current.key)
        callbackRef.current = null
      }
    }
  }, [ready])

  useEffect(() => {
    if (!callbackRef.current) return
    callbackRef.current.update(callback)
  }, deps)
}

export default useFrame
