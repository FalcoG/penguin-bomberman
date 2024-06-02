import { useCallback, useContext, useEffect, useState } from 'react'
import Layout from '~/components/Layout.tsx'
import Panel from '~/components/Panel.tsx'
import WebSocketContext from '~/lib/context/WebSocketContext.ts'
import ChatForm from '~/components/ChatForm.tsx'
import createPacket from '~/lib/utils/create-packet.ts'
import { basePacket, outbound, TPlayerUsername } from '~/types/packets.ts'
import PlayerList, { PlayerListItem } from '~/components/ui/PlayerList.tsx'

export default function Lobby() {
  const { messages, players, webSocket, player } = useContext(WebSocketContext)
  const invitePlayer = useCallback((username: TPlayerUsername) => {
    if (!webSocket) return
    console.log('send invite to', username)
    webSocket.send(createPacket('invite', username))
  }, [webSocket])

  const cancelInvite = useCallback((username: TPlayerUsername) => {
    if (!webSocket) return
    webSocket.send(createPacket('invite_cancel', username))
  }, [webSocket])

  const [receivedInvites, setReceivedInvites] = useState<TPlayerUsername[]>([])
  const [invites, setInvites] = useState<TPlayerUsername[]>([])

  useEffect(() => {
    if (!webSocket) return

    const inviteHandler = (e: WebSocketEventMap['message']) => {
      const object = JSON.parse(e.data)
      const parsed = basePacket.parse(object)

      if (parsed.key === 'invite_sent') {
        const usernames = outbound[parsed.key].parse(parsed.data)

        setInvites((prevState) => [...prevState, ...usernames])
      } else if (parsed.key === 'invite_cancel') {
        const usernames = outbound[parsed.key].parse(parsed.data)

        setInvites(prevState =>
          prevState.filter(key => !usernames.includes(key))
        )
      } else if (parsed.key === 'invite_received') {
        const usernames = outbound[parsed.key].parse(parsed.data)
        console.log('received invite from', usernames)

        setReceivedInvites((prevState) => [...prevState, ...usernames])
      } else if (parsed.key === 'invite_revoke') {
        const usernames = outbound[parsed.key].parse(parsed.data)

        setReceivedInvites(prevState =>
          prevState.filter(key => !usernames.includes(key))
        )
      }
    }

    webSocket.addEventListener('message', inviteHandler)

    return () => {
      webSocket.removeEventListener('message', inviteHandler)
    }
  }, [webSocket])

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
        <PlayerList>
          {players.map((playerName) => (
            <PlayerListItem
              self={player === playerName}
              player={playerName}
              invite={invitePlayer}
              cancelInvite={cancelInvite}
              invited={invites.includes(playerName)}
              inviting={receivedInvites.includes(playerName)}
              key={playerName}
            />
          ))}
        </PlayerList>
        <pre>
          sent:
          {JSON.stringify(invites, null, 2)}
          received:
          {JSON.stringify(receivedInvites, null, 2)}
        </pre>
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
