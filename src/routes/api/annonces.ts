import { MongoClient } from "mongodb";
import type { APIEvent } from "@solidjs/start/server";
import { writeFile } from "fs/promises";

// Configuration MongoDB
const url = "mongodb://localhost:27017";
const dbName = "rentit";
const client = new MongoClient(url);

// Fonction pour obtenir un client MongoDB réutilisable
let clientPromise: Promise<MongoClient> | null = null;
function getMongoClient() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(url);
  }
  return clientPromise;
}

// 📌 Fonction pour sauvegarder l'image dans le dossier public/uploads
async function saveImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = `public/uploads/${file.name}`;
  await writeFile(filePath, buffer);
  return filePath; // Retourne le chemin de l'image
}

// 🚀 API POST : Ajouter une annonce avec image
export async function POST(event: APIEvent) {
  try {
    console.log("Requête POST reçue");

    // Récupérer les données envoyées
    const formData = await event.request.formData();
    const annonce = JSON.parse(formData.get("data") as string); // Les infos de l'annonce
    const file = formData.get("image") as File | null; // L'image

    if (!annonce || !file) {
      return new Response(JSON.stringify({ error: "Données incomplètes" }), { status: 400 });
    }

    // Sauvegarde de l'image
    const imagePath = await saveImage(file);

    // Connexion à MongoDB
    const client = await getMongoClient();
    const db = client.db(dbName);
    const collection = db.collection("ads");

    // Insérer l'annonce avec l'image
    const result = await collection.insertOne({ ...annonce, image: imagePath });

    console.log("Insertion réussie, ID:", result.insertedId);
    return new Response(JSON.stringify({ message: "Annonce ajoutée", id: result.insertedId }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erreur :", error);
    return new Response(JSON.stringify({ error: "Erreur d'ajout" }), { status: 500 });
  }
}

// 🚀 API GET : Récupérer toutes les annonces
export async function GET(event: APIEvent) {
  try {
    console.log("Requête GET reçue");

    const client = await getMongoClient();
    const db = client.db(dbName);
    const collection = db.collection("ads");

    // Récupérer toutes les annonces
    const annonces = await collection.find().toArray();

    return new Response(JSON.stringify(annonces), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    return new Response(
      JSON.stringify({ error: "Erreur de récupération" }),
      { status: 500 }
    );
  }
}
