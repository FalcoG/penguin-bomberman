import { z } from 'zod'
import { basePacket, outbound } from '../../client/types/mod.ts'

// names of possible packets
type OutboundPacketKeys = keyof typeof outbound

function createPacket(
  name: OutboundPacketKeys,
  payload: z.infer<typeof outbound[typeof name]>
): string {
  const packet: z.infer<typeof basePacket> = {
    key: name,
    data: payload
  }

  return JSON.stringify(packet)
}

export default createPacket
