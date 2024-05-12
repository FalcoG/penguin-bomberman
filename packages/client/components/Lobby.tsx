import Layout from '~/components/Layout.tsx'
import Panel from '~/components/Panel.tsx'
import { useContext } from 'react'
import WebSocketContext from '~/lib/context/WebSocketContext.ts'
import ChatForm from '~/components/ChatForm.tsx'

export default function Lobby() {
  const { messages, players } = useContext(WebSocketContext)

  return <Layout variant="wide">
    <div style={{
      display: 'grid',
      gridTemplateAreas:
        `"players controls"
      "chat chat"`,
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '.5em'
    }}>
      <Panel style={{ gridArea: 'players' }}>
        <h2>Online Players ({players.length})</h2>
        <ul>
          {players.map((player) => <li key={player}>{player}</li>)}
        </ul>
      </Panel>
      <Panel style={{ gridArea: 'controls' }}>
        controls? or actions?
      </Panel>
      <Panel style={{ gridArea: 'chat' }}>
        <h2>Chat</h2>
        <ul>
          {messages.map(({ type, message, origin }, index) => {
            if (type === 'player') {
              return <li key={index}><b>{origin}</b>: {message}</li>
            }
            return <li key={index}>[<b>{type}</b>] {message}</li>
          })}
        </ul>
        <ChatForm/>
      </Panel>
    </div>
  </Layout>
}
