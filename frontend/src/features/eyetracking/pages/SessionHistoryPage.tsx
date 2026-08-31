import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { get_sessions } from '@api/generated/sessions/sessions'
import type { SessionResponse } from '@api/generated/models'
import { PageHeader } from '@components/layout'
import { DataTable, type DataTableColumn, StatusChip } from '@components/ui'
import { riskTone } from '@features/patients/lib/risk'

export function SessionHistoryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: () => get_sessions({ page: 1, page_size: 50 }),
  })

  const columns: DataTableColumn<SessionResponse>[] = [
    { id: 'id', header: 'ID', mono: true, cell: (row) => row.id.slice(0, 8) },
    { id: 'patient', header: t('reports.patient'), cell: (row) => row.patient_name },
    { id: 'preset', header: t('reports.protocol'), cell: (row) => row.preset_name },
    {
      id: 'status',
      header: t('common.actions'),
      cell: (row) => (
        <StatusChip
          label={t(`eyetracking.status.${row.status as 'pending' | 'running' | 'completed' | 'aborted'}`)}
          tone={row.status === 'completed' ? 'success' : row.status === 'aborted' ? 'critical' : 'info'}
        />
      ),
    },
    {
      id: 'risk',
      header: t('patients.columns.risk'),
      cell: (row) =>
        row.metrics ? (
          <StatusChip
            label={t(`patients.risk.${row.metrics.risk_level as 'low' | 'moderate' | 'high' | 'critical'}`)}
            tone={riskTone(row.metrics.risk_level)}
          />
        ) : (
          '—'
        ),
    },
  ]

  return (
    <div>
      <PageHeader title={t('eyetracking.historyTitle')} description={t('eyetracking.historyDescription')} />
      <DataTable
        columns={columns}
        data={sessionsQuery.data?.items ?? []}
        getRowId={(row) => row.id}
        onRowClick={(row) => void navigate({ to: '/reports/$sessionId', params: { sessionId: row.id } })}
        empty={sessionsQuery.isLoading ? t('common.loading') : t('eyetracking.empty')}
      />
    </div>
  )
}
