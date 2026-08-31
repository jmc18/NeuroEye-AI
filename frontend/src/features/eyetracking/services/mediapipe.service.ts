import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export type CompactLandmarks = {
  face_detected: boolean
  iris_l: { x: number; y: number } | null
  iris_r: { x: number; y: number } | null
  eye_corners: {
    left_outer: { x: number; y: number }
    left_inner: { x: number; y: number }
    right_inner: { x: number; y: number }
    right_outer: { x: number; y: number }
  } | null
}

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

let landmarker: FaceLandmarker | null = null
let initFailed = false

function point(landmarks: Array<{ x: number; y: number }>, index: number) {
  const item = landmarks[index]
  if (!item) {
    return { x: 0.5, y: 0.5 }
  }
  return { x: item.x, y: item.y }
}

export async function initFaceLandmarker(): Promise<boolean> {
  if (landmarker) {
    return true
  }
  if (initFailed) {
    return false
  }
  try {
    const fileset = await FilesetResolver.forVisionTasks(WASM_URL)
    landmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL },
      runningMode: 'VIDEO',
      numFaces: 1,
    })
    return true
  } catch {
    initFailed = true
    return false
  }
}

export function extractLandmarks(video: HTMLVideoElement, timestampMs: number): CompactLandmarks {
  if (!landmarker) {
    return { face_detected: false, iris_l: null, iris_r: null, eye_corners: null }
  }

  const result = landmarker.detectForVideo(video, timestampMs)
  const face = result.faceLandmarks[0]
  if (!face) {
    return { face_detected: false, iris_l: null, iris_r: null, eye_corners: null }
  }

  return {
    face_detected: true,
    iris_l: point(face, 468),
    iris_r: point(face, 473),
    eye_corners: {
      left_outer: point(face, 33),
      left_inner: point(face, 133),
      right_inner: point(face, 362),
      right_outer: point(face, 263),
    },
  }
}
