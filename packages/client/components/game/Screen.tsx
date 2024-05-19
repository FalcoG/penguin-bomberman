import React from 'react'

type TScreenProps = { children: React.ReactNode, pixelSize: number }

const Screen = ({ children, pixelSize }: TScreenProps) => {
  const cssStyle = {
    fontSize: `${pixelSize}px`
  }
  return <div style={cssStyle}>
    {children}
  </div>
}

export default Screen
