import { create } from 'zustand'

export type StimulusState = {
  phase: string
  x: number
  y: number
} | null

export type GazeLogEntry = {
  t: number
  x_norm: number
  y_norm: number
  eye_detected: boolean
}

type EyeTrackingState = {
  xNorm: number
  yNorm: number
  eyeDetected: boolean
  fps: number
  latencyMs: number
  quality: number
  sessionStatus: 'idle' | 'connecting' | 'running' | 'ended'
  sessionId: string | null
  stimulus: StimulusState
  connected: boolean
  logBuffer: GazeLogEntry[]
  setGaze: (payload: {
    x_norm: number
    y_norm: number
    eye_detected: boolean
    fps: number
    latency_ms?: number
    quality?: number
  }) => void
  setStimulus: (stimulus: StimulusState) => void
  setSession: (sessionId: string | null, status: EyeTrackingState['sessionStatus']) => void
  setConnected: (connected: boolean) => void
  reset: () => void
}

const initial = {
  xNorm: 0.5,
  yNorm: 0.5,
  eyeDetected: false,
  fps: 0,
  latencyMs: 0,
  quality: 0,
  sessionStatus: 'idle' as const,
  sessionId: null,
  stimulus: null,
  connected: false,
  logBuffer: [] as GazeLogEntry[],
}

export const useEyeTrackingStore = create<EyeTrackingState>((set) => ({
  ...initial,
  setGaze: (payload) =>
    set((state) => ({
      xNorm: payload.x_norm,
      yNorm: payload.y_norm,
      eyeDetected: payload.eye_detected,
      fps: payload.fps,
      latencyMs: payload.latency_ms ?? state.latencyMs,
      quality: payload.quality ?? state.quality,
      logBuffer: [
        ...state.logBuffer.slice(-600),
        {
          t: Date.now(),
          x_norm: payload.x_norm,
          y_norm: payload.y_norm,
          eye_detected: payload.eye_detected,
        },
      ],
    })),
  setStimulus: (stimulus) => set({ stimulus }),
  setSession: (sessionId, sessionStatus) => set({ sessionId, sessionStatus }),
  setConnected: (connected) => set({ connected }),
  reset: () => set(initial),
}))
