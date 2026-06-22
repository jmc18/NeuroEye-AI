import { api } from '@lib/axios'

import type { LoginCredentials } from '../types/auth'
import type { LoginResponse } from '../types/api'

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>('/api/v1/auth/login', credentials),

  logout: () => api.post<void>('/api/v1/auth/logout'),
}
