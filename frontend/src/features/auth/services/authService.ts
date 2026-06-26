import { login } from '@api/generated/auth/auth'
import { httpSession } from '@api/http/session'

import { mapAuthUserResponse, type AuthSession } from '../types/api'
import type { LoginCredentials } from '../types/auth'

const ACCESS_TOKEN_KEY = 'access_token'


export function persistAccessToken(token: string | null): void {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    return
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function syncHttpSessionFromStorage(userTenantId?: string | null): void {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  httpSession.setAccessToken(token)
  httpSession.setTenantId(userTenantId ?? null)
}

export async function loginWithCredentials(
  credentials: LoginCredentials,
): Promise<AuthSession | undefined> {
  try {
    const response = await login(credentials, { skipErrorToast: false })

    httpSession.setAccessToken(response.access_token)
    httpSession.setTenantId(response.user.tenant_id)
    persistAccessToken(response.access_token)

    return {
      user: mapAuthUserResponse(response.user),
      accessToken: response.access_token,
    }
  } catch {
    return undefined
  }
}

export async function logoutFromApi(): Promise<void> {
  httpSession.clear()
  persistAccessToken(null)
}
