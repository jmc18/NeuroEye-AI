import type { TFunction } from 'i18next'
import { z } from 'zod'

const PASSWORD_MIN_LENGTH = 8

export function createLoginFormSchema(t: TFunction) {
  return z.object({
    email: z.email({ message: t('auth.formErrors.email.invalid') }),
    password: z
      .string()
      .min(1, { message: t('auth.formErrors.password.required') })
      .min(PASSWORD_MIN_LENGTH, {
        message: t('auth.formErrors.password.minLength', { min: PASSWORD_MIN_LENGTH }),
      }),
  })
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>

export const loginFormFields = ['email', 'password'] as const

export type LoginFormField = (typeof loginFormFields)[number]
