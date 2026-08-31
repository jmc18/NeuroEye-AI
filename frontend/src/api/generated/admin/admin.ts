import type {
  AdminSetPasswordRequest,
  AdminUserCreate,
  AdminUserListResponse,
  AdminUserResponse,
  AdminUserUpdate,
  GetAdminUsersParams,
  LoginResponse,
  MessageResponse,
  ResetTokenResponse,
  TenantCreate,
  TenantListResponse,
  TenantResponse,
  TenantUpdate,
} from '../models'
import { customInstance } from '../../http/axios'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

export const get_admin_tenants = (
  options?: SecondParameter<typeof customInstance<TenantListResponse>>,
) => {
  return customInstance<TenantListResponse>(
    { url: `/api/v1/admin/tenants`, method: 'GET' },
    options,
  )
}

export const create_admin_tenant = (
  body: TenantCreate,
  options?: SecondParameter<typeof customInstance<TenantResponse>>,
) => {
  return customInstance<TenantResponse>(
    {
      url: `/api/v1/admin/tenants`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body,
    },
    options,
  )
}

export const get_admin_tenant_by_id = (
  tenantId: string,
  options?: SecondParameter<typeof customInstance<TenantResponse>>,
) => {
  return customInstance<TenantResponse>(
    { url: `/api/v1/admin/tenants/${tenantId}`, method: 'GET' },
    options,
  )
}

export const update_admin_tenant = (
  tenantId: string,
  body: TenantUpdate,
  options?: SecondParameter<typeof customInstance<TenantResponse>>,
) => {
  return customInstance<TenantResponse>(
    {
      url: `/api/v1/admin/tenants/${tenantId}`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      data: body,
    },
    options,
  )
}

export const get_admin_tenant_users = (
  tenantId: string,
  params?: GetAdminUsersParams,
  options?: SecondParameter<typeof customInstance<AdminUserListResponse>>,
) => {
  return customInstance<AdminUserListResponse>(
    { url: `/api/v1/admin/tenants/${tenantId}/users`, method: 'GET', params },
    options,
  )
}

export const create_admin_tenant_user = (
  tenantId: string,
  body: AdminUserCreate,
  options?: SecondParameter<typeof customInstance<AdminUserResponse>>,
) => {
  return customInstance<AdminUserResponse>(
    {
      url: `/api/v1/admin/tenants/${tenantId}/users`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body,
    },
    options,
  )
}

export const get_admin_users = (
  params?: GetAdminUsersParams,
  options?: SecondParameter<typeof customInstance<AdminUserListResponse>>,
) => {
  return customInstance<AdminUserListResponse>(
    { url: `/api/v1/admin/users`, method: 'GET', params },
    options,
  )
}

export const update_admin_user = (
  userId: string,
  body: AdminUserUpdate,
  options?: SecondParameter<typeof customInstance<AdminUserResponse>>,
) => {
  return customInstance<AdminUserResponse>(
    {
      url: `/api/v1/admin/users/${userId}`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      data: body,
    },
    options,
  )
}

export const impersonate_admin_user = (
  userId: string,
  options?: SecondParameter<typeof customInstance<LoginResponse>>,
) => {
  return customInstance<LoginResponse>(
    { url: `/api/v1/admin/users/${userId}/impersonate`, method: 'POST' },
    options,
  )
}

export const set_admin_user_password = (
  userId: string,
  body: AdminSetPasswordRequest,
  options?: SecondParameter<typeof customInstance<MessageResponse>>,
) => {
  return customInstance<MessageResponse>(
    {
      url: `/api/v1/admin/users/${userId}/set-password`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body,
    },
    options,
  )
}

export const send_admin_user_reset = (
  userId: string,
  options?: SecondParameter<typeof customInstance<ResetTokenResponse>>,
) => {
  return customInstance<ResetTokenResponse>(
    { url: `/api/v1/admin/users/${userId}/send-reset`, method: 'POST' },
    options,
  )
}
