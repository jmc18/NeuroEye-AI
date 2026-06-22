import { createFileRoute } from '@tanstack/react-router'

import { PrivacyPolicyPage } from '@features/legal/pages/PrivacyPolicyPage'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
  head: () => ({
    meta: [{ title: 'Privacy Policy | NeuroEyeAI' }],
  }),
})
