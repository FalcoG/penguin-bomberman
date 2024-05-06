
const Key = ({ children }: { children: string }) => {
  return <span style={{
    background: 'var(--color-complementary-shade-2)',
    border: '.2em solid var(--color-complementary-shade-4)',
    color: 'var(--color-shade-6)',
    borderRadius: '.5em',
    padding: '.2em .4em',
    fontWeight: 'bold'
  }}>{children}</span>
}

export default Key
