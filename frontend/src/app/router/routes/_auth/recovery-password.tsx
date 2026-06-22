import { createFileRoute } from '@tanstack/react-router'

import { RecoveryPasswordPage } from '@features/auth/pages/RecoveryPasswordPage'
import { loginSearchSchema } from '@features/auth/schemas/loginSearch'

export const Route = createFileRoute('/_auth/recovery-password')({
  validateSearch: loginSearchSchema,
  component: RecoveryPasswordPage,
  head: () => ({
    meta: [{ title: 'Recovery password | NeuroEyeAI' }],
  }),
})
