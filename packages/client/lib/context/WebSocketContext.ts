import { createContext } from 'react'

export interface TWebSocketContext {
  setWebSocket?(webSocket: WebSocket): void
  webSocket?: WebSocket
}

const WebSocketContext = createContext<TWebSocketContext>({})

export default WebSocketContext
