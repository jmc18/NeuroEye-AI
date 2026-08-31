import { createFileRoute } from '@tanstack/react-router'

import { PatientsPage } from '@features/patients/pages/PatientsPage'

export const Route = createFileRoute('/_app/patients')({
  component: PatientsPage,
  head: () => ({
    meta: [{ title: 'Patients | NeuroEyeAI' }],
  }),
})
