const Panel = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => {
  return <div style={{
    border: '.2em solid var(--color-shade-4)',
    background: 'var(--color-shade-0)',
    borderRadius: '1em',
    padding: '1em',
    ...style
  }}>
    { children }
  </div>
}

export default Panel
