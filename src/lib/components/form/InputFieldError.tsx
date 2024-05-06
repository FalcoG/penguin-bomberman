import React, { ReactNode } from 'react'

const InputFieldError = ({ children }: { children: ReactNode }) => {
  return <div style={{ display: 'block', margin: '.6rem 0', color: 'red' }}>{ children }</div>
}

export default InputFieldError
