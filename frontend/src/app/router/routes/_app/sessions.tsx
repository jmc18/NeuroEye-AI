import { createFileRoute } from '@tanstack/react-router'

import { SessionHistoryPage } from '@features/eyetracking/pages/SessionHistoryPage'

export const Route = createFileRoute('/_app/sessions')({
  component: SessionHistoryPage,
  head: () => ({
    meta: [{ title: 'Sessions | NeuroEyeAI' }],
  }),
})
