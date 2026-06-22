import type { LoginCredentials } from '@features/auth/types/auth'

export type AuthContext = {
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export type RouterContext = {
  auth: AuthContext
}
