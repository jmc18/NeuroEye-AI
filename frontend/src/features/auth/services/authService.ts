import {
  change_my_email,
  change_my_password,
  forgot_password,
  login,
  logout,
  register,
  reset_password,
  update_me,
} from '@api/generated/auth/auth'
import { httpSession } from '@api/http/session'
import type {
  ChangeEmailRequest,
  ChangePasswordRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from '@api/generated/models'

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

export async function persistSession(accessToken: string, tenantId: string): Promise<void> {
  httpSession.setAccessToken(accessToken)
  httpSession.setTenantId(tenantId)
  persistAccessToken(accessToken)
}

export async function loginWithCredentials(
  credentials: LoginCredentials,
): Promise<AuthSession | undefined> {
  try {
    const response = await login(credentials, { skipErrorToast: false })
    await persistSession(response.access_token, response.user.tenant_id)
    return {
      user: mapAuthUserResponse(response.user),
      accessToken: response.access_token,
    }
  } catch {
    return undefined
  }
}

export async function registerWithCredentials(
  body: RegisterRequest,
): Promise<AuthSession | undefined> {
  try {
    const response = await register(body, { skipErrorToast: false })
    await persistSession(response.access_token, response.user.tenant_id)
    return {
      user: mapAuthUserResponse(response.user),
      accessToken: response.access_token,
    }
  } catch {
    return undefined
  }
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  try {
    await forgot_password({ email }, { skipErrorToast: false })
    return true
  } catch {
    return false
  }
}

export async function confirmPasswordReset(token: string, password: string): Promise<boolean> {
  try {
    await reset_password({ token, password }, { skipErrorToast: false })
    return true
  } catch {
    return false
  }
}

export async function logoutFromApi(): Promise<void> {
  try {
    await logout({ skipErrorToast: true })
  } catch {
    // Client-side logout still proceeds if the API is unreachable.
  }
  httpSession.clear()
  persistAccessToken(null)
}

export async function updateMyProfile(body: UpdateProfileRequest) {
  const user = await update_me(body, { skipErrorToast: false })
  return mapAuthUserResponse(user)
}

export async function changeMyEmail(body: ChangeEmailRequest): Promise<AuthSession | undefined> {
  try {
    const response = await change_my_email(body, { skipErrorToast: false })
    await persistSession(response.access_token, response.user.tenant_id)
    return {
      user: mapAuthUserResponse(response.user),
      accessToken: response.access_token,
    }
  } catch {
    return undefined
  }
}

export async function changeMyPassword(body: ChangePasswordRequest): Promise<boolean> {
  try {
    await change_my_password(body, { skipErrorToast: false })
    return true
  } catch {
    return false
  }
}
