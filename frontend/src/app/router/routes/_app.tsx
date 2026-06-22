import { createFileRoute, redirect } from '@tanstack/react-router'

import DashboardLayout from '@app/layouts/DashboardLayout'
import { ROUTES } from '@config'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: ROUTES.auth.login,
        search: {
          returnUrl: location.pathname + location.searchStr,
        },
      })
    }
  },
  component: DashboardLayout,
})
