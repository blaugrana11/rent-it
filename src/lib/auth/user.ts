// src/lib/auth/user.ts

import bcrypt from "bcryptjs";
import { action, query, redirect, reload } from "@solidjs/router";
import { userSchema } from "./schema";
import { getSession } from "./session";
import { db_users } from "~/lib/db";

export const register = action(async (form: FormData) => {
  "use server";
  const { email, password, pseudo } = userSchema.parse({
    email: form.get("email"),
    password: form.get("password"),
    pseudo: form.get("pseudo"),
  });

  const hashed = await bcrypt.hash(password, 10);
  await db_users.insertOne({ email, password: hashed, pseudo });
  
  throw redirect("/login");
}, "register");

export const login = action(async (formData: FormData) => {
  "use server";
  const { email, password } = userSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const record = await db_users.findOne({ email });
  if (!record) {
    throw new Error("Utilisateur non trouvé");
  }
  const isValid = await bcrypt.compare(password, record.password);
  if (!isValid) {
    throw new Error("Mot de passe incorrect");
  }
  const session = await getSession();
  await session.update({ email });
  return redirect("/"); // Redirige vers la page d'accueil après connexion
}, "login");

export const logout = action(async () => {
  "use server";
  const session = await getSession();
  await session.clear();
  return redirect("/");
});


export const getUser = query(async () => {
  "use server";
  const session = await getSession();
  if (!session.data.email) return null;
  const user = await db_users.findOne({ email: session.data.email });
  if (!user) return null;
  return userSchema.parse(user); 
}, "getUser");