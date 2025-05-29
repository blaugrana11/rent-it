// src/lib/auth/user.ts

import bcrypt from "bcryptjs";
import { action, query, redirect } from "@solidjs/router";
import { userSchema, userSchemaId } from "./schema";
import { getSession } from "./session";
import { db_users, db_ads } from "~/lib/db";
import { ObjectId } from "mongodb";
import { getlistingSchema } from "../listing";

declare global {
  var userTokens: Map<string, {
    _id?: string;
    email: string;
    pseudo: string;
    createdAt: Date;
  }> | undefined;
}

export const register = async (form: FormData) => {
  "use server";
  const { email, password, pseudo } = userSchema.parse({
    email: form.get("email"),
    password: form.get("password"),
    pseudo: form.get("pseudo"),
  });

  const hashed = await bcrypt.hash(password, 10);
  await db_users.insertOne({ email, password: hashed, pseudo });
  
  return { success: true, email, pseudo };
};
export const registerAction = action(async (form: FormData) => {
  await register(form);
  throw redirect("/login");
});




export const login = async (formData: FormData) => {
  "use server";
  console.log("login", formData);
  
  const { email, password } = userSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  
  const record = await db_users.findOne({ email });
  const id_string = record?._id.toString();
  if (!record) {
    throw new Error("Utilisateur non trouvé");
  }
  
  const isValid = await bcrypt.compare(password, record.password);
  if (!isValid) {
    throw new Error("Mot de passe incorrect");
  }
  
  console.log("login success", email);
  
  // Créer la session (pour l'app web)
  const session = await getSession();
  await session.update({ email });
  
  // Créer aussi un token (pour l'app mobile)
  const token = crypto.randomUUID();
  global.userTokens = global.userTokens || new Map();
  global.userTokens.set(token, { 
    _id: id_string,
    email: record.email, 
    pseudo: record.pseudo,
    createdAt: new Date()
  });
  
  // Retourner les deux informations
  return { 
    success: true, 
    email,
    token, // Pour l'app mobile
    user: { email: record.email, pseudo: record.pseudo }
  };
};

export const loginAction = action(async (form: FormData) => {
  "use server"
  await login(form);
  throw redirect("/");
});


export const logout = async () => {
  "use server";
  const session = await getSession();
  await session.clear();
  return redirect("/");
};
export const logoutAction = action(logout, "logout");


export const getUser = query(async () => {
  "use server";
  console.log("getUser called");
  const session = await getSession();
  console.log("Session data:", session.data);
  
  if (!session.data.email) {
    console.log("No email in session");
    return null;
  }
  
  const user = await db_users.findOne({ email: session.data.email });
  console.log("User found in DB:", user ? "yes" : "no");
  
  if (!user) return null;
  return userSchema.parse(user);
}, "getUser");



export const getUserId = query(async () => {
  "use server";
  const session = await getSession();
  if (!session.data.email) return null;
  const user = await db_users.findOne({ email: session.data.email });
  if (!user) return null;
  return userSchemaId.parse(user); 
}, "getUserId");



export const getUserListings = query(async () => {
  "use server";
  
  // Récupérer l'utilisateur connecté
  const user = await getUserId();
  if (!user) return null;
  
  // Récupérer les annonces de l'utilisateur
  const listings = await db_ads.find({ userId: user._id.toString() }).toArray();
  return listings;
}, "getUserListings");


export const getUserById = query(async (userId:string) => {
  "use server";
  console.log("hello", userId);
  const id = new ObjectId(userId);
  console.log("getUserById", id);
  const user = await db_users.findOne({ _id: id});
  console.log(JSON.stringify(user, null, 2))
  if (!user) return null;
  return userSchemaId.parse(user); 
}, "getUserById");



export const getUserListingsById = query(async (idUser:string) => {
  "use server";
    
  // Récupérer les annonces de l'utilisateur
  const data = await db_ads.find({ userId: idUser }).toArray();
  
  const listings = getlistingSchema.array().parse(data);
  return listings;
}, "getUserListingsById");