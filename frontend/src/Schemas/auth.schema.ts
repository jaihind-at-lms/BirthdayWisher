/**
 * Zod schemas for auth-related forms.
 *
 * The inferred TypeScript types live here too — derived from the schema so
 * validation rules and types can never drift apart.
 *
 * Usage:
 *   const { register, handleSubmit } = useForm<LoginFormValues>({
 *     resolver: zodResolver(loginSchema),
 *   })
 */
import { z } from 'zod'

import validationMessages from '@project/Utils/validationMessages'

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, validationMessages.name.required)
    .email('Please enter a valid email address'),

  password: z
    .string()
    .min(1, validationMessages.password.requiredPass)
    .max(32, validationMessages.password.max),
})

/** Inferred type — always in sync with the schema above. */
export type LoginFormValues = z.infer<typeof loginSchema>
