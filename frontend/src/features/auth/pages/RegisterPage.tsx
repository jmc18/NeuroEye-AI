import { getRouteApi, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { ROUTES } from '@config'

const registerRoute = getRouteApi('/_auth/register')

export function RegisterPage() {
  const { t } = useTranslation()
  const { returnUrl } = registerRoute.useSearch()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {t('auth.registerTitle')}
        </h2>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white">
            {t('auth.fullName')}
          </label>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
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
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white">
            {t('common.password')}
          </label>
          <input
            type="password"
            className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t('auth.register')}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-neutral-400">
        {t('auth.hasAccount')}{' '}
        <Link
          to={ROUTES.auth.login}
          search={{ returnUrl }}
          className="font-medium text-blue-600 hover:underline"
        >
          {t('auth.signIn')}
        </Link>
      </p>
    </div>
  )
}
