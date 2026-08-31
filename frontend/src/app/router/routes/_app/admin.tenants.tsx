import { createFileRoute } from '@tanstack/react-router'

import { requireSuperAdmin } from '@features/admin/lib/requireSuperAdmin'
import { TenantsPage } from '@features/admin/pages/TenantsPage'

export const Route = createFileRoute('/_app/admin/tenants')({
  beforeLoad: ({ context }) => {
    requireSuperAdmin(context.auth)
  },
  component: TenantsPage,
  head: () => ({
    meta: [{ title: 'Tenants | NeuroEyeAI' }],
  }),
})
