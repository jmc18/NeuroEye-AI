import type { LoginRequest } from './api'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: string
  tenant: string
  tenantId: string
  firstName?: string | null
  lastName?: string | null
  jobTitle?: string | null
  phoneNumber?: string | null
  impersonated: boolean
  impersonatorId?: string | null
}

export type LoginCredentials = LoginRequest

export type RegisterCredentials = {
  email: string
  password: string
  first_name: string
  last_name: string
}

export type ImpersonatorSession = {
  user: AuthUser
  accessToken: string
}

export type AuthState = {
  isAuthenticated: boolean
  user: AuthUser | null
  accessToken: string | null
  impersonator: ImpersonatorSession | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (credentials: RegisterCredentials) => Promise<boolean>
  logout: () => void
  applySession: (session: { user: AuthUser; accessToken: string }) => void
  startImpersonation: (session: { user: AuthUser; accessToken: string }) => void
  stopImpersonating: () => void
  setUser: (user: AuthUser) => void
}
