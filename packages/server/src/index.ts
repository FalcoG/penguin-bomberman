import { z } from 'zod'

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
  })

  return response
})
