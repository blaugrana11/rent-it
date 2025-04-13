// src/lib/auth/user.ts

'use server'

import bcrypt from 'bcryptjs'
import { action, query } from "@solidjs/router";
import { userSchema } from './schema'
import { getSession } from './session'
import { db_users } from '~/lib/db' // adapte à ta config mongo

export const register = action(async (form: FormData) => {
    const { email, password } = userSchema.parse({
      email: form.get("email"),
      password: form.get("password"),
    });
  
    const hashed = await bcrypt.hash(password, 10);
    await db_users.insertOne({ email, password: hashed });
  }, "register");

  
// lib/auth/user.ts
export const login = action(async (formData: FormData) => {
    const { email, password } = userSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    })
  
    const record = await db_users.findOne({ where: { email } })
    const isValid = await bcrypt.compare(password, record!.password)
  
    if (!isValid) throw new Error("Mot de passe incorrect")
  
    const session = await getSession()
    await session.update({ email })
  }, "login")
  

export const logout = action(async () => {
    'use server'
    const session = await getSession()
    await session.clear()
  })

  export const getUser = query(async () => {
  try {
    const session = await getSession()
    if (!session.data.email) return null
    return await db_users.findOne({ email: session.data.email })
  } catch {
    return null
  }
}, 'getUser')
