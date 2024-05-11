import InputFieldDescription from '~/components/form/InputFieldDescription.tsx'
import InputFieldError from '~/components/form/InputFieldError.tsx'
import { basePacket, connection as connectionPacket, outbound } from '~/types/packets.ts'
import { useState, useContext, useCallback, useRef } from 'react'
import z, { ZodError } from 'zod'
import WebSocketContext from '~/lib/context/WebSocketContext.ts'
import { WebSocketCloseCodes } from '~/types/websockets.ts'

const PreflightForm = () => {
  const connection = useRef<WebSocket | undefined>(undefined)
  const {
    webSocket,
    setWebSocket
  } = useContext(WebSocketContext)

  const handleValidUsername = useCallback(({ username }: z.infer<typeof connectionPacket>) => {
    if (connection.current || setWebSocket === undefined || webSocket) return

    const conn = new WebSocket(`ws://localhost:1337/join?username=${username}`)

    conn.onerror = () => {
      setError(new Error('The game service is unresponsive'))

      connection.current = undefined
    }
    conn.onopen = (e) => {
      console.log('n-err??', e)
      setError(null)
    }
    conn.onclose = (e) => {
      console.log('closed by remote', e)
      if (e.code === WebSocketCloseCodes.DuplicateUsername) {
        setError(new Error(`The name <b>"${username}"</b> is already being used`))
      } else {
        setError(new Error(`Game service unavailable`))
      }

      connection.current = undefined
    }
    conn.onmessage = (e) => {
      const object = JSON.parse(e.data)
      const parsed = basePacket.parse(object)

      if (parsed.key === 'connect') {
        const { status } = outbound.connect.parse(parsed.data)

        if (status === 200) setWebSocket(conn)
      }
    }

    connection.current = conn
  }, [setWebSocket, webSocket])


  const [error, setError] = useState<Error | ZodError | null>(null)
  return <form
    onSubmit={(e) => {
      e.preventDefault()

      const items = Object.fromEntries(new FormData(e.currentTarget).entries())
      const parse = connectionPacket.safeParse(items)

      if (parse.error) {
        setError(parse.error)
      } else {
        setError(null)
        handleValidUsername(parse.data)
      }
    }}
  >
    <label htmlFor="username">
      Nickname
    </label>
    <InputFieldDescription>
      This is the name that other players will see
    </InputFieldDescription>
    <input type="text" id="username" name="username"/>
    {` `}
    <button>Join lobby</button>
    {error && <InputFieldError>{error.message}</InputFieldError>}
  </form>
}

export default PreflightForm
