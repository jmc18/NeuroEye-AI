import { getRouteApi, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { FormField, PasswordInput, formControlClassName } from '@components/forms'
import { Button } from '@components/ui'
import { useRegisterForm } from '@features/auth/hooks/useRegisterForm'
import { ROUTES } from '@config'

const registerRoute = getRouteApi('/_auth/register')

export function RegisterPage() {
  const { t } = useTranslation()
  const { returnUrl } = registerRoute.useSearch()
  const { form, onSubmit, isSubmitting, failedMessage } = useRegisterForm(returnUrl)
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline-sm text-on-surface">{t('auth.registerTitle')}</h2>
        {failedMessage ? <p className="mt-2 text-sm text-error">{failedMessage}</p> : null}
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField id="first_name" label={t('auth.firstName')} error={errors.first_name?.message}>
          <input
            id="first_name"
            className={formControlClassName({ hasError: Boolean(errors.first_name) })}
            {...register('first_name')}
          />
        </FormField>
        <FormField id="last_name" label={t('auth.lastName')} error={errors.last_name?.message}>
          <input
            id="last_name"
            className={formControlClassName({ hasError: Boolean(errors.last_name) })}
            {...register('last_name')}
          />
        </FormField>
        <FormField id="email" label={t('common.email')} error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={formControlClassName({ hasError: Boolean(errors.email) })}
            placeholder={t('auth.emailPlaceholder')}
            {...register('email')}
          />
        </FormField>
        <FormField id="password" label={t('common.password')} error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="new-password" hasError={Boolean(errors.password)} {...register('password')} />
        </FormField>
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? t('auth.registering') : t('auth.register')}
        </Button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        {t('auth.hasAccount')}{' '}
        <Link to={ROUTES.auth.login} search={{ returnUrl }} className="font-medium text-primary hover:underline">
          {t('auth.signIn')}
        </Link>
      </p>
    </div>
  )
}
