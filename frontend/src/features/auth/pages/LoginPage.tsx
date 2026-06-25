import { getRouteApi, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { FormField, PasswordInput, formControlClassName } from '@components/forms'
import { useLoginForm } from '@features/auth/hooks/useLoginForm'
import { ROUTES } from '@config'

const loginRoute = getRouteApi('/_auth/login')

export function LoginPage() {
  const { t } = useTranslation()
  const { returnUrl } = loginRoute.useSearch()
  const { form, onSubmit, isSubmitting, logingFailedMessage } = useLoginForm(returnUrl)

  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {t('auth.signInTitle')}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
          {returnUrl ? (
            <span
              dangerouslySetInnerHTML={{
                __html: t('auth.signInAfterReturn', { url: returnUrl }),
              }}
            />
          ) : (
            t('auth.signInContinue')
          )}
        </p>
        {logingFailedMessage && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {logingFailedMessage}
          </p>
        )}
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          id="email"
          label={t('common.email')}
          error={errors.email?.message}
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={formControlClassName({ hasError: Boolean(errors.email) })}
            placeholder={t('auth.emailPlaceholder')}
            {...register('email')}
          />
        </FormField>

        <FormField
          id="password"
          label={t('common.password')}
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            hasError={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
        </button>
      </form>

      <div className="flex flex-col gap-2 text-center text-sm">
        <Link
          to={ROUTES.auth.recoveryPassword}
          search={{ returnUrl }}
          className="text-blue-600 hover:underline"
        >
          {t('auth.forgotPassword')}
        </Link>
        <p className="text-gray-600 dark:text-neutral-400">
          {t('auth.noAccount')}{' '}
          <Link
            to={ROUTES.auth.register}
            search={{ returnUrl }}
            className="font-medium text-blue-600 hover:underline"
          >
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
