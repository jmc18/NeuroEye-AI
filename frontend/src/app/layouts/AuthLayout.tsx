import { Link, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { ROUTES } from '@config'

export default function AuthLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[calc(100vh-0px)] items-center justify-center bg-gray-100 px-4 py-10 dark:bg-neutral-900">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to={ROUTES.home} className="text-xl font-bold text-gray-800 dark:text-white">
            {t('common.appName')}
          </Link>
          <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">{t('auth.layoutHint')}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <Outlet />
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-neutral-500">
          <Link to={ROUTES.legal.privacyPolicy} className="underline hover:text-gray-700">
            {t('home.routes.privacyPolicy')}
          </Link>
        </p>
      </div>
    </div>
  )
}
