import { createContext } from 'react'
import { TGameState } from '~/types/context.ts'

const GameStateContext = createContext<TGameState | null>(null)

export default GameStateContext
