import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { AppHeader } from '@components/layout/AppHeader'
import { SidebarNav } from '@components/layout/SidebarNav'
import { Button } from '@components/ui'
import { ROUTES } from '@config'
import ScreeningLayout from '@app/layouts/ScreeningLayout'
import { useAuth } from '@hooks/useStore'

export default function DashboardLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, stopImpersonating } = useAuth()

  if (pathname.startsWith(ROUTES.eyetracking.session)) {
    return <ScreeningLayout />
  }

  const handleStopImpersonating = () => {
    stopImpersonating()
    void navigate({ to: ROUTES.admin.tenants })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">
        {user?.impersonated ? (
          <div className="flex items-center justify-between gap-3 bg-warning/15 px-6 py-2 text-sm text-on-surface">
            <span>
              {t('admin.impersonationBanner', { name: user.name, email: user.email })}
            </span>
            <Button size="sm" variant="secondary" onClick={handleStopImpersonating}>
              {t('admin.stopImpersonating')}
            </Button>
          </div>
        ) : null}
        <AppHeader />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
