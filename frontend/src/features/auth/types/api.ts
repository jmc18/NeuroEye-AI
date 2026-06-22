import type { AuthUser } from '../types/auth'

export type LoginResponse = {
  access_token: string
  user: {
    id: string
    email: string
    name: string
    role: AuthUser['role']
    tenant: string
  }
}

export type AuthSession = {
  user: AuthUser
  accessToken: string
}
