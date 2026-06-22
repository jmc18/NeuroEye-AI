import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { ROUTES } from '@config'
import { useAuth } from '@hooks/useStore'
import { cn } from '@lib/utils'

export function SidebarNav() {
  const { t } = useTranslation()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navItems = [
    { label: t('home.routes.dashboard'), to: ROUTES.app.dashboard },
    { label: t('home.routes.profile'), to: ROUTES.app.profile },
    { label: t('home.routes.settings'), to: ROUTES.app.settings },
  ] as const

  const handleSignOut = () => {
    logout()
    void navigate({
      to: ROUTES.auth.login,
      search: { returnUrl: pathname },
    })
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-e border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="border-b border-gray-200 px-4 py-5 dark:border-neutral-700">
        <Link to={ROUTES.home} className="text-lg font-bold text-gray-800 dark:text-white">
          {t('common.appName')}
        </Link>
        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">{t('app.layoutHint')}</p>
        {user ? (
          <p className="mt-2 truncate text-xs text-gray-600 dark:text-neutral-400">{user.email}</p>
        ) : null}
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === item.to
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700',
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-200 p-3 dark:border-neutral-700">
        <button
          type="button"
          onClick={handleSignOut}
          className="block w-full rounded-lg px-3 py-2 text-start text-sm text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
        >
          {t('common.signOut')}
        </button>
      </div>
    </aside>
  )
}
