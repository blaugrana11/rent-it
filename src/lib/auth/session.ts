// src/lib/auth/session.ts
import { useSession } from 'vinxi/http'

type SessionData = {
  email?: string
}

export function getSession() {
  'use server'
  return useSession<SessionData>({
    password: import.meta.env.VITE_SESSION_SECRET,
  })
}
