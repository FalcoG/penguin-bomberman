import { createContext } from 'react'
import { TGameState } from '../../lib/types'

const GameStateContext = createContext<TGameState | null>(null)

export default GameStateContext
