import { createFileRoute } from '@tanstack/react-router'

import { DiagnosticReportPage } from '@features/reports/pages/DiagnosticReportPage'

export const Route = createFileRoute('/_app/reports/$sessionId')({
  component: DiagnosticReportPage,
  head: () => ({
    meta: [{ title: 'Report | NeuroEyeAI' }],
  }),
})
