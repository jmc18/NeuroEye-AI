import { ENV } from '@config'

export type GazeSocketMessage = Record<string, unknown>

type Listener = (message: GazeSocketMessage) => void

export class EyeTrackSocket {
  private socket: WebSocket | null = null
  private listeners = new Set<Listener>()
  private token = ''

  connect(token: string): void {
    this.token = token
    this.open()
  }

  private open(): void {
    const url = `${ENV.wsUrl}/api/v1/ws/eyetrack?token=${encodeURIComponent(this.token)}`
    this.socket = new WebSocket(url)
    this.socket.addEventListener('message', (event) => {
      try {
        const payload = JSON.parse(event.data) as GazeSocketMessage
        this.listeners.forEach((listener) => listener(payload))
      } catch {
        // Ignore malformed frames.
      }
    })
    this.socket.addEventListener('close', () => {
      this.socket = null
    })
  }

  send(payload: GazeSocketMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload))
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  close(): void {
    this.socket?.close()
    this.socket = null
  }

  get ready(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }
}

export const eyeTrackSocket = new EyeTrackSocket()
