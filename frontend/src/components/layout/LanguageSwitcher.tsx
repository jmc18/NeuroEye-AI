import { LOCALE_LABELS, SUPPORTED_LOCALES } from '@locales/types'
import { useLocale } from '@hooks/useStore'
import { cn } from '@lib/utils'
import { useTranslation } from 'react-i18next'

type LanguageSwitcherProps = {
  className?: string
  variant?: 'inline' | 'floating'
}

export function LanguageSwitcher({ className, variant = 'inline' }: LanguageSwitcherProps) {
  const { t } = useTranslation()
  const { locale, setLocale } = useLocale()

  return (
    <div
      className={cn(
        variant === 'floating' &&
          'fixed end-4 top-4 z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-800',
        className,
      )}
      role="group"
      aria-label={t('common.language')}
    >
      <span className="sr-only">{t('common.language')}</span>
      <div className="flex gap-1">
        {SUPPORTED_LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium uppercase transition-colors',
              locale === code
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700',
            )}
            aria-pressed={locale === code}
          >
            {LOCALE_LABELS[code]}
          </button>
        ))}
      </div>
    </div>
  )
}
