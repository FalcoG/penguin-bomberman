import { useState, useEffect } from 'react'
import Header from '~/components/Header.tsx'
import Key from '~/components/Key.tsx'
import PreflightForm from '~/components/PreflightForm.tsx'
import Layout from '~/components/Layout.tsx'
import Notification from '~/components/Notification.tsx'
import WebSocketContext from '~/lib/context/WebSocketContext.ts'
import Panel from '~/components/Panel.tsx'
import { basePacket, inbound, outbound } from '~/types/packets.ts'
import Lobby from '~/components/Lobby.tsx'
import { TWebSocketContext } from '~/lib/context/WebSocketContext.ts'

export default function Index() {
  const [webSocket, setWebSocket] = useState<WebSocket | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [webSocketReady, setWebSocketReady] = useState(false)
  const [messages, setMessages] = useState<TWebSocketContext['messages']>([])
  const [players, setPlayers] = useState<TWebSocketContext['players']>([])

  useEffect(() => {
    if (!webSocket) return

    const closeHandler = (e: WebSocketEventMap['close']) => {
      setWebSocket(undefined)

      if (webSocketReady) {
        setError('Lost connection with the game service')
        setWebSocketReady(false)
      }
    }

    webSocket.addEventListener('close', closeHandler)

    return () => {
      webSocket.removeEventListener('close', closeHandler)
    }
  }, [webSocket, webSocketReady])

  useEffect(() => {
    if (!webSocket) return

    setError(undefined)

    console.log('add listeners', webSocket)

    const messageHandler = (e: WebSocketEventMap['message']) => {
      console.log('websocket message', e.data)

      const object = JSON.parse(e.data)
      const parsed = basePacket.parse(object)

      if (parsed.key === 'connect') {
        const { status } = outbound.connect.parse(parsed.data)

        if (status === 200) setWebSocketReady(true)
      } else if (parsed.key === 'chat') {
        const payload = outbound[parsed.key].parse(parsed.data)
        setMessages((prevState) => [...prevState, payload])
      } else if (parsed.key === 'players') {
        const payload = outbound[parsed.key].parse(parsed.data)
        setPlayers(payload)
      } else if (parsed.key === 'player_connect') {
        const payload = outbound[parsed.key].parse(parsed.data)
        setPlayers((prevState) => {
          return [...prevState, payload]
        })
      } else if (parsed.key === 'player_disconnect') {
        const payload = outbound[parsed.key].parse(parsed.data)
        setPlayers((prevState) => {
          return prevState.filter(key => key !== payload)
        })
      } else {
        console.log('unhandled ws message', parsed)
      }
    }

    webSocket.addEventListener('message', messageHandler)

    return () => {
      webSocket.removeEventListener('message', messageHandler)
    }
  }, [webSocket])

  return (
    <WebSocketContext.Provider value={{ webSocket, setWebSocket, messages, players }}>
      {!webSocketReady && (
        <Layout>
          <Panel>
            {error && <Notification type="error">{error}</Notification>}
            <Header/>
            <h2>Welcome!</h2>
            <p><u>Bombs</u> are used to <u>clear a path</u> to your opponent, as well as to <u>defeat your opponent</u>
            </p>

            <p>Press <Key>spacebar</Key> to deploy bombs</p>
            <p>Use <Key>w</Key> <Key>a</Key> <Key>s</Key> <Key>d</Key> or <b>arrow keys</b> to move</p>
            <hr/>
            <PreflightForm/>
          </Panel>
        </Layout>
      )}
      {webSocketReady && (
        <Lobby/>
      )}
    </WebSocketContext.Provider>
  )
}
