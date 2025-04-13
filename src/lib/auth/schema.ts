// src/lib/auth/schema.ts
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mot de passe trop court"),
})
