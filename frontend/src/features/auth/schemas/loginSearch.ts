import { z } from 'zod'

export const loginSearchSchema = z.object({
  returnUrl: z.string().optional(),
})

export type LoginSearch = z.infer<typeof loginSearchSchema>
