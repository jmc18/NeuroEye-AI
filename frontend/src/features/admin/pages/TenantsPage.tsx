import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormField, formControlClassName } from '@components/forms'
import { PageHeader } from '@components/layout'
import { Button, DataTable, Dialog, Icon, StatusChip, type DataTableColumn } from '@components/ui'
import { adminService } from '@features/admin/services/adminService'
import type { TenantResponse } from '@api/generated/models'

export function TenantsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const tenantsQuery = useQuery({
    queryKey: ['admin', 'tenants'],
    queryFn: () => adminService.listTenants(),
  })

  const createMutation = useMutation({
    mutationFn: () => adminService.createTenant({ name }),
    onSuccess: async () => {
      setOpen(false)
      setName('')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] })
    },
  })

  const columns: DataTableColumn<TenantResponse>[] = [
    { id: 'name', header: t('admin.columns.tenant'), cell: (row) => row.name },
    {
      id: 'type',
      header: t('admin.columns.type'),
      cell: (row) => (
        <StatusChip
          label={row.is_system ? t('admin.systemTenant') : t('admin.clinicTenant')}
          tone={row.is_system ? 'info' : 'neutral'}
        />
      ),
    },
    {
      id: 'users',
      header: t('admin.columns.users'),
      mono: true,
      cell: (row) => String(row.user_count ?? 0),
    },
    {
      id: 'open',
      header: t('common.actions'),
      cell: () => (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          {t('admin.viewAccounts')}
          <Icon name="chevron_right" size={18} />
        </span>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title={t('admin.tenantsTitle')} description={t('admin.tenantsDescription')}>
        <Button icon="add_business" onClick={() => setOpen(true)}>
          {t('admin.newTenant')}
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={tenantsQuery.data?.items ?? []}
        getRowId={(row) => row.id}
        onRowClick={(row) =>
          void navigate({ to: '/admin/tenants/$tenantId', params: { tenantId: row.id } })
        }
        empty={tenantsQuery.isLoading ? t('common.loading') : t('admin.tenantsEmpty')}
      />

      <Dialog open={open} onClose={() => setOpen(false)} title={t('admin.createTenantTitle')}>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            createMutation.mutate()
          }}
        >
          <FormField id="tenant_name" label={t('admin.tenantName')}>
            <input
              id="tenant_name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
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
