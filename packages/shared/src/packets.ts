import { z } from 'zod'

export const connect = z.object({
  name: z.string()
})
