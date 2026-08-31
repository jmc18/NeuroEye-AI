import { useState } from 'react'
import { getRouteApi, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { FormField, PasswordInput, formControlClassName } from '@components/forms'
import { Button } from '@components/ui'
import { confirmPasswordReset, requestPasswordReset } from '@features/auth/services/authService'
import { ROUTES } from '@config'

const recoveryRoute = getRouteApi('/_auth/recovery-password')

export function RecoveryPasswordPage() {
  const { t } = useTranslation()
  const { returnUrl } = recoveryRoute.useSearch()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onRequest = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const ok = await requestPasswordReset(email)
    setSubmitting(false)
    if (ok) {
      setMessage(t('auth.recoverySent'))
    } else {
      setError(t('auth.networkOrServerError'))
    }
  }

  const onReset = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const ok = await confirmPasswordReset(token, password)
    setSubmitting(false)
    if (ok) {
      setMessage(t('auth.resetSuccess'))
    } else {
      setError(t('auth.networkOrServerError'))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline-sm text-on-surface">{t('auth.recoveryTitle')}</h2>
        <p className="mt-1 text-sm text-on-surface-variant">{t('auth.recoveryDescription')}</p>
        {message ? <p className="mt-2 text-sm text-primary">{message}</p> : null}
        {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
      </div>

      <form className="space-y-4" onSubmit={onRequest}>
        <FormField id="email" label={t('common.email')}>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={formControlClassName()}
            placeholder={t('auth.emailPlaceholder')}
          />
        </FormField>
        <Button type="submit" className="w-full" disabled={submitting}>
          {t('auth.recoverySubmit')}
        </Button>
      </form>

      <form className="space-y-4 border-t border-outline-variant/40 pt-4" onSubmit={onReset}>
        <h3 className="text-sm font-semibold text-on-surface">{t('auth.resetTitle')}</h3>
        <FormField id="token" label={t('auth.resetToken')}>
          <input
            id="token"
            required
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className={formControlClassName()}
          />
        </FormField>
        <FormField id="new-password" label={t('common.password')}>
          <PasswordInput
            id="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>
        <Button type="submit" variant="secondary" className="w-full" disabled={submitting}>
          {t('auth.resetSubmit')}
        </Button>
      </form>

      <p className="text-center text-sm">
        <Link to={ROUTES.auth.login} search={{ returnUrl }} className="text-primary hover:underline">
          {t('auth.backToLogin')}
        </Link>
      </p>
    </div>
  )
}
