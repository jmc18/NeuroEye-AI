import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { get_dashboard_summary, get_sessions } from '@api/generated/sessions/sessions'
import { PageHeader } from '@components/layout'
import { Button, Card, KpiCard, StatusChip } from '@components/ui'
import { ROUTES } from '@config'
import { riskTone } from '@features/patients/lib/risk'

export function DashboardPage() {
  const { t } = useTranslation()
  const summaryQuery = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => get_dashboard_summary(),
  })
  const sessionsQuery = useQuery({
    queryKey: ['sessions', 'recent'],
    queryFn: () => get_sessions({ page: 1, page_size: 6 }),
  })

  const summary = summaryQuery.data

  return (
    <div className="space-y-6">
      <PageHeader title={t('app.dashboard.title')} description={t('app.dashboard.description')}>
        <Link to={ROUTES.app.patients}>
          <Button icon="play_arrow">{t('common.startNewSession')}</Button>
        </Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={t('app.dashboard.patients')} value={summary?.patient_count ?? '—'} />
        <KpiCard label={t('app.dashboard.sessions')} value={summary?.session_count ?? '—'} />
        <KpiCard label={t('app.dashboard.completed')} value={summary?.completed_session_count ?? '—'} />
        <KpiCard label={t('app.dashboard.atRisk')} value={summary?.at_risk_count ?? '—'} />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-headline-sm text-on-surface">{t('app.dashboard.recentSessions')}</h2>
          <Link to={ROUTES.app.sessions} className="text-sm text-primary hover:underline">
            {t('app.dashboard.viewAll')}
          </Link>
        </div>
        <ul className="divide-y divide-outline-variant/30">
          {(sessionsQuery.data?.items ?? []).map((session) => (
            <li key={session.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-on-surface">{session.patient_name}</p>
                <p className="font-data-mono text-xs text-on-surface-variant">
                  {session.preset_name} · {session.status}
                </p>
              </div>
              {session.metrics ? (
                <StatusChip
                  label={t(
                    `patients.risk.${session.metrics.risk_level as 'low' | 'moderate' | 'high' | 'critical'}`,
                  )}
                  tone={riskTone(session.metrics.risk_level)}
                />
              ) : null}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
