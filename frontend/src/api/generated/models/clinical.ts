export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  second_last_name?: string | null
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface MessageResponse {
  message: string
}

export interface PatientResponse {
  id: string
  first_name: string
  last_name: string
  second_last_name?: string | null
  display_name: string
  birth_date?: string | null
  email?: string | null
  phone_number?: string | null
  sex?: string | null
  notes?: string | null
  risk_level: string
  session_count?: number
}

export interface PatientCreate {
  first_name: string
  last_name: string
  second_last_name?: string | null
  birth_date?: string | null
  email?: string | null
  phone_number?: string | null
  sex?: string | null
  notes?: string | null
}

export interface PatientListResponse {
  items: PatientResponse[]
  total: number
  page: number
  page_size: number
}

export type GetPatientsParams = {
  query?: string
  page?: number
  page_size?: number
}

export interface TestPresetResponse {
  id: string
  code: string
  name: string
  description?: string | null
  config: Record<string, unknown>
}

export interface SessionMetricsResponse {
  session_id: string
  sample_count: number
  mean_fps: number
  detection_rate: number
  mean_latency_ms: number
  fixation_stability: number
  saccade_amplitude: number
  extras: Record<string, unknown>
  risk_level: string
}

export interface SessionResponse {
  id: string
  patient_id: string
  patient_name: string
  clinician_id: string
  preset_id: string
  preset_code: string
  preset_name: string
  status: string
  started_at?: string | null
  ended_at?: string | null
  abort_reason?: string | null
  metrics?: SessionMetricsResponse | null
}

export interface SessionCreate {
  patient_id: string
  preset_id: string
}

export interface SessionListResponse {
  items: SessionResponse[]
  total: number
  page: number
  page_size: number
}

export type GetSessionsParams = {
  patient_id?: string
  page?: number
  page_size?: number
}

export interface SessionReportResponse {
  session: SessionResponse
  metrics?: SessionMetricsResponse | null
  disclaimer: string
}

export interface DashboardSummaryResponse {
  patient_count: number
  session_count: number
  completed_session_count: number
  at_risk_count: number
}

export interface UpdateProfileRequest {
  first_name?: string | null
  last_name?: string | null
  second_last_name?: string | null
  job_title?: string | null
  phone_number?: string | null
}

export interface ChangeEmailRequest {
  current_password: string
  email: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}
