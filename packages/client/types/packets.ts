import { z } from 'zod'

const regexp = {
  alphanumeric: /^\w+$/,
}

const username = z.string().regex(regexp.alphanumeric, 'Your nickname must only contain alphanumeric characters')

const connection = z.object({
  username: username
})

const basePacket = z.object({
  // todo: make key based on 'outbound'/'inbound'
  key: z.string(), // alpha(non numeric)
  data: z.any()
})

// client to server
const inbound = {}

// server to client
const outbound = {
  connect: z.object({
    status: z.literal(200)
  }),
  chat: z.object({
    type: z.enum(['system', 'player']),
    message: z.string()
  }),
  players: z.array(username),
  player_connect: username,
  player_disconnect: username,
}

export { basePacket, connection, inbound, outbound }
