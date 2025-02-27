import { MongoClient, ObjectId } from "mongodb";
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
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const image = formData.get("image") as File;

    if (!title || !description || !price || !image) {
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });
    }

    // // Sauvegarde de l'image dans le dossier public/uploads
    // const fileName = `${Date.now()}-${image.name}`;
    // const filePath = join(process.cwd(), "public/uploads", fileName);     A ENCORE CORRIGER !!!!!!!!
    // const fileBuffer = Buffer.from(await image.arrayBuffer());
    // await writeFile(filePath, fileBuffer);

    // Sauvegarde des données dans MongoDB
    //const annonce = { title, description, price, image: `/uploads/${fileName}` };
    const annonce = { title, description, price, image: `public/uploads/${title.toLowerCase()}.jpeg` };
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


export async function PUT(event: APIEvent) {
  try {
    console.log("Requête PUT reçue");

    
    const formData = await event.request.formData();
    const id = formData.get("_id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const image = formData.get("image") as File;

    if (!id || !title || !description || !price || !image) {
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });
    }

    const db = client.db(dbName);
    const collection = db.collection("ads");

    let updateData: any = { title, price };

    // Si une nouvelle image est fournie, on la remplace
    // if (image) {
    //   const fileName = `${Date.now()}-${image.name}`;
    //   const filePath = join(process.cwd(), "public/uploads", fileName);
    //   const fileBuffer = Buffer.from(await image.arrayBuffer());
    //   await writeFile(filePath, fileBuffer);
    //   updateData.imageUrl = `/uploads/${fileName}`;
    // }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Annonce non trouvée" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Annonce mise à jour" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}


export async function DELETE(event: APIEvent) {
  try {
    console.log("Requête DELETE reçue");

    const url = new URL(event.request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID manquant" }), { status: 400 });
    }

    const db = client.db(dbName);
    const collection = db.collection("ads");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Annonce non trouvée" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Annonce supprimée" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
