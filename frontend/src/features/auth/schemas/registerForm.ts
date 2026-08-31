import type { TFunction } from 'i18next'
import { z } from 'zod'

const PASSWORD_MIN_LENGTH = 8

export function createRegisterFormSchema(t: TFunction) {
  return z.object({
    first_name: z.string().min(1, { message: t('auth.formErrors.firstName.required') }),
    last_name: z.string().min(1, { message: t('auth.formErrors.lastName.required') }),
    email: z.email({ message: t('auth.formErrors.email.invalid') }),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, {
        message: t('auth.formErrors.password.minLength', { min: PASSWORD_MIN_LENGTH }),
      }),
  })
}

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterFormSchema>>
