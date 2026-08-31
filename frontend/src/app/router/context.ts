import type { AuthUser, LoginCredentials } from '@features/auth/types/auth'

export type AuthContext = {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
}

export type RouterContext = {
  auth: AuthContext
}
