import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormField, PasswordInput, formControlClassName } from '@components/forms'
import { PageHeader } from '@components/layout'
import { Button, Card, Dialog } from '@components/ui'
import { UserAccountsTable } from '@features/admin/components/UserAccountsTable'
import { adminService } from '@features/admin/services/adminService'
import { ROUTES } from '@config'

export function TenantDetailPage() {
  const { t } = useTranslation()
  const { tenantId } = useParams({ from: '/_app/admin/tenants_/$tenantId' })
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [roleName, setRoleName] = useState('Clinician')

  const [query, setQuery] = useState('')

  const tenantQuery = useQuery({
    queryKey: ['admin', 'tenants', tenantId],
    queryFn: () => adminService.getTenant(tenantId),
  })

  const usersQuery = useQuery({
    queryKey: ['admin', 'tenants', tenantId, 'users', query],
    queryFn: () => adminService.listTenantUsers(tenantId, query || undefined),
  })

  useEffect(() => {
    if (tenantQuery.data) {
      setName(tenantQuery.data.name)
    }
  }, [tenantQuery.data])

  const renameMutation = useMutation({
    mutationFn: () => adminService.updateTenant(tenantId, { name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] })
    },
  })

  const createMutation = useMutation({
    mutationFn: () =>
      adminService.createTenantUser(tenantId, {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role_name: roleName,
      }),
    onSuccess: async () => {
      setOpen(false)
      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setRoleName('Clinician')
      await queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })

  const tenant = tenantQuery.data

  return (
    <div>
      <PageHeader
        title={tenant?.name ?? t('admin.tenantDetailTitle')}
        description={t('admin.tenantDetailDescription')}
      >
        <div className="flex gap-2">
          <Link
            to={ROUTES.admin.tenants}
            className="rounded-lg border border-outline-variant px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high"
          >
            {t('admin.backToTenants')}
          </Link>
          <Button icon="person_add" onClick={() => setOpen(true)}>
            {t('admin.newUser')}
          </Button>
        </div>
      </PageHeader>

      <Card className="mb-6 max-w-xl">
        <form
          className="flex items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            renameMutation.mutate()
          }}
        >
          <FormField id="rename_tenant" label={t('admin.tenantName')} className="flex-1">
            <input
              id="rename_tenant"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={formControlClassName()}
            />
          </FormField>
          <Button type="submit" disabled={renameMutation.isPending}>
            {t('common.save')}
          </Button>
        </form>
      </Card>

      <h2 className="mb-3 text-sm font-semibold text-on-surface">{t('admin.usersTitle')}</h2>
      <div className="mb-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('admin.searchUsers')}
          className={formControlClassName({ className: 'max-w-md' })}
        />
      </div>
      <UserAccountsTable
        users={usersQuery.data?.items ?? []}
        empty={usersQuery.isLoading ? t('common.loading') : t('admin.usersEmpty')}
      />

      <Dialog open={open} onClose={() => setOpen(false)} title={t('admin.createUserTitle')}>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            createMutation.mutate()
          }}
        >
          <FormField id="user_first" label={t('app.profile.firstName')}>
            <input
              id="user_first"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={formControlClassName()}
            />
          </FormField>
          <FormField id="user_last" label={t('app.profile.lastName')}>
            <input
              id="user_last"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={formControlClassName()}
            />
          </FormField>
          <FormField id="user_email" label={t('common.email')}>
            <input
              id="user_email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={formControlClassName()}
            />
          </FormField>
          <FormField id="user_password" label={t('common.password')}>
            <PasswordInput
              id="user_password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormField>
          <FormField id="user_role" label={t('admin.columns.role')}>
            <select
              id="user_role"
              value={roleName}
              onChange={(event) => setRoleName(event.target.value)}
              className={formControlClassName()}
            >
              <option value="Clinician">{t('app.profile.roles.clinician')}</option>
              {tenant?.is_system ? (
                <option value="Super Admin">{t('app.profile.roles.super_admin')}</option>
              ) : null}
            </select>
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
