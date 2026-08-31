import {
  create_admin_tenant,
  create_admin_tenant_user,
  get_admin_tenant_by_id,
  get_admin_tenant_users,
  get_admin_tenants,
  get_admin_users,
  impersonate_admin_user,
  send_admin_user_reset,
  set_admin_user_password,
  update_admin_tenant,
  update_admin_user,
} from '@api/generated/admin/admin'
import { mapAuthUserResponse } from '@features/auth/types/api'
import type {
  AdminUserCreate,
  AdminUserUpdate,
  TenantCreate,
  TenantUpdate,
} from '@api/generated/models'

export const adminService = {
  listTenants: () => get_admin_tenants(),
  getTenant: (id: string) => get_admin_tenant_by_id(id),
  createTenant: (body: TenantCreate) => create_admin_tenant(body),
  updateTenant: (id: string, body: TenantUpdate) => update_admin_tenant(id, body),
  listTenantUsers: (tenantId: string, query?: string) =>
    get_admin_tenant_users(tenantId, { query, page: 1, page_size: 50 }),
  createTenantUser: (tenantId: string, body: AdminUserCreate) =>
    create_admin_tenant_user(tenantId, body),
  listUsers: (query?: string) => get_admin_users({ query, page: 1, page_size: 50 }),
  updateUser: (userId: string, body: AdminUserUpdate) => update_admin_user(userId, body),
  impersonate: async (userId: string) => {
    const response = await impersonate_admin_user(userId, { skipErrorToast: false })
    return {
      user: mapAuthUserResponse(response.user),
      accessToken: response.access_token,
    }
  },
  setPassword: (userId: string, password: string) =>
    set_admin_user_password(userId, { password }),
  sendReset: (userId: string) => send_admin_user_reset(userId),
}
