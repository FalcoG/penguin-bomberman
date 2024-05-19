import React, { useContext, forwardRef } from 'react'
import RenderContext from '~/lib/context/RenderContext.ts'

type TScreenProps = { children: React.ReactNode }

const Screen = forwardRef<HTMLDivElement, TScreenProps>(({ children }, ref) => {
  const renderState = useContext(RenderContext)
  if (!renderState) return

  const { pixelSize } = renderState

  const cssStyle = {
    fontSize: `${pixelSize}px`
  }

  return <div style={cssStyle} ref={ref}>
    {children}
  </div>
})

export default Screen
