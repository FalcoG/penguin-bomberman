import React, { useCallback, useRef, useEffect } from 'react'
import RenderContext from '~/lib/context/RenderContext.ts'
import { TFrameTick, TRenderContext } from '~/types/context.ts'
import { TFrameDelta, TFrameNumber, TFrameTimestamp } from '~/types/game.ts'

type TScreenProps = { children: React.ReactNode, pixelSize?: number, width?: number, height?: number }

const Screen = ({ children, pixelSize, width, height }: TScreenProps) => {
  const renderQueueRef = useRef<{ [key: string]: TFrameTick }>({ })

  const cssStyle: React.CSSProperties = {
    fontSize: pixelSize ? `${pixelSize}px` : '1em',
    // border: '.2rem solid black',
    position: 'relative',
    height: height ? `${height}em` : '100vh',
    width: width ? `${width}em` : '100vw',
    margin: '0 auto',
    // background: `url('/assets/game/background.svg') right`,
    // backgroundSize: 'cover',
    // backgroundColor: '#222',
    userSelect: 'none' // dragging the game elements would be odd - is there a reason to not block this?
  }

  const frameIdRef = useRef<TFrameNumber>(0)
  const deltaRef = useRef<TFrameDelta>()
  const animate = useCallback((timestamp: TFrameTimestamp) => {
    const frame = frameIdRef.current
    const delta: TFrameDelta = timestamp - (deltaRef.current || 0)

    Object.values(renderQueueRef.current).forEach((callback) => {
      callback({ delta, frame, timestamp })
    })

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
    const setCallback = (callback: TFrameTick) => {
      renderQueueRef.current[key] = callback
    }
    const key = window.crypto.randomUUID()
    console.info('render: +tick', key)

    setCallback(callback)

    return { key: key, update: setCallback }
  }, [])

  const removeTick = useCallback<TRenderContext['removeTick']>((key) => {
    delete renderQueueRef.current[key]
    console.info('render: -tick', key)
  }, [])

  return <RenderContext.Provider value={{ addTick, removeTick }}>
    <div style={cssStyle}>
      {children}
    </div>
  </RenderContext.Provider>
}

export default Screen
