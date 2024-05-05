import React, { ReactNode } from 'react'

const InputFieldDescription = ({ children }: { children: ReactNode }) => {
  return <div style={{ display: 'block', marginBottom: '.6rem' }}>{ children }</div>
}

export default InputFieldDescription
