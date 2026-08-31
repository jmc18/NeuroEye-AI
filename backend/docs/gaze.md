# Hybrid gaze pipeline

Live eye tracking uses a **hot path** (WebSocket) and a **cold path** (post-session metrics).

## Hot path

1. The browser captures the camera (`useCamera`).
2. MediaPipe Face Landmarker runs in the client (`@mediapipe/tasks-vision`).
3. Compact landmarks (iris centers + eye corners) are sent over `WS /api/v1/ws/eyetrack?token=<jwt>`.
4. `app.vision.gaze.gaze_from_landmarks` computes `x_norm` / `y_norm`.
5. The API streams gaze JSON back and batches `gaze_samples` to PostgreSQL.

Video never leaves the device. Queues are **not** used on this path (latency budget &lt; 50 ms).

### Client → server

- `{ "type": "session.start", "patient_id", "preset_id" }`
- `{ "type": "landmarks", "t_ms", "fps", "client_ts", "face_detected", "iris_l", "iris_r", "eye_corners" }`
- `{ "type": "session.end" }` / `{ "type": "session.abort" }`

### Server → client

- `{ "type": "ready" }`
- `{ "type": "gaze", "x_norm", "y_norm", "eye_detected", "fps", "quality", "latency_ms" }`
- `{ "type": "stimulus", "phase", "x", "y" }`
- `{ "type": "session.started" | "session.ended" }`

## Cold path

On `session.end`, `asyncio.create_task` runs `MetricsService.compute_for_session` with a new Unit of Work. Aggregates (FPS, detection rate, fixation stability, saccade amplitude, risk level) are stored in `session_metrics`.
