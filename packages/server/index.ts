import { connection, /*inbound,*/ WebSocketCloseCodes } from '../client/types/mod.ts'
import createPacket from "./utils/create-packet.ts";

type TSocketConnections = {
  [key: string]: WebSocket
}
const connections: TSocketConnections = {}

Deno.serve({ port: 1337 }, (req) => {
  if (req.headers.get('upgrade') != 'websocket')
    return new Response(null, { status: 501 })

  const parseUsername = connection.safeParse({ username: new URL(req.url).searchParams.get('username') })

  // client should've already had their username validated
  if (!parseUsername.success)
    return new Response(null, { status: 401 })

  let validSession = false
  const isUsernameUnique = !Object.keys(connections).includes(parseUsername.data.username)

  const username = parseUsername.data.username
  const { socket, response } = Deno.upgradeWebSocket(req)

  socket.addEventListener('open', () => {
    if (!isUsernameUnique) {
      console.log(`user rejected, duplicate username`, WebSocketCloseCodes.DuplicateUsername)
      return socket.close(WebSocketCloseCodes.DuplicateUsername, `The name "${username}" is already taken`)
    }

    console.log(`${username} connected!`)
    connections[username] = socket
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
  })

  socket.addEventListener('close', () => {
    if (!validSession) return

    console.log(`${username} disconnected!`)
    delete connections[username]
  })

  socket.addEventListener('message', (event) => {
    if (!validSession) return void
      console.log('client message', event.data)
    if (event.data === 'ping') {
      socket.send('pong')
    }

    // try {
    //   const object = JSON.parse(event.data)
    //   const parsed = basePacket.parse(object)
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
    // } catch (_) {
    //   // fatal error such as json.parse from client data
    //   return
    // }
  })

  return response
})
