export type AuthUser = {
  id: string
  email: string
  name: string
  role: 'researcher'
  tenant: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthState = {
  isAuthenticated: boolean
  user: AuthUser | null
  accessToken: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}
