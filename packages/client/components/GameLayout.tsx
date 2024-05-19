import React from 'react'

const GameLayout = ({ children }: { children: React.ReactNode }) => {
  return <>
    <link rel="stylesheet" href="../style/game-context.css"/>
    {children}
  </>
}

export default GameLayout
