import { createFileRoute } from '@tanstack/react-router'

import { ProfilePage } from '@features/profile/pages/ProfilePage'

export const Route = createFileRoute('/_app/profile')({
  component: ProfilePage,
  head: () => ({
    meta: [{ title: 'Profile | NeuroEyeAI' }],
  }),
})
