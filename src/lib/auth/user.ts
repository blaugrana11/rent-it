// src/lib/auth/user.ts

import bcrypt from 'bcryptjs'
import { action, query, redirect } from "@solidjs/router";
import { userSchema } from './schema'
import { getSession } from './session'
import { db_users } from '~/lib/db'

export const register = action(async (form: FormData) => {
    'use server'
    const { email, password } = userSchema.parse({
      email: form.get("email"),
      password: form.get("password"),
    });
  
    const hashed = await bcrypt.hash(password, 10);
    await db_users.insertOne({ email, password: hashed });
    return redirect("/login");
  }, "register");

  
  export const login = action(async (formData: FormData) => {
    'use server'
    try {
      const { email, password } = userSchema.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      })
      const record = await db_users.findOne({ email })
      if (!record) {
        return { success: false, error: "Utilisateur non trouvé" }
      }
      const isValid = await bcrypt.compare(password, record.password)
      if (!isValid) {
        return { success: false, error: "Mot de passe incorrect" }
      }
      const session = await getSession()
      await session.update({ email })
      
      return redirect("/")
      //return { success: true} 

    } catch (error) {
      console.error("Erreur de connexion:", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur de connexion inconnue" 
      }
    }
  }, "login")
  

export const logout = action(async () => {
    'use server'
    const session = await getSession()
    await session.clear()
    return redirect("/login")
  })

  export const getUser = query(async () => {
    'use server'
  try {
    const session = await getSession()
    if (!session.data.email) return null
    return await db_users.findOne({ email: session.data.email })
  } catch {
    return null
  }
}, 'getUser')
