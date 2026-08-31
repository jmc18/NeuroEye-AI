import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { navigateToReturnUrl } from '@features/auth/lib/returnUrl'
import { createRegisterFormSchema, type RegisterFormValues } from '@features/auth/schemas/registerForm'
import { useAuth } from '@hooks/useStore'

export function useRegisterForm(returnUrl?: string) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register } = useAuth()
  const [failedMessage, setFailedMessage] = useState('')

  const resolver = useMemo(() => zodResolver(createRegisterFormSchema(t)), [t])

  const form = useForm<RegisterFormValues>({
    resolver,
    mode: 'onTouched',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setFailedMessage('')
    const isSuccess = await register(values)
    if (!isSuccess) {
      setFailedMessage(t('auth.registerFailed'))
      return
    }
    navigateToReturnUrl(navigate, returnUrl)
  })

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    failedMessage,
  }
}
