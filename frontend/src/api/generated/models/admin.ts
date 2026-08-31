export interface TenantResponse {
  id: string
  name: string
  is_system: boolean
  user_count?: number
}

export interface TenantListResponse {
  items: TenantResponse[]
  total: number
}

export interface TenantCreate {
  name: string
}

export interface TenantUpdate {
  name?: string | null
}

export interface AdminUserResponse {
  id: string
  email: string
  name: string
  role: string
  tenant_id: string
  tenant_name: string
  is_active: boolean
  job_title?: string | null
}

export interface AdminUserListResponse {
  items: AdminUserResponse[]
  total: number
  page: number
  page_size: number
}

export interface AdminUserCreate {
  email: string
  password: string
  first_name: string
  last_name: string
  role_name?: string
  job_title?: string | null
}

export interface AdminUserUpdate {
  email?: string | null
  first_name?: string | null
  last_name?: string | null
  is_active?: boolean | null
  role_name?: string | null
}

export interface AdminSetPasswordRequest {
  password: string
}

export interface ResetTokenResponse {
  message: string
  reset_token?: string | null
}

export type GetAdminUsersParams = {
  query?: string
  page?: number
  page_size?: number
}
