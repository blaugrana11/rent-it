import { MongoClient } from "mongodb";
import type { APIEvent } from "@solidjs/start/server";
import { writeFile } from "fs/promises";
import { join } from "path";

const url = "mongodb://localhost:27017";
const dbName = "rentit";
const client = new MongoClient(url);

export async function POST(event: APIEvent) {
  try {
    console.log("Requête POST reçue");

    // Récupérer le formData contenant l'annonce et le fichier image
    const formData = await event.request.formData();
    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const image = formData.get("image") as File;

    if (!title || !price || !image) {
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });
    }

    // Sauvegarde de l'image dans le dossier public/uploads
    const fileName = `${Date.now()}-${image.name}`;
    const filePath = join(process.cwd(), "public/uploads", fileName);
    const fileBuffer = Buffer.from(await image.arrayBuffer());
    await writeFile(filePath, fileBuffer);

    // Sauvegarde des données dans MongoDB
    const annonce = { title, price, imageUrl: `/uploads/${fileName}` };
    const db = client.db(dbName);
    const collection = db.collection("ads");
    const result = await collection.insertOne(annonce);

    return new Response(JSON.stringify({ message: "Annonce ajoutée", id: result.insertedId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

export async function GET() {
  try {
    const db = client.db(dbName);
    const collection = db.collection("ads");
    const annonces = await collection.find().toArray();

    return new Response(JSON.stringify(annonces), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
