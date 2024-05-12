import { createContext } from 'react'
import z from 'zod'
import { outbound } from '~/types/packets.ts'

export interface TWebSocketContext {
  setWebSocket?(webSocket: WebSocket): void

  webSocket?: WebSocket
  messages: Array<z.infer<typeof outbound.chat>>
  players: z.infer<typeof outbound.players>
}

const WebSocketContext = createContext<TWebSocketContext>({
  messages: [],
  players: []
})

export default WebSocketContext
