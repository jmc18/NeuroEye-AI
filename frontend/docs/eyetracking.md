# Eye-tracking client

The screening page (`features/eyetracking`) runs MediaPipe in the browser and streams compact landmarks to `WS {VITE_API_URL → ws}/api/v1/ws/eyetrack?token=`.

See `backend/docs/gaze.md` for the JSON contract.

Optional env:

```
VITE_WS_URL=ws://localhost:8000
```

If omitted, the client derives the WebSocket origin from `VITE_API_URL`.
