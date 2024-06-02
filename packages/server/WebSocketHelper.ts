type TConnectionKey = string
type TConnections = {
  [key: TConnectionKey]: WebSocket
}

class WebSocketHelper {
  #connections: TConnections = {}

  add(key: TConnectionKey, socket: WebSocket) {
    this.#connections[key] = socket
  }

  get(key: TConnectionKey): WebSocket {
    return this.#connections[key]
  }

  remove(key: TConnectionKey) {
    delete this.#connections[key]
  }

  getKeys(exclude: TConnectionKey[] = []) {
    return Object.keys(this.#connections).filter(connection => !exclude.includes(connection))
  }

  broadcast(packet: string, exclude: string[] = []) {
    const recipients = this.getKeys(exclude)

    recipients.forEach(recipient => {
      this.get(recipient).send(packet)
    })
  }
}

export default WebSocketHelper
