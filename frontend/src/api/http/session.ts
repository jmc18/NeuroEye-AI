let accessToken: string | null = null
let tenantId: string | null = null

export const httpSession = {
  getAccessToken: (): string | null => accessToken,
  setAccessToken: (token: string | null): void => {
    accessToken = token
  },
  getTenantId: (): string | null => tenantId,
  setTenantId: (id: string | null): void => {
    tenantId = id
  },
  clear: (): void => {
    accessToken = null
    tenantId = null
  },
}
