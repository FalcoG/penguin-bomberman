import { createContext } from 'react'
import { TRenderContext } from '~/types/context.ts'

const RenderContext = createContext<TRenderContext | null>(null)

export default RenderContext
