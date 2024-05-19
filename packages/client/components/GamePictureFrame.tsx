import React from 'react'

type TGamePictureFrameProps = {
  children: React.ReactNode
}

const GamePictureFrame = ({ children }: TGamePictureFrameProps) => {
  const cssStyle: React.CSSProperties = {
    display: 'inline-block',
    background: `url('/assets/game/background.svg') right`,
    backgroundSize: 'cover',
    backgroundColor: 'black',
    outline: '.4rem solid black',
    borderRadius: '.5rem',
    padding: '2rem'
  }

  return <div style={cssStyle}>
    {children}
  </div>
}

export default GamePictureFrame
