import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { get_test_presets } from '@api/generated/sessions/sessions'
import { Button } from '@components/ui'
import { formControlClassName } from '@components/forms'
import { GazeCanvas } from '@features/eyetracking/components/GazeCanvas'
import { TelemetryPanel } from '@features/eyetracking/components/TelemetryPanel'
import { VideoPreview } from '@features/eyetracking/components/VideoPreview'
import { extractLandmarks, initFaceLandmarker } from '@features/eyetracking/services/mediapipe.service'
import type { GazeSocketMessage } from '@features/eyetracking/services/eyetrack.websocket'
import { useEyeTrackingStore } from '@features/eyetracking/store/eyeTrackingStore'
import { patientService } from '@features/patients/services/patientService'
import { useAuth } from '@hooks/useStore'
import { useCamera } from '@hooks/useCamera'
import { useWebSocket } from '@hooks/useWebSocket'

export function ScreeningSessionPage() {
  const { t } = useTranslation()
  const { patientId } = useParams({ from: '/_app/eyetracking/session_/$patientId' })
  const search = useSearch({ from: '/_app/eyetracking/session_/$patientId' })
  const { accessToken } = useAuth()
  const { videoRef, ready, error } = useCamera()
  const startedAt = useRef(performance.now())
  const lastTs = useRef(0)
  const frames = useRef(0)
  const fpsRef = useRef(0)
  const [presetId, setPresetId] = useState(search.presetId ?? '')
  const [streaming, setStreaming] = useState(false)

  const patientQuery = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientService.get(patientId),
  })
  const presetsQuery = useQuery({ queryKey: ['presets'], queryFn: () => get_test_presets() })

  const xNorm = useEyeTrackingStore((s) => s.xNorm)
  const yNorm = useEyeTrackingStore((s) => s.yNorm)
  const eyeDetected = useEyeTrackingStore((s) => s.eyeDetected)
  const fps = useEyeTrackingStore((s) => s.fps)
  const latencyMs = useEyeTrackingStore((s) => s.latencyMs)
  const stimulus = useEyeTrackingStore((s) => s.stimulus)
  const connected = useEyeTrackingStore((s) => s.connected)
  const sessionStatus = useEyeTrackingStore((s) => s.sessionStatus)

  const patientIdRef = useRef(patientId)
  const presetIdRef = useRef(presetId)
  patientIdRef.current = patientId
  presetIdRef.current = presetId
  const sendRef = useRef<(payload: GazeSocketMessage) => void>(() => undefined)

  const onMessage = useCallback((message: GazeSocketMessage) => {
    const type = message.type
    if (type === 'ready') {
      useEyeTrackingStore.getState().setConnected(true)
      sendRef.current({
        type: 'session.start',
        patient_id: patientIdRef.current,
        preset_id: presetIdRef.current,
      })
    }
    if (type === 'gaze') {
      useEyeTrackingStore.getState().setGaze({
        x_norm: Number(message.x_norm),
        y_norm: Number(message.y_norm),
        eye_detected: Boolean(message.eye_detected),
        fps: Number(message.fps),
        latency_ms: Number(message.latency_ms ?? 0),
        quality: Number(message.quality ?? 0),
      })
    }
    if (type === 'stimulus') {
      useEyeTrackingStore.getState().setStimulus({
        phase: String(message.phase ?? 'target'),
        x: Number(message.x),
        y: Number(message.y),
      })
    }
    if (type === 'session.started') {
      useEyeTrackingStore.getState().setSession(String(message.session_id), 'running')
    }
    if (type === 'session.ended') {
      useEyeTrackingStore.getState().setSession(String(message.session_id), 'ended')
      setStreaming(false)
    }
  }, [])

  const { send } = useWebSocket(accessToken, onMessage, streaming)
  sendRef.current = send

  useEffect(() => {
    if (!streaming) {
      return
    }
    void initFaceLandmarker()
    let raf = 0
    const loop = (now: number) => {
      frames.current += 1
      if (now - lastTs.current >= 1000) {
        fpsRef.current = frames.current
        frames.current = 0
        lastTs.current = now
      }
      const video = videoRef.current
      if (video && video.readyState >= 2) {
        const landmarks = extractLandmarks(video, now)
        send({
          type: 'landmarks',
          t_ms: Math.round(now - startedAt.current),
          fps: fpsRef.current,
          client_ts: Date.now(),
          ...landmarks,
        })
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [send, streaming, videoRef])

  const canStart = useMemo(
    () => Boolean(patientId && presetId && ready && accessToken && patientQuery.data),
    [patientId, presetId, ready, accessToken, patientQuery.data],
  )

  const start = () => {
    useEyeTrackingStore.getState().reset()
    setStreaming(true)
  }

  const end = (abort = false) => {
    send({ type: abort ? 'session.abort' : 'session.end' })
    setStreaming(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:p-6">
      <section className="relative min-h-[420px] flex-1 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
        <VideoPreview ref={videoRef} className="size-full object-cover opacity-80" />
        <GazeCanvas xNorm={xNorm} yNorm={yNorm} stimulus={stimulus} />
        {error ? (
          <p className="absolute inset-x-0 bottom-4 text-center text-sm text-error">
            {t('eyetracking.cameraError')}
          </p>
        ) : null}
      </section>

      <div className="flex w-full flex-col gap-3 lg:w-80">
        <div className="space-y-2 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant">
              {t('eyetracking.selectPatient')}
            </p>
            {patientQuery.isLoading ? (
              <p className="mt-1 text-sm text-on-surface-variant">{t('common.loading')}</p>
            ) : patientQuery.data ? (
              <p className="mt-1 font-semibold text-on-surface">{patientQuery.data.display_name}</p>
            ) : (
              <p className="mt-1 text-sm text-error">{t('eyetracking.patientMissing')}</p>
            )}
            <Link
              to="/patients/$patientId"
              params={{ patientId }}
              className="mt-1 inline-block text-xs text-primary hover:underline"
            >
              {t('eyetracking.backToPatient')}
            </Link>
          </div>
          <label className="block text-xs uppercase tracking-widest text-on-surface-variant">
            {t('eyetracking.selectPreset')}
            <select
              className={formControlClassName({ className: 'mt-1' })}
              value={presetId}
              disabled={streaming}
              onChange={(event) => setPresetId(event.target.value)}
            >
              <option value="">{t('eyetracking.selectPreset')}</option>
              {(presetsQuery.data ?? []).map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" disabled={!canStart || streaming} onClick={start}>
              {t('eyetracking.start')}
            </Button>
            <Button variant="secondary" disabled={!streaming} onClick={() => end(false)}>
              {t('eyetracking.end')}
            </Button>
            <Button variant="destructive" disabled={!streaming} onClick={() => end(true)}>
              {t('eyetracking.abort')}
            </Button>
          </div>
          <p className="font-data-mono text-xs text-on-surface-variant">{sessionStatus}</p>
        </div>
        <TelemetryPanel
          fps={fps}
          latencyMs={latencyMs}
          eyeDetected={eyeDetected}
          connected={connected}
          xNorm={xNorm}
          yNorm={yNorm}
        />
      </div>
    </div>
  )
}
