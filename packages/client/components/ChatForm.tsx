import { useContext, useState } from 'react'
import { ZodError } from 'zod'
import InputFieldError from '~/components/form/InputFieldError.tsx'
import { inbound } from '~/types/packets.ts'
import WebSocketContext from '~/lib/context/WebSocketContext.ts'
import createPacket from '~/lib/utils/create-packet.ts'

const ChatForm = () => {
  const { webSocket } = useContext(WebSocketContext)
  const [error, setError] = useState<Error | ZodError | null>(null)

  return <form
    onSubmit={(e) => {
      e.preventDefault()

      if (!webSocket) return

      const items = Object.fromEntries(new FormData(e.currentTarget).entries())
      const parse = inbound.chat.safeParse(items)

      if (parse.error) {
        setError(parse.error)
      } else {
        setError(null)
        webSocket.send(createPacket('chat', parse.data))
        e.currentTarget.reset()
      }
    }}
  >
    <label htmlFor="message">
      Message
    </label>
    <input type="text" id="message" name="message"/>
    {` `}
    <button>Send</button>
    {error && <InputFieldError>{error.message}</InputFieldError>}
  </form>


}

export default ChatForm
