import React from 'react'

type LayoutProps = { children: React.ReactNode, variant?: 'menu' | 'focus' }
const Layout = ({ children, variant = 'menu' }: LayoutProps) => {
  const style: React.CSSProperties = {
    border: '.2em solid var(--color-shade-4)',
    background: 'var(--color-shade-0)',
    borderRadius: '1em',
    padding: '1em',
    margin: '1em'
  }

  if (variant === 'menu') {
    style.maxWidth = '32em'
    style.marginLeft = 'auto'
    style.marginRight = 'auto'
  }

  return <main style={style}>
    {children}
  </main>
}

export default Layout
