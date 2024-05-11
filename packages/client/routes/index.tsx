import { useState, useEffect }  from 'react'
import Header from '~/components/Header.tsx'
import Key from '~/components/Key.tsx'
import PreflightForm from '~/components/PreflightForm.tsx'
import Layout from '~/components/Layout.tsx'
import Notification from '~/components/Notification.tsx'
import WebSocketContext from '~/lib/context/WebSocketContext.ts'

export default function Index() {
  const [webSocket, setWebSocket] = useState<WebSocket | undefined>()
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    if (!webSocket) return

    setError(undefined)

    console.log('add listeners', webSocket)
    webSocket.onclose = () => {
      setWebSocket(undefined)
      setError('Lost connection with the game service')
    }
    webSocket.onmessage = (e) => {
      console.log('websocket message')
    }
  }, [webSocket])

  return (
    <WebSocketContext.Provider value={{ webSocket, setWebSocket }}>
      {webSocket == null && <Layout>
        {error && <Notification type="error">{error}</Notification>}
        <Header/>
        <h2>Welcome!</h2>
        <p><u>Bombs</u> are used to <u>clear a path</u> to your opponent, as well as to <u>defeat your opponent</u></p>

        <p>Press <Key>spacebar</Key> to deploy bombs</p>
        <p>Use <Key>w</Key> <Key>a</Key> <Key>s</Key> <Key>d</Key> or <b>arrow keys</b> to move</p>
        <hr/>
        <PreflightForm />
      </Layout>}
      {webSocket != null && <Layout variant="focus">
        <Notification type="info">
          Connected to the game service
        </Notification>
      </Layout>}
    </WebSocketContext.Provider>
  )
}
