import { getRouteApi, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { ROUTES } from '@config'

const recoveryRoute = getRouteApi('/_auth/recovery-password')

export function RecoveryPasswordPage() {
  const { t } = useTranslation()
  const { returnUrl } = recoveryRoute.useSearch()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {t('auth.recoveryTitle')}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
          {t('auth.recoveryDescription')}
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white">
            {t('common.email')}
          </label>
          <input
            type="email"
            className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            placeholder={t('auth.emailPlaceholder')}
          />
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t('auth.recoverySubmit')}
        </button>
      </form>

      <p className="text-center text-sm">
        <Link
          to={ROUTES.auth.login}
          search={{ returnUrl }}
          className="text-blue-600 hover:underline"
        >
          {t('auth.backToLogin')}
        </Link>
      </p>
    </div>
  )
}
