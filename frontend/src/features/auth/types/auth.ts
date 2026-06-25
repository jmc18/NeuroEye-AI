import type { LoginRequest } from './api'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: string
  tenant: string
}

export type LoginCredentials = LoginRequest

export type AuthState = {
  isAuthenticated: boolean
  user: AuthUser | null
  accessToken: string | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
}
