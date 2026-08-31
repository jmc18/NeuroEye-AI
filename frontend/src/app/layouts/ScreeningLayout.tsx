import type { ReactNode } from 'react'
import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Icon } from '@components/ui'
import { ROUTES } from '@config'
import { useAuth, useUi } from '@hooks/useStore'

type ScreeningLayoutProps = {
  children?: ReactNode
}

/** Full-screen clinical screening shell (no sidebar). */
export default function ScreeningLayout({ children }: ScreeningLayoutProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme, toggleTheme } = useUi()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void navigate({ to: ROUTES.app.dashboard })}
            className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high"
            aria-label={t('common.goHome')}
          >
            <Icon name="arrow_back" />
          </button>
          <div>
            <p className="text-label-caps uppercase tracking-widest text-primary">
              {t('eyetracking.liveSession')}
            </p>
            <p className="text-sm font-semibold text-on-surface">
              {t('eyetracking.title')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high"
            aria-label={t('app.settings.darkMode')}
          >
            <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} />
          </button>
          <Link
            to={ROUTES.app.profile}
            className="rounded-lg px-3 py-1.5 text-sm text-on-surface-variant hover:bg-surface-container-high"
          >
            {user?.name}
          </Link>
        </div>
      </header>
      {children ?? <Outlet />}
    </div>
  )
}
