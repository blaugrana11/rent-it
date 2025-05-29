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

export const listingSchema = z.object({
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
export const createListing = async (form: FormData) => {
  "use server";
  try {
    const title = form.get("title")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";
    const price = Number(form.get("price") ?? 0);
    const condition = form.get("condition")?.toString() ?? "";
    const imageFiles = form.getAll("images") as File[];

    const session = await getSession();
    if (!session.data.email) {
      return null; // retour minimal : évite erreur de sérialisation
    }

    const user = await db_users.findOne({ email: session.data.email });
    if (!user) {
      return null;
    }

    const listingData = {
      title,
      description,
      price,
      condition,
      images: [], // temporairement vide
      userId: user._id.toString(),
      createdAt: new Date(),
    };

    // Valide les champs de base sans les images
    const validatedListing = listingSchema.parse(listingData);

    const imagePaths: string[] = [];

    for (const file of imageFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await fs.writeFile(filePath, buffer);
      imagePaths.push(`/uploads/${fileName}`);
    }

    // Ajoute les chemins d'image à l'annonce validée
    validatedListing.images = imagePaths;

    // Insertion dans la base de données
    await db_ads.insertOne(validatedListing);

    // Ne retourne rien (ou juste un booléen)
    return { success: true };
  } catch (error) {
    console.error("Erreur dans createListing:", error);
    return null; // Ne retourne pas l'erreur pour éviter la sérialisation
  }
};
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
  const result = await db_ads.deleteOne({ _id: objectId });
  if (result.deletedCount === 1) {
    return { result, message: "Annonce supprimée avec succès" };
  } else {
    return { result, message: "Aucune annonce trouvée avec cet ID" };
  }
};
export const deleteListingAction = action(deleteListing, "deleteListing");
