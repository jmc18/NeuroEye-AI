import type {
  GetPatientsParams,
  PatientCreate,
  PatientListResponse,
  PatientResponse,
} from '../models';
import { customInstance } from '../../http/axios';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const get_patients = (
  params?: GetPatientsParams,
  options?: SecondParameter<typeof customInstance<PatientListResponse>>,
) => {
  return customInstance<PatientListResponse>(
    { url: `/api/v1/patients`, method: 'GET', params },
    options,
  );
};

export const create_patient = (
  body: PatientCreate,
  options?: SecondParameter<typeof customInstance<PatientResponse>>,
) => {
  return customInstance<PatientResponse>(
    {
      url: `/api/v1/patients`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body,
    },
    options,
  );
};

export const get_patient_by_id = (
  patientId: string,
  options?: SecondParameter<typeof customInstance<PatientResponse>>,
) => {
  return customInstance<PatientResponse>(
    { url: `/api/v1/patients/${patientId}`, method: 'GET' },
    options,
  );
};
