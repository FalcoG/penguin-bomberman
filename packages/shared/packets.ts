import { z } from 'zod'

const zod_alphanumeric = z.string().regex(/^\w+$/)

const basePacket = z.object({
  key: z.string(), // alpha(non numeric)
  data: z.any()
})

const setUserName = z.object({
  name: zod_alphanumeric
})

const setUserNameResponse = z.object({
  status: z.union([z.literal(200), z.literal(400)]),
  error: z.union([z.string().optional(), z.literal(-1)]),
})

// client to server
const inbound = {
  set_username: setUserName
}

// server to client
const outbound = {
  set_username: setUserNameResponse
}

export { basePacket, inbound, outbound }
