import { getRouteApi, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { FormField, PasswordInput, formControlClassName } from '@components/forms'
import { Button } from '@components/ui'
import { useLoginForm } from '@features/auth/hooks/useLoginForm'
import { ROUTES } from '@config'

const loginRoute = getRouteApi('/_auth/login')

export function LoginPage() {
  const { t } = useTranslation()
  const { returnUrl } = loginRoute.useSearch()
  const { form, onSubmit, isSubmitting, loginFailedMessage } = useLoginForm(returnUrl)

  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      <div>
        <p className="text-label-caps uppercase tracking-widest text-primary">{t('auth.hipaaFooter')}</p>
        <h2 className="mt-2 text-headline-sm text-on-surface">{t('auth.signInTitle')}</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
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
        {loginFailedMessage ? (
          <p className="mt-2 text-sm text-error">{loginFailedMessage}</p>
        ) : null}
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField id="email" label={t('common.email')} error={errors.email?.message}>
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

        <FormField id="password" label={t('common.password')} error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            hasError={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
        </Button>
      </form>

      <div className="flex flex-col gap-2 text-center text-sm">
        <Link
          to={ROUTES.auth.recoveryPassword}
          search={{ returnUrl }}
          className="text-primary hover:underline"
        >
          {t('auth.forgotPassword')}
        </Link>
        <p className="text-on-surface-variant">
          {t('auth.noAccount')}{' '}
          <Link
            to={ROUTES.auth.register}
            search={{ returnUrl }}
            className="font-medium text-primary hover:underline"
          >
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
