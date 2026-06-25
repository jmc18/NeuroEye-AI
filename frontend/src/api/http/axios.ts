import axios, { isAxiosError, type AxiosRequestConfig } from 'axios'

import { toast } from '@shared/notifications'

import { getApiErrorMessage } from './errors'
import { httpSession } from './session'

export type AxiosRequestConfigWithToast = AxiosRequestConfig

export const AXIOS_INSTANCE = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = httpSession.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const tenantId = httpSession.getTenantId()
  if (tenantId) {
    config.headers['X-Tenant-Id'] = tenantId
  }

  return config
})

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      const config = error.config as AxiosRequestConfigWithToast | undefined
      const status = error.response?.status

      if (!config?.skipErrorToast && status !== 401) {
        toast.error(getApiErrorMessage(error))
      }
    }

    return Promise.reject(error)
  },
)

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> =>
  AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data)

export default customInstance
