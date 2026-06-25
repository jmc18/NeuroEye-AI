import type { LoginRequest, LoginResponse } from '@api/generated/models'

import type { AuthUser } from './auth'

export type { LoginRequest, LoginResponse }

export type AuthSession = {
  user: AuthUser
  accessToken: string
}

export function mapAuthUserResponse(
  user: LoginResponse['user'],
): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenant: user.tenant,
  }
}
