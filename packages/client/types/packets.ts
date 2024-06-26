import { z } from 'zod'

const regexp = {
  alphanumeric_nsp: /^\w+$/,
  alphanumeric: /^[\w ]+$/,
  chat: /^[\w ()!?:@{}|'"\-=_]+$/
}

const username = z.string().regex(regexp.alphanumeric_nsp, 'Your nickname must only contain alphanumeric characters')
export type TPlayerUsername = z.infer<typeof username>

const connection = z.object({
  username: username
})

const basePacket = z.object({
  // todo: make key based on 'outbound'/'inbound'
  key: z.string(), // alpha(non numeric)
  data: z.any()
})

// client to server
const inbound = {
  chat: z.object({
    message: z
      .string()
      .regex(regexp.chat, 'You are using illegal characters')
      .min(1, 'Message is too short')
      .max(255, 'Message is too long')
  }),
  invite: username.optional(),
  invite_cancel: username
}

// server to client
const outbound = {
  connect: z.object({
    status: z.literal(200)
  }),
  chat: z.object({
    type: z.enum(['system', 'player']),
    message: z.string(),
    origin: username.optional()
  }),
  players: z.array(username),
  player_connect: username,
  player_disconnect: username,
  invite_sent: z.array(username),
  invite_received: z.array(username),
  invite_cancel: z.array(username), // confirm that their own invite is canceled
  invite_revoke: z.array(username), // confirm that an incoming invite was canceled
}

export { basePacket, connection, inbound, outbound }
