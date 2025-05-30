// src/lib/auth/schema.ts
import { z } from 'zod'
import { ObjectId } from "mongodb";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password too short"),
  pseudo: z.string().min(3, "Pseudo too short").optional(),
})

export const userSchemaId = z.object({
  _id: z.any().transform((val) => val.toString()),
  email: z.string().email(),
  password: z.string().min(8, "Password too short"),
  pseudo: z.string().min(3, "Pseudo too short"),
})
