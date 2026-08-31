import { useEffect, useRef } from 'react'

import { EyeTrackSocket, type GazeSocketMessage } from '@features/eyetracking/services/eyetrack.websocket'

export function useWebSocket(
  token: string | null,
  onMessage: (message: GazeSocketMessage) => void,
  enabled: boolean,
) {
  const socketRef = useRef<EyeTrackSocket | null>(null)

  useEffect(() => {
    if (!enabled || !token) {
      return
    }
    const socket = new EyeTrackSocket()
    socketRef.current = socket
    const unsubscribe = socket.subscribe(onMessage)
    socket.connect(token)
    return () => {
      unsubscribe()
      socket.close()
      socketRef.current = null
    }
  }, [token, enabled, onMessage])

  return {
    send: (payload: GazeSocketMessage) => socketRef.current?.send(payload),
    ready: () => socketRef.current?.ready ?? false,
  }
}
