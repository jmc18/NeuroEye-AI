import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTES } from '@config'

export const Route = createFileRoute('/_app/eyetracking/session')({
  beforeLoad: () => {
    throw redirect({ to: ROUTES.app.patients })
  },
  component: () => null,
})
