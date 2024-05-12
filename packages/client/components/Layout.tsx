import React from 'react'

type LayoutProps = { children: React.ReactNode, variant?: 'menu' | 'focus' | 'wide' }
const Layout = ({ children, variant = 'menu' }: LayoutProps) => {
  const style: React.CSSProperties = {
    margin: '1em'
  }

  if (variant !== 'focus') {
    style.marginLeft = 'auto'
    style.marginRight = 'auto'
  }

  if (variant === 'menu') style.maxWidth = '32em'
  if (variant === 'wide') style.maxWidth = '52em'

  return <main style={style}>
    {children}
  </main>
}

export default Layout
