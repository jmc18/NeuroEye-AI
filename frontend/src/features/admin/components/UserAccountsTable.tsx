import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormField, PasswordInput, formControlClassName } from '@components/forms'
import { Button, DataTable, Dialog, StatusChip, type DataTableColumn } from '@components/ui'
import { adminService } from '@features/admin/services/adminService'
import { ROUTES } from '@config'
import { useAuth } from '@hooks/useStore'
import { toast } from '@shared/notifications'
import type { AdminUserResponse } from '@api/generated/models'

function roleLabel(
  t: ReturnType<typeof useTranslation>['t'],
  role: string,
): string {
  if (role === 'clinician' || role === 'super_admin' || role === 'researcher') {
    return t(`app.profile.roles.${role}`)
  }
  return role
}

type UserAccountsTableProps = {
  users: AdminUserResponse[]
  empty: string
  showTenant?: boolean
}

export function UserAccountsTable({ users, empty, showTenant = false }: UserAccountsTableProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { startImpersonation } = useAuth()
  const [passwordUser, setPasswordUser] = useState<AdminUserResponse | null>(null)
  const [password, setPassword] = useState('')
  const [resetToken, setResetToken] = useState<string | null>(null)

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin'] })
  }

  const impersonateMutation = useMutation({
    mutationFn: (userId: string) => adminService.impersonate(userId),
    onSuccess: (session) => {
      startImpersonation(session)
      toast.success(t('admin.impersonationStarted'))
      void navigate({ to: ROUTES.app.dashboard })
    },
  })

  const passwordMutation = useMutation({
    mutationFn: () => adminService.setPassword(passwordUser!.id, password),
    onSuccess: async () => {
      setPasswordUser(null)
      setPassword('')
      toast.success(t('admin.passwordSet'))
      await invalidate()
    },
  })

  const resetMutation = useMutation({
    mutationFn: (userId: string) => adminService.sendReset(userId),
    onSuccess: (result) => {
      toast.success(t('admin.resetSent'))
      if (result.reset_token) {
        setResetToken(result.reset_token)
      }
    },
  })

  const toggleMutation = useMutation({
    mutationFn: (row: AdminUserResponse) =>
      adminService.updateUser(row.id, { is_active: !row.is_active }),
    onSuccess: async () => {
      await invalidate()
    },
  })

  const columns: DataTableColumn<AdminUserResponse>[] = [
    { id: 'name', header: t('admin.columns.name'), cell: (row) => row.name },
    { id: 'email', header: t('admin.columns.email'), mono: true, cell: (row) => row.email },
    {
      id: 'role',
      header: t('admin.columns.role'),
      cell: (row) => roleLabel(t, row.role),
    },
    ...(showTenant
      ? [
          {
            id: 'tenant',
            header: t('admin.columns.tenant'),
            cell: (row: AdminUserResponse) => row.tenant_name,
          },
        ]
      : []),
    {
      id: 'status',
      header: t('admin.columns.status'),
      cell: (row) => (
        <StatusChip
          label={row.is_active ? t('admin.active') : t('admin.inactive')}
          tone={row.is_active ? 'success' : 'neutral'}
        />
      ),
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: (row) => (
        <div className="flex flex-wrap gap-1" onClick={(event) => event.stopPropagation()}>
          <Button
            size="sm"
            variant="secondary"
            disabled={!row.is_active || impersonateMutation.isPending}
            onClick={() => impersonateMutation.mutate(row.id)}
          >
            {t('admin.impersonate')}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setPasswordUser(row)}>
            {t('admin.setPassword')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={resetMutation.isPending}
            onClick={() => resetMutation.mutate(row.id)}
          >
            {t('admin.sendReset')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={toggleMutation.isPending}
            onClick={() => toggleMutation.mutate(row)}
          >
            {row.is_active ? t('admin.deactivate') : t('admin.activate')}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={users} getRowId={(row) => row.id} empty={empty} />

      <Dialog
        open={Boolean(passwordUser)}
        onClose={() => setPasswordUser(null)}
        title={t('admin.setPasswordTitle')}
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            passwordMutation.mutate()
          }}
        >
          <p className="text-sm text-on-surface-variant">{passwordUser?.email}</p>
          <FormField id="admin_password" label={t('admin.newPassword')}>
            <PasswordInput
              id="admin_password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setPasswordUser(null)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={passwordMutation.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={Boolean(resetToken)} onClose={() => setResetToken(null)} title={t('admin.resetTokenTitle')}>
        <p className="mb-3 text-sm text-on-surface-variant">{t('admin.resetTokenHint')}</p>
        <textarea
          readOnly
          value={resetToken ?? ''}
          className={formControlClassName({ className: 'min-h-24 font-data-mono text-xs' })}
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setResetToken(null)}>{t('common.confirm')}</Button>
        </div>
      </Dialog>
    </>
  )
}
