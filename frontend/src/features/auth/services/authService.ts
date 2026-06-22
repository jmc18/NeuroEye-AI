import { authApi } from '../api/authApi'
import type { AuthSession } from '../types/api'
import type { AuthUser, LoginCredentials } from '../types/auth'

const ACCESS_TOKEN_KEY = 'access_token'

function mapUser(user: AuthSession['user']): AuthUser {
  return user
}

function buildDemoSession(credentials: LoginCredentials): AuthSession {
  const nameFromEmail = credentials.email.split('@')[0] ?? 'user'

  const user: AuthUser = {
    id: crypto.randomUUID(),
    email: credentials.email,
    name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
    role: 'researcher',
    tenant: 'NeuroEye Lab',
  }

  return {
    user,
    accessToken: `demo-token-${user.id}`,
  }
}

export function persistAccessToken(token: string | null): void {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    return
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export async function loginWithCredentials(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  try {
    const { data } = await authApi.login(credentials)

    return {
      user: mapUser(data.user),
      accessToken: data.access_token,
    }
  } catch {
    // Demo fallback until POST /api/v1/auth/login exists on the backend.
    return buildDemoSession(credentials)
  }
}

export async function logoutFromApi(): Promise<void> {
  try {
    await authApi.logout()
  } catch {
    // Ignore when endpoint is not available yet.
  } finally {
    persistAccessToken(null)
  }
}
