import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { get_session_report } from '@api/generated/sessions/sessions'
import { PageHeader } from '@components/layout'
import { Card, KpiCard, StatusChip } from '@components/ui'
import { riskTone } from '@features/patients/lib/risk'

export function DiagnosticReportPage() {
  const { t } = useTranslation()
  const { sessionId } = useParams({ from: '/_app/reports/$sessionId' })
  const reportQuery = useQuery({
    queryKey: ['report', sessionId],
    queryFn: () => get_session_report(sessionId),
  })

  const report = reportQuery.data
  const metrics = report?.metrics ?? report?.session.metrics

  return (
    <div className="space-y-6">
      <PageHeader title={t('reports.title')} description={t('reports.description')} />
      {!report ? (
        <p className="text-on-surface-variant">{t('common.loading')}</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-on-surface">
              {t('reports.patient')}: <strong>{report.session.patient_name}</strong>
            </p>
            <p className="text-on-surface-variant">
              {t('reports.protocol')}: {report.session.preset_name}
            </p>
            {metrics ? (
              <StatusChip
                label={t(`patients.risk.${metrics.risk_level as 'low' | 'moderate' | 'high' | 'critical'}`)}
                tone={riskTone(metrics.risk_level)}
              />
            ) : null}
          </div>

          {metrics ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KpiCard label={t('reports.sampleCount')} value={metrics.sample_count} />
              <KpiCard label={t('reports.meanFps')} value={metrics.mean_fps.toFixed(1)} />
              <KpiCard
                label={t('reports.detectionRate')}
                value={`${Math.round(metrics.detection_rate * 100)}%`}
              />
              <KpiCard label={t('reports.fixation')} value={metrics.fixation_stability.toFixed(3)} />
              <KpiCard label={t('reports.saccade')} value={metrics.saccade_amplitude.toFixed(3)} />
              <KpiCard label={t('reports.latency')} value={`${metrics.mean_latency_ms.toFixed(0)} ms`} />
            </div>
          ) : null}

          <Card>
            <p className="text-label-caps uppercase tracking-widest text-on-surface-variant">
              {t('reports.disclaimer')}
            </p>
            <p className="mt-3 text-sm text-on-surface-variant">{report.disclaimer}</p>
          </Card>
        </>
      )}
    </div>
  )
}
