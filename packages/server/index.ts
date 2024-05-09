import { z } from 'zod'
import { basePacket, inbound, outbound } from '../shared/mod.ts'

const User = z.object({
  username: z.string(),
})

console.log(User.parse({ username: 'Mario' }))

Deno.serve((req) => {
  if (req.headers.get('upgrade') != 'websocket') {
    return new Response(null, { status: 501 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)

  socket.addEventListener('open', () => {
    console.log('a client connected!')
  })

  socket.addEventListener('close', () => {
    console.log('a client disconnected!')
  })

  socket.addEventListener('message', (event) => {
    console.log('client message', event.data)
    if (event.data === 'ping') {
      socket.send('pong')
    }

    try {
      const object = JSON.parse(event.data)
      const parsed = basePacket.parse(object)

      if (parsed.key === 'set_username') {
        const result = inbound.set_username.safeParse(parsed.data)
        let response: z.infer<typeof outbound.set_username>

        if (result.error) {
          response = { status: 400, error: 'Username does not meet the requirements' }
        } else {
          response = { status: 200 }
        }

        socket.send(JSON.stringify(response))
      } else {
        // invalid/unhandled packet key
      }
    } catch (_) {
      // fatal error such as json.parse from client data
      return
    }
  })

  return response
})
