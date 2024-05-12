import { z } from 'zod'
import { basePacket, inbound } from '~/types/mod.ts'

// names of possible packets
type InboundPacketKeys = keyof typeof inbound

function createPacket(
  name: InboundPacketKeys,
  payload: z.infer<typeof inbound[typeof name]>
): string {
  const packet: z.infer<typeof basePacket> = {
    key: name,
    data: payload
  }

  return JSON.stringify(packet)
}

export default createPacket
