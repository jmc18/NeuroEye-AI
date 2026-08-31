import { create_patient, get_patient_by_id, get_patients } from '@api/generated/patients/patients'
import type { PatientCreate } from '@api/generated/models'

export const patientService = {
  list: (query?: string, page = 1) => get_patients({ query, page, page_size: 20 }),
  get: (id: string) => get_patient_by_id(id),
  create: (body: PatientCreate) => create_patient(body),
}
