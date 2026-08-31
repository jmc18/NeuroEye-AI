import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@components/layout/LanguageSwitcher'
import { UserMenu } from '@components/layout/UserMenu'
import { Icon } from '@components/ui'
import { useUi } from '@hooks/useStore'
import { cn } from '@lib/utils'

type AppHeaderProps = {
  title?: string
  className?: string
}

export function AppHeader({ title, className }: AppHeaderProps) {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useUi()

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-outline-variant/30 bg-surface-container-lowest/80 px-6 backdrop-blur-md',
        className,
      )}
    >
      <div className="min-w-0">
        {title ? (
          <h1 className="truncate text-headline-sm text-on-surface">{title}</h1>
        ) : (
          <p className="text-label-caps uppercase tracking-widest text-on-surface-variant">
            {t('common.appName')}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="relative hidden md:block">
          <Icon
            name="search"
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            size={18}
          />
          <input
            type="search"
            placeholder={t('common.search')}
            className="clinical-focus w-64 rounded-lg border border-outline-variant bg-surface-container-low py-2 pe-3 ps-10 text-sm text-on-surface placeholder:text-on-surface-variant"
          />
        </label>

        <LanguageSwitcher />

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high"
          aria-label={t('app.settings.darkMode')}
        >
          <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} />
        </button>

        <button
          type="button"
          className="relative rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high"
          aria-label={t('common.notifications')}
        >
          <Icon name="notifications" />
          <span className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-error" />
        </button>

        <UserMenu />
      </div>
    </header>
  )
}
