import { useTranslation } from 'react-i18next'

import { Card, StatusChip } from '@components/ui'

type TelemetryPanelProps = {
  fps: number
  latencyMs: number
  eyeDetected: boolean
  connected: boolean
  xNorm: number
  yNorm: number
}

export function TelemetryPanel({
  fps,
  latencyMs,
  eyeDetected,
  connected,
  xNorm,
  yNorm,
}: TelemetryPanelProps) {
  const { t } = useTranslation()

  return (
    <aside className="flex w-full flex-col gap-3 lg:w-80">
      <Card>
        <p className="text-label-caps uppercase tracking-widest text-on-surface-variant">
          {t('eyetracking.telemetry')}
        </p>
        <dl className="mt-4 space-y-3 font-data-mono text-sm">
          <div className="flex justify-between">
            <dt>{t('eyetracking.fps')}</dt>
            <dd>{fps.toFixed(1)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{t('eyetracking.latency')}</dt>
            <dd>{latencyMs.toFixed(0)} ms</dd>
          </div>
          <div className="flex justify-between">
            <dt>{t('eyetracking.gaze')}</dt>
            <dd>
              {xNorm.toFixed(2)}, {yNorm.toFixed(2)}
            </dd>
          </div>
        </dl>
      </Card>
      <Card className="flex items-center justify-between">
        <span className="text-sm">{t('eyetracking.progress')}</span>
        <StatusChip
          label={eyeDetected ? t('eyetracking.eyeDetected') : t('eyetracking.eyeLost')}
          tone={eyeDetected ? 'success' : 'critical'}
          pulse
        />
      </Card>
      <Card>
        <StatusChip
          label={connected ? t('eyetracking.connected') : t('eyetracking.disconnected')}
          tone={connected ? 'success' : 'warning'}
          pulse={connected}
        />
      </Card>
    </aside>
  )
}
