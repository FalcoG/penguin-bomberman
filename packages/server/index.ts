import { basePacket, connection, inbound, /*inbound,*/ WebSocketCloseCodes } from '../client/types/mod.ts'
import createPacket from './utils/create-packet.ts'
import WebSocketHelper from './WebSocketHelper.ts'

const webSocketHelper = new WebSocketHelper()

Deno.serve({ port: 1337 }, (req) => {
  if (req.headers.get('upgrade') != 'websocket')
    return new Response(null, { status: 501 })

  const parseUsername = connection.safeParse({ username: new URL(req.url).searchParams.get('username') })

  // client should've already had their username validated
  if (!parseUsername.success)
    return new Response(null, { status: 401 })

  let validSession = false
  const isUsernameUnique = !Object.keys(webSocketHelper.getKeys()).includes(parseUsername.data.username)

  const username = parseUsername.data.username
  const { socket, response } = Deno.upgradeWebSocket(req)

  socket.addEventListener('open', () => {
    if (!isUsernameUnique) {
      console.log(`user rejected, duplicate username`, WebSocketCloseCodes.DuplicateUsername)
      return socket.close(WebSocketCloseCodes.DuplicateUsername, `The name "${username}" is already taken`)
    }

    console.log(`${username} connected!`)
    webSocketHelper.broadcast(createPacket('player_connect', username))
    webSocketHelper.add(username, socket)
    validSession = true

    socket.send(
      createPacket('connect', {
          status: 200
        }
      )
    )

    socket.send(
      createPacket('chat', {
          type: 'system',
          message: 'Welcome to penguin bomberman'
        }
      )
    )

    socket.send(
      createPacket('players', webSocketHelper.getKeys())
    )
  })

  socket.addEventListener('close', () => {
    if (!validSession) return

    console.log(`${username} disconnected!`)
    webSocketHelper.remove(username)
    webSocketHelper.broadcast(createPacket('player_disconnect', username))
  })

  socket.addEventListener('message', (event) => {
    if (!validSession) return void
      console.log('client message', event.data)
    if (event.data === 'ping') {
      socket.send('pong')
    }

    try {
      const object = JSON.parse(event.data)
      const parsed = basePacket.parse(object)

      if (parsed.key === 'chat') {
        const { message } = inbound.chat.parse(parsed.data)
        console.log('chat:', parsed)

        webSocketHelper.broadcast(createPacket('chat', {
          type: 'player',
          origin: username,
          message: message
        }))
      } else if (parsed.key === 'invite') {
        const invitee = inbound.invite.parse(parsed.data)

        if (!invitee) {
          // invite all players
          const connections = webSocketHelper.getKeys([username])

          // inform sender
          socket.send(createPacket('invite_sent', connections))

          // inform receiver
          webSocketHelper.broadcast(createPacket('invite_received', [username]), [username])
        } else {
          // invite specific player

          // inform sender
          socket.send(createPacket('invite_sent', [invitee]))

          // inform receiver
          webSocketHelper.get(invitee).send(createPacket('invite_received', [username]))
        }
      } else if (parsed.key === 'invite_cancel') {
        // todo: inform invited players
        const player = inbound.invite_cancel.parse(parsed.data)

        // inform sender
        socket.send(createPacket('invite_cancel', [player]))

        // inform receiver
        webSocketHelper.get(player).send(createPacket('invite_revoke', [username]))
      }
      //
      //   if (parsed.key === 'set_username') {
      //     const result = inbound.set_username.safeParse(parsed.data)
      //     let response: z.infer<typeof outbound.set_username>
      //
      //     if (result.error) {
      //       response = { status: 400, error: 'Username does not meet the requirements' }
      //     } else {
      //       response = { status: 200 }
      //     }
      //
      //     socket.send(JSON.stringify(response))
      //   } else {
      //     // invalid/unhandled packet key
      //   }
    } catch (_) {
      //   // fatal error such as json.parse from client data
      //   return
    }
  })

  return response
})
