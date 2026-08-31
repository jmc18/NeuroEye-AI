import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Icon } from '@components/ui'
import { ROUTES } from '@config'
import { useAuth } from '@hooks/useStore'
import { cn } from '@lib/utils'

export function SidebarNav() {
  const { t } = useTranslation()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isSuperAdmin = user?.role === 'super_admin' && !user.impersonated

  const navItems: Array<{
    labelKey:
      | 'home.routes.dashboard'
      | 'home.routes.patients'
      | 'home.routes.sessions'
      | 'home.routes.profile'
      | 'home.routes.settings'
      | 'home.routes.tenants'
    to:
      | typeof ROUTES.app.dashboard
      | typeof ROUTES.app.patients
      | typeof ROUTES.app.sessions
      | typeof ROUTES.app.profile
      | typeof ROUTES.app.settings
      | typeof ROUTES.admin.tenants
    icon: string
  }> = [
    { labelKey: 'home.routes.dashboard', to: ROUTES.app.dashboard, icon: 'dashboard' },
    { labelKey: 'home.routes.patients', to: ROUTES.app.patients, icon: 'group' },
    { labelKey: 'home.routes.sessions', to: ROUTES.app.sessions, icon: 'history' },
  ]

  if (isSuperAdmin) {
    navItems.push({ labelKey: 'home.routes.tenants', to: ROUTES.admin.tenants, icon: 'apartment' })
  }

  navItems.push(
    { labelKey: 'home.routes.profile', to: ROUTES.app.profile, icon: 'person' },
    { labelKey: 'home.routes.settings', to: ROUTES.app.settings, icon: 'settings' },
  )

  const handleSignOut = () => {
    logout()
    void navigate({
      to: ROUTES.auth.login,
      search: { returnUrl: pathname },
    })
  }

  return (
    <aside className="sticky top-0 flex h-svh w-64 shrink-0 flex-col overflow-hidden border-e border-outline-variant/30 bg-surface-container-low lg:w-[280px]">
      <div className="border-b border-outline-variant/30 px-5 py-5">
        <Link to={ROUTES.app.dashboard} className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
            <Icon name="visibility" filled />
          </span>
          <span>
            <span className="block text-sm font-bold tracking-tight text-on-surface">
              {t('common.appName')}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
              {t('common.clinicalPlatform')}
            </span>
          </span>
        </Link>
        {user ? (
          <p className="mt-3 truncate font-data-mono text-xs text-on-surface-variant">
            {user.email}
          </p>
        ) : null}
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active =
            pathname === item.to ||
            (item.to !== ROUTES.app.dashboard && pathname.startsWith(item.to))

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-r-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'border-l-4 border-primary bg-primary/10 text-primary'
                  : 'border-l-4 border-transparent text-on-surface-variant hover:bg-surface-container-high',
              )}
            >
              <Icon name={item.icon} filled={active} />
              {t(item.labelKey)}
            </Link>
          )
        })}
      </nav>

      <div className="shrink-0 space-y-2 border-t border-outline-variant/30 p-3">
        <Link
          to={ROUTES.app.patients}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-3 text-label-caps uppercase tracking-widest text-on-primary-container"
        >
          <Icon name="play_arrow" filled />
          {t('common.startNewSession')}
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start text-sm text-error hover:bg-error/10"
        >
          <Icon name="logout" />
          {t('common.signOut')}
        </button>
      </div>
    </aside>
  )
}
