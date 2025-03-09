import { db_ads } from "~/lib/db";
import { action, query } from "@solidjs/router";
import { z } from "zod";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";

const listingSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description est trop courte"),
  price: z.number().min(0, "Le prix doit être positif"),
  condition: z.enum(["neuf", "comme neuf", "bon état", "état moyen", "mauvais état"]),
  images: z.array(z.string()).optional(), // Images sous forme d'URL
});

// ✅ Récupérer toutes les annonces
export const getListings = query(async () => {
  "use server";
  return await db_ads.find().toArray(); // Convertir le curseur en tableau
}, "getListings");

// ✅ Récupérer une annonce par son ID
export const getListingById = query(async (id: number) => {
  "use server";
  const objectId = new ObjectId(id.toString()); // Assurer que `id` est sous forme de string
  return await db_ads.findOne({ _id: objectId });
}, "getListingById");

// ✅ Ajouter une annonce
export const createListing = async (form: FormData) => {
  "use server";


  // Traitement des images
  const imageFiles = form.getAll("images") as File[];
  const imagePaths: string[] = [];

  for (const file of imageFiles) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    await fs.writeFile(filePath, buffer);
    imagePaths.push(`/uploads/${fileName}`); // On stocke seulement le chemin relatif
  }

  // Validation avec Zod
  const listing = listingSchema.parse({
    title: form.get("title"),
    description: form.get("description"),
    price: Number(form.get("price")),
    condition: form.get("condition"),
    images: imagePaths,
  });

  const result = await db_ads.insertOne(listing); // `insertOne()` remplace `create()`
  return { insertedId: result.insertedId };
};
export const createListingAction = action(createListing);

// ✅ Mettre à jour une annonce
export const updateListing = async ({
    id,
    ...data
  }: {
    id: number;
    title?: string;
    description?: string;
    price?: number;
    condition?: string;
    images?: string[];
  }) => {
    "use server";
    const objectId = new ObjectId(id.toString()); // Convertir `id` en ObjectId
    return await db_ads.updateOne({ _id: objectId }, { $set: data }); // Utiliser ObjectId
  };

export const updateListingAction = action(updateListing);

// ✅ Supprimer une annonce
export const deleteListing = async (id: number) => {
  "use server";
  const objectId = new ObjectId(id.toString()); // Convertir `id` en ObjectId
  const listing = await db_ads.findOne({ _id: objectId });

  if (listing?.images) {
    for (const imgPath of listing.images) {
      const filePath = path.join(process.cwd(), "public", imgPath);
      await fs.unlink(filePath).catch(() => {}); // Supprime le fichier si existant
    }
  }
  return await db_ads.deleteOne({ _id: objectId });
};
export const deleteListingAction = action(deleteListing);
