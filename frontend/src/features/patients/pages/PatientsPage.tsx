import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, DataTable, type DataTableColumn, Dialog, StatusChip } from '@components/ui'
import { FormField, formControlClassName } from '@components/forms'
import { PageHeader } from '@components/layout'
import { riskTone } from '@features/patients/lib/risk'
import { patientService } from '@features/patients/services/patientService'
import type { PatientResponse } from '@api/generated/models'

export function PatientsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const patientsQuery = useQuery({
    queryKey: ['patients', query],
    queryFn: () => patientService.list(query || undefined),
  })

  const createMutation = useMutation({
    mutationFn: () => patientService.create({ first_name: firstName, last_name: lastName }),
    onSuccess: async () => {
      setOpen(false)
      setFirstName('')
      setLastName('')
      await queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })

  const columns: DataTableColumn<PatientResponse>[] = [
    { id: 'id', header: t('patients.columns.id'), mono: true, cell: (row) => row.id.slice(0, 8) },
    { id: 'name', header: t('patients.columns.name'), cell: (row) => row.display_name },
    { id: 'email', header: t('patients.columns.email'), cell: (row) => row.email ?? '—' },
    {
      id: 'sessions',
      header: t('patients.columns.sessions'),
      mono: true,
      cell: (row) => String(row.session_count ?? 0),
    },
    {
      id: 'risk',
      header: t('patients.columns.risk'),
      cell: (row) => (
        <StatusChip
          label={t(`patients.risk.${row.risk_level as 'low' | 'moderate' | 'high' | 'critical'}`)}
          tone={riskTone(row.risk_level)}
        />
      ),
    },
    {
      id: 'session',
      header: t('common.actions'),
      cell: (row) => (
        <Button
          size="sm"
          icon="play_arrow"
          onClick={(event) => {
            event.stopPropagation()
            void navigate({
              to: '/eyetracking/session/$patientId',
              params: { patientId: row.id },
            })
          }}
        >
          {t('patients.startSession')}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title={t('patients.title')} description={t('patients.description')}>
        <Button icon="person_add" onClick={() => setOpen(true)}>
          {t('patients.newPatient')}
        </Button>
      </PageHeader>

      <div className="mb-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('patients.searchPlaceholder')}
          className={formControlClassName({ className: 'max-w-md' })}
        />
      </div>

      <DataTable
        columns={columns}
        data={patientsQuery.data?.items ?? []}
        getRowId={(row) => row.id}
        onRowClick={(row) =>
          void navigate({ to: '/patients/$patientId', params: { patientId: row.id } })
        }
        empty={patientsQuery.isLoading ? t('common.loading') : t('patients.empty')}
      />

      <Dialog open={open} onClose={() => setOpen(false)} title={t('patients.createTitle')}>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            createMutation.mutate()
          }}
        >
          <FormField id="first_name" label={t('patients.firstName')}>
            <input
              id="first_name"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={formControlClassName()}
            />
          </FormField>
          <FormField id="last_name" label={t('patients.lastName')}>
            <input
              id="last_name"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={formControlClassName()}
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
