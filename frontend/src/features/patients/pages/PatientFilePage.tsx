import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button, Card, StatusChip } from '@components/ui'
import { PageHeader } from '@components/layout'
import { riskTone } from '@features/patients/lib/risk'
import { patientService } from '@features/patients/services/patientService'
import { get_sessions } from '@api/generated/sessions/sessions'

export function PatientFilePage() {
  const { t } = useTranslation()
  const { patientId } = useParams({ from: '/_app/patients_/$patientId' })

  const patientQuery = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientService.get(patientId),
  })

  const sessionsQuery = useQuery({
    queryKey: ['sessions', patientId],
    queryFn: () => get_sessions({ patient_id: patientId, page: 1, page_size: 10 }),
  })

  const patient = patientQuery.data

  if (patientQuery.isLoading) {
    return <p className="text-on-surface-variant">{t('common.loading')}</p>
  }

  if (!patient) {
    return <p className="text-error">{t('patients.empty')}</p>
  }

  return (
    <div className="space-y-6">
      <PageHeader title={patient.display_name} description={t('patients.fileTitle')}>
        <Link
          to="/eyetracking/session/$patientId"
          params={{ patientId: patient.id }}
          className="inline-flex"
        >
          <Button icon="play_arrow">{t('patients.startSession')}</Button>
        </Link>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <p className="text-label-caps uppercase tracking-widest text-on-surface-variant">
            {t('patients.vitals')}
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">{t('common.email')}</dt>
              <dd>{patient.email ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">{t('patients.phone')}</dt>
              <dd>{patient.phone_number ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">{t('patients.birthDate')}</dt>
              <dd className="font-data-mono">{patient.birth_date ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">{t('patients.columns.risk')}</dt>
              <dd>
                <StatusChip
                  label={t(`patients.risk.${patient.risk_level as 'low' | 'moderate' | 'high' | 'critical'}`)}
                  tone={riskTone(patient.risk_level)}
                />
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <p className="text-label-caps uppercase tracking-widest text-on-surface-variant">
            {t('patients.notes')}
          </p>
          <p className="mt-3 text-sm text-on-surface-variant">{patient.notes ?? '—'}</p>
        </Card>
      </div>

      <Card>
        <p className="mb-4 text-label-caps uppercase tracking-widest text-on-surface-variant">
          {t('patients.sessionHistory')}
        </p>
        <ul className="space-y-2">
          {(sessionsQuery.data?.items ?? []).map((session) => (
            <li key={session.id} className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2">
              <span className="font-data-mono text-sm">{session.preset_name}</span>
              <Link
                to="/reports/$sessionId"
                params={{ sessionId: session.id }}
                className="text-sm text-primary hover:underline"
              >
                {t('eyetracking.openReport')}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
