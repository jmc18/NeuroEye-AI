import { createFileRoute } from '@tanstack/react-router'

import { requireSuperAdmin } from '@features/admin/lib/requireSuperAdmin'
import { TenantDetailPage } from '@features/admin/pages/TenantDetailPage'

export const Route = createFileRoute('/_app/admin/tenants_/$tenantId')({
  beforeLoad: ({ context }) => {
    requireSuperAdmin(context.auth)
  },
  component: TenantDetailPage,
  head: () => ({
    meta: [{ title: 'Tenant | NeuroEyeAI' }],
  }),
})
