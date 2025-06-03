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
    z.string().transform(value => [value]) 
  ]).optional(),
  userId: z.string(),
  createdAt: z.date().optional(), 
})

export const getListings = query(async (searchParams?: { query?: string | undefined, condition?: string | undefined, minPrice?: number | undefined, maxPrice?: number | undefined }) => {
  "use server";
  
  try {
    let filter: any = {};
    
    if (searchParams) {
      if (searchParams.query && searchParams.query.trim() !== '') {
        filter.$or = [
          { title: { $regex: searchParams.query, $options: 'i' } },
          { description: { $regex: searchParams.query, $options: 'i' } }
        ];
      }
      
      if (searchParams.condition) {
        filter.condition = searchParams.condition;
      }
      
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

export const getListingById = query(async (id:string) => {
  "use server";
  const objectId = new ObjectId(id); 
  const rawData = await db_ads.findOne({ _id: objectId });
  if (!rawData) return null;

  const data = getlistingSchema.parse(rawData);
  return data;
}, "getListingById");


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
      return null; // null pour empecher prblm de sérialisation
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
      images: [],
      userId: user._id.toString(),
      createdAt: new Date(),
    };

 
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


    validatedListing.images = imagePaths;

  
    await db_ads.insertOne(validatedListing);

    return { success: true };
  } catch (error) {
    console.error("Erreur dans createListing:", error);
    return null; // pour eviter les problèmes de sérialisation
  }
};
export const createListingAction = action(createListing, "createListing");



export const updateListing = async (id: string, form: FormData) => {
  "use server";

  const objectId = new ObjectId(id);
  const existingListing = await db_ads.findOne({ _id: objectId });
  if (!existingListing) throw new Error("Annonce non trouvée");


  const updateData = {
    title: form.has("title") ? String(form.get("title")) : existingListing.title,
    description: form.has("description") ? String(form.get("description")) : existingListing.description,
    price: form.has("price") ? Number(form.get("price")) : existingListing.price,
    condition: form.has("condition") ? String(form.get("condition")) : existingListing.condition,
    images: existingListing.images, 
  };


  const validatedData = listingSchema.parse(updateData);


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

    validatedData.images = imagePaths; 
  }


  await db_ads.updateOne({ _id: objectId }, { $set: validatedData });

  return { message: "Annonce mise à jour", updateData: validatedData };
};

export const updateListingAction = action(updateListing, "updateListing");

export const deleteListing = async (id: string) => {
  "use server";
  console.log("ID reçu pour suppression:", id);
  const objectId = new ObjectId(id);
  const listing = await db_ads.findOne({ _id: objectId });
  
  if (listing?.images) {
    for (const imgPath of listing.images) {
      const filePath = path.join(process.cwd(), "public", imgPath);
      await fs.unlink(filePath).catch(() => {});
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
