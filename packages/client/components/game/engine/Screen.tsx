import React, { useCallback, useRef, useEffect } from 'react'
import RenderContext from '~/lib/context/RenderContext.ts'
import { TFrameTick, TRenderContext } from '~/types/context.ts'
import { TFrameDelta, TFrameNumber, TFrameTimestamp } from '~/types/game.ts'

type TScreenProps = { children: React.ReactNode, pixelSize: number }

const Screen = ({ children, pixelSize }: TScreenProps) => {
  const renderQueueRef = useRef<{ [key: string]: TFrameTick }>({ })

  const cssStyle = {
    fontSize: `${pixelSize}px`
  }

  const frameIdRef = useRef<TFrameNumber>(0)
  const deltaRef = useRef<TFrameDelta>()
  const animate = useCallback((timestamp: TFrameTimestamp) => {
    const frame = frameIdRef.current
    const delta: TFrameDelta = timestamp - (deltaRef.current || 0)

    Object.values(renderQueueRef.current).forEach((cb) => cb({ delta, frame, timestamp }))

    deltaRef.current = timestamp

    frameIdRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
    }
  }, [])

  const addTick = useCallback<TRenderContext['addTick']>((callback) => {
    const key = window.crypto.randomUUID()
    console.info('render: +tick', key)

    renderQueueRef.current[key] = callback

    return key
  }, [])

  const removeTick = useCallback<TRenderContext['removeTick']>((key) => {
    delete renderQueueRef.current[key]
    console.info('render: -tick', key)
  }, [])

  return <RenderContext.Provider value={{ pixelSize, addTick, removeTick }}>
    <div style={cssStyle}>
      {children}
    </div>
  </RenderContext.Provider>
}

export default Screen
