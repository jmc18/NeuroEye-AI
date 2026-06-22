import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { ROUTES } from '@config'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-neutral-600">404</h1>
      <p className="text-lg text-gray-600 dark:text-neutral-400">{t('errors.notFound.title')}</p>
      <p className="text-sm text-gray-500 dark:text-neutral-500">{t('errors.notFound.hint')}</p>
      <Link
        to={ROUTES.home}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {t('common.goHome')}
      </Link>
    </main>
  )
}
