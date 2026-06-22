import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@components/layout'
import { ROUTES } from '@config'

export function PrivacyPolicyPage() {
  const { t } = useTranslation()

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader
        title={t('legal.privacy.title')}
        description={t('legal.privacy.description')}
      />

      <div className="prose prose-sm max-w-none text-gray-600 dark:text-neutral-300">
        <p>{t('legal.privacy.body1')}</p>
        <p>{t('legal.privacy.body2')}</p>
      </div>

      <p className="mt-8">
        <Link to={ROUTES.home} className="text-sm text-blue-600 hover:underline">
          {t('common.goHome')}
        </Link>
      </p>
    </article>
  )
}
