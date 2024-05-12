import { createContext } from 'react'
import z from 'zod'
import { outbound } from '~/types/packets.ts'

export interface TWebSocketContext {
  setWebSocket?(webSocket: WebSocket): void

  webSocket?: WebSocket
  messages: Array<z.infer<typeof outbound.chat>>
}

const WebSocketContext = createContext<TWebSocketContext>({
  messages: []
})

export default WebSocketContext
