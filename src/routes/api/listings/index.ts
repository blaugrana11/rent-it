import { type APIEvent } from "@solidjs/start/server";
import { getListings, createListing } from "~/lib/listing";
import { db_users, db_ads } from "~/lib/db"; 
import { listingSchema } from "~/lib/listing"; 
import { ZodError } from "zod";
import { getSession } from "~/lib/auth/session";
import path from "path";
import fs from "fs/promises";

export async function GET(event: APIEvent) {
  try {
    console.log("GET /api/listings");

    const url = new URL(event.request.url);
    const query = url.searchParams.get("query") ?? undefined;
    const condition = url.searchParams.get("condition") ?? undefined;
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");

    // Conversion des prix en number si présents
    const params = {
      query,
      condition,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };

    const listings = await getListings(params);

    return new Response(JSON.stringify(listings), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Erreur GET /api/listings:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des annonces." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}





async function getUserFromRequest(event: APIEvent) {

  const authHeader = event.request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {

    console.log("Mobile request with token");
    const token = authHeader.replace('Bearer ', '');
    
    global.userTokens = global.userTokens || new Map();
    const userData = global.userTokens.get(token);
    const user = await db_users.findOne({ email: userData!.email });
    
    if (!userData) {
      return null;
    }
    
    return user;
  } else {

    console.log("Web request with session");
    const session = await getSession();
    if (!session.data.email) {
      return null;
    }
    
    const user = await db_users.findOne({ email: session.data.email });
    return user;
  }
}

export async function POST(event: APIEvent) {
  try {
    console.log("POST /api/listings - Creating new listing");
    

    const user = await getUserFromRequest(event);
    if (!user) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const formData = await event.request.formData();
    
    const title = formData.get("title")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const price = Number(formData.get("price") ?? 0);
    const condition = formData.get("condition")?.toString() ?? "";
    const imageFiles = formData.getAll("images") as File[];

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
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(process.cwd(), "public/uploads", fileName);

        
        const uploadsDir = path.join(process.cwd(), "public/uploads");
        await fs.mkdir(uploadsDir, { recursive: true });

        await fs.writeFile(filePath, buffer);
        imagePaths.push(`/uploads/${fileName}`);
      }
    }


    validatedListing.images = imagePaths;


    const result = await db_ads.insertOne(validatedListing);

    console.log("Listing created successfully:", result.insertedId);

    return new Response(JSON.stringify({ 
      success: true, 
      id: result.insertedId.toString() 
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Erreur dans POST /api/listings:", error);
    
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ 
        error: "Données invalides", 
        details: error.issues 
      }), {
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      };
    }
    
    return new Response(JSON.stringify({ 
      error: "Erreur lors de la création de l'annonce" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}