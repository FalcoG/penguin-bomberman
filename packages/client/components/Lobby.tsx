import Layout from '~/components/Layout.tsx'
import Panel from '~/components/Panel.tsx'
import { useContext } from 'react'
import WebSocketContext from '~/lib/context/WebSocketContext.ts'

export default function Lobby() {
  const { messages } = useContext(WebSocketContext)

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
        <h2>Online Players (0)</h2>
        <ul>
          <li>Jane_Doe</li>
          <li><strong>John_Doe (you)</strong></li>
        </ul>
      </Panel>
      <Panel style={{ gridArea: 'controls' }}>
        controls? or actions?
      </Panel>
      <Panel style={{ gridArea: 'chat' }}>
        <h2>Chat</h2>
        <ul>
          {messages.map(({ type, message }, index) => (<li key={index}>[<b>{type}</b>] {message}</li>))}
        </ul>
      </Panel>
    </div>
  </Layout>
}
