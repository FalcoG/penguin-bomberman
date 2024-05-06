import React, { ReactNode } from 'react'

const Notification = ({ children, type }: { children: ReactNode, type: 'error' | 'info' }) => {
  const style: React.CSSProperties = {
    display: 'block',
    padding: '.6rem',
    background: 'var(--color-shade-2)',
    border: '.2em solid',
    borderRadius: '0.4em'
  }

  if (type === 'error') {
    style.color = 'white'
    style.borderColor = 'darkred'
    style.background = 'crimson'
  }

  return <div style={style}>{ children }</div>
}

export default Notification
