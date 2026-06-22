import { createFileRoute } from '@tanstack/react-router'

import { RegisterPage } from '@features/auth/pages/RegisterPage'
import { loginSearchSchema } from '@features/auth/schemas/loginSearch'

export const Route = createFileRoute('/_auth/register')({
  validateSearch: loginSearchSchema,
  component: RegisterPage,
  head: () => ({
    meta: [{ title: 'Register | NeuroEyeAI' }],
  }),
})
