import { redirect } from '@tanstack/react-router'

import type { AuthContext } from '@app/router/context'
import { ROUTES } from '@config'

export function requireSuperAdmin(auth: AuthContext): void {
  if (!auth.user || auth.user.role !== 'super_admin' || auth.user.impersonated) {
    throw redirect({ to: ROUTES.app.dashboard })
  }
}
