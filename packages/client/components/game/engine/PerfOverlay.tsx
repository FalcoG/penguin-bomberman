import React, { useState } from 'react'
import useFrame from '~/lib/hooks/useFrame.ts'

const PerfOverlay = () => {
  const [delta, setDelta] = useState(0)
  useFrame(({ delta }) => {
    setDelta(delta)
  }, [])

  const cssStyle: React.CSSProperties = {
    position: 'fixed',
    right: '1rem',
    bottom: '1rem',
    color: 'var(--color-triadic_2-5)',
    backgroundColor: 'var(--color-shade-0)',
    fontSize: '1.5rem',
    padding: '0.2rem 0.4rem'
  }
  return <div style={cssStyle}>
    {Math.round(1000/delta)} fps
  </div>
}

export default PerfOverlay
