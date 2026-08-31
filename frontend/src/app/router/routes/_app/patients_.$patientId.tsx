import { createFileRoute } from '@tanstack/react-router'

import { PatientFilePage } from '@features/patients/pages/PatientFilePage'

export const Route = createFileRoute('/_app/patients_/$patientId')({
  component: PatientFilePage,
  head: () => ({
    meta: [{ title: 'Patient file | NeuroEyeAI' }],
  }),
})
