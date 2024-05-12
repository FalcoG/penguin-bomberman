import InputFieldDescription from '~/components/form/InputFieldDescription.tsx'
import InputFieldError from '~/components/form/InputFieldError.tsx'
import { connection as connectionPacket } from '~/types/packets.ts'
import { useState, useContext, useCallback, useEffect } from 'react'
import z, { ZodError } from 'zod'
import WebSocketContext from '~/lib/context/WebSocketContext.ts'
import { WebSocketCloseCodes } from '~/types/websockets.ts'

const PreflightForm = () => {
  const {
    webSocket,
    setWebSocket
  } = useContext(WebSocketContext)

  const handleValidUsername = useCallback(({ username }: z.infer<typeof connectionPacket>) => {
    if (setWebSocket === undefined || webSocket) return

    const conn = new WebSocket(`ws://localhost:1337/join?username=${username}`)
    setWebSocket(conn)
  }, [setWebSocket, webSocket])

  useEffect(() => {
    if (!webSocket) return

    const onError = () => {
      setError(new Error('The game service is unresponsive'))
    }

    const onOpen = (e: WebSocketEventMap['open']) => {
      console.log('websocket connection opened', e)
      setError(null)
    }

    const onClose = (e: WebSocketEventMap['close']) => {
      console.log('closed by remote', e)
      if (e.code === WebSocketCloseCodes.DuplicateUsername) {
        setError(new Error(e.reason))
      } else {
        setError(new Error(`Game service unavailable`))
      }
    }

    webSocket.addEventListener('open', onOpen)
    webSocket.addEventListener('close', onClose)
    webSocket.addEventListener('error', onError)

    return () => {
      webSocket.removeEventListener('open', onOpen)
      webSocket.removeEventListener('close', onClose)
      webSocket.removeEventListener('error', onError)
    }
  }, [webSocket])

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
