import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTES } from '@config'

export const Route = createFileRoute('/_app/admin/accounts')({
  beforeLoad: () => {
    throw redirect({ to: ROUTES.admin.tenants })
  },
  component: () => null,
})
