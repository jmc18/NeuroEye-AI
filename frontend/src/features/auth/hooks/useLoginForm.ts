import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { navigateToReturnUrl } from '@features/auth/lib/returnUrl'
import { createLoginFormSchema, type LoginFormValues } from '@features/auth/schemas/loginForm'
import { useAuth } from '@hooks/useStore'

export function useLoginForm(returnUrl?: string) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const resolver = useMemo(
    () => zodResolver(createLoginFormSchema(t)),
    [t, i18n.language],
  )

  const form = useForm<LoginFormValues>({
    resolver,
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await login(values)
    navigateToReturnUrl(navigate, returnUrl)
  })

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  }
}
