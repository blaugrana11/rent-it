import { db_ads, db_users } from "~/lib/db";
import { getUserId } from "~/lib/auth/user";
import { getSession } from "~/lib/auth/session";
import { createAsync } from "@solidjs/router";
import { action, query } from "@solidjs/router";
import { z } from "zod";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";

export const getlistingSchema = z.object({
  _id: z.any().optional().transform((val) => val?.toString()),
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description est trop courte"),
  price: z.coerce.number().min(0, "Le prix doit être positif"),
  condition: z.enum(["neuf", "comme neuf", "bon état", "état moyen", "mauvais état"]).optional(),
  images: z.union([
    z.array(z.string()),
    z.string().transform(value => [value]) // Transforme une chaîne unique en tableau
  ]).optional(),
  userId: z.string().optional(),
  createdAt: z.date().optional(), 
}); // Images sous forme d'URL

const listingSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description est trop courte"),
  price: z.coerce.number().min(0, "Le prix doit être positif"),
  condition: z.enum(["neuf", "comme neuf", "bon état", "état moyen", "mauvais état"]).optional(),
  images: z.union([
    z.array(z.string()),
    z.string().transform(value => [value]) // Transforme une chaîne unique en tableau
  ]).optional(),
  userId: z.string(),
  createdAt: z.date().optional(), 
})

// Mise à jour de la fonction getListings pour prendre en charge la recherche
export const getListings = query(async (searchParams?: { query?: string | undefined, condition?: string | undefined, minPrice?: number | undefined, maxPrice?: number | undefined }) => {
  "use server";
  
  try {
    let filter: any = {};
    
    // Construire le filtre de recherche si des paramètres sont fournis
    if (searchParams) {
      // Recherche textuelle (dans le titre et la description)
      if (searchParams.query && searchParams.query.trim() !== '') {
        filter.$or = [
          { title: { $regex: searchParams.query, $options: 'i' } },
          { description: { $regex: searchParams.query, $options: 'i' } }
        ];
      }
      
      // Filtre par état/condition
      if (searchParams.condition) {
        filter.condition = searchParams.condition;
      }
      
      // Filtre par prix
      let priceFilter = {};
      if (searchParams.minPrice !== undefined) {
        priceFilter = { ...priceFilter, $gte: searchParams.minPrice };
      }
      if (searchParams.maxPrice !== undefined) {
        priceFilter = { ...priceFilter, $lte: searchParams.maxPrice };
      }
      
      if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
      }
    }
    
    // Exécuter la requête avec le filtre
    const rawData = await db_ads.find(filter).toArray();
    
    const data = getlistingSchema.array().parse(rawData);
    return data
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Erreur de validation Zod:", error.errors);
      throw new Error("Données invalides dans la base de données");
    }
    
    console.error("Erreur lors de la récupération des annonces:", error);
    throw error;
  }
}, "getListings");

// Récupérer une annonce par son ID
export const getListingById = query(async (id:string) => {
  "use server";
  const objectId = new ObjectId(id); // Assurer que `id` est sous forme de string
  const rawData = await db_ads.findOne({ _id: objectId });
  if (!rawData) return null;

  const data = getlistingSchema.parse(rawData);
  return data;
}, "getListingById");

// Ajouter une annonce
// Ajouter une annonce 
export const createListing = async (form: FormData) => {
  "use server";
  try {
    console.log("Données reçues pour création:", form);
    
    // Récupérer l'utilisateur connecté
    const session = await getSession();
    if (!session.data.email) {
      return { error: "User not authenticated" };
    }
    
    // Trouver l'utilisateur dans la base de données
    const user = await db_users.findOne({ email: session.data.email });
    if (!user) {
      return { error: "User not found" };
    }

    // const user = createAsync(() => getUserId());    
    // Extraire les données du formulaire sans traiter les images
    const listingData = {
      title: form.get("title"),
      description: form.get("description"),
      price: Number(form.get("price")),
      condition: form.get("condition"),
      images: [], // Vide pour l'instant
      userId: user._id.toString(), // Ajouter l'ID de l'utilisateur
      createdAt: new Date(), // Facultatif: ajouter la date de création
    };
    
    console.log("Données extraites du formulaire:", listingData);
    
    // Mettre à jour le schéma Zod pour inclure userId
    // Vous devrez modifier listingSchema ailleurs dans votre code
    const validatedListing = listingSchema.parse(listingData);
    
    console.log("Données validées:", validatedListing);
    
    // Si la validation réussit, on traite les images
    const imageFiles = form.getAll("images") as File[];
    console.log("Images reçues:", imageFiles);
    const imagePaths: string[] = [];
    
    for (const file of imageFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);
      
      await fs.writeFile(filePath, buffer);
      imagePaths.push(`/uploads/${fileName}`);
    }
    
    validatedListing.images = imagePaths; // Ajouter les images validées
    
    // Insertion dans la base de données
    const result = await db_ads.insertOne(validatedListing);
    return { insertedId: result.insertedId };
  } catch (error) {
    return { error: String(error) };
  }
}
export const createListingAction = action(createListing, "createListing");


// Mettre à jour une annonce
export const updateListing = async (id: string, form: FormData) => {
  "use server";

  const objectId = new ObjectId(id);
  const existingListing = await db_ads.findOne({ _id: objectId });
  if (!existingListing) throw new Error("Annonce non trouvée");

  // Extraire les champs texte du formulaire (sans images)
  const updateData = {
    title: form.has("title") ? String(form.get("title")) : existingListing.title,
    description: form.has("description") ? String(form.get("description")) : existingListing.description,
    price: form.has("price") ? Number(form.get("price")) : existingListing.price,
    condition: form.has("condition") ? String(form.get("condition")) : existingListing.condition,
    images: existingListing.images, // Par défaut, on garde les anciennes images
  };

  //Valider les données AVANT d'uploader les images
  const validatedData = listingSchema.parse(updateData);

  //Gérer les images UNIQUEMENT si la validation réussit
  const imageFiles = form.getAll("images") as File[];
  if (imageFiles.length > 0) {
    const imagePaths: string[] = [];
    
    for (const file of imageFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);
      
      await fs.writeFile(filePath, buffer);
      imagePaths.push(`/uploads/${fileName}`);
    }

    validatedData.images = imagePaths; // Remplacer les images uniquement après validation
  }

  // Mettre à jour l'annonce dans la base de données
  await db_ads.updateOne({ _id: objectId }, { $set: validatedData });

  return { message: "Annonce mise à jour", updateData: validatedData };
};

export const updateListingAction = action(updateListing, "updateListing");

// Supprimer une annonce
export const deleteListing = async (id: string) => {
  "use server";
  console.log("ID reçu pour suppression:", id);
  const objectId = new ObjectId(id); // Convertir `id` en ObjectId
  const listing = await db_ads.findOne({ _id: objectId });
  
  if (listing?.images) {
    for (const imgPath of listing.images) {
      const filePath = path.join(process.cwd(), "public", imgPath);
      await fs.unlink(filePath).catch(() => {}); // Supprime le fichier si existant
    }
  }
  return await db_ads.deleteOne({ _id: objectId });
};
export const deleteListingAction = action(deleteListing, "deleteListing");
