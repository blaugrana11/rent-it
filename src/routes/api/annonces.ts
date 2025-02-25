// src/routes/api/annonces.ts
import { MongoClient } from "mongodb";
import type { APIEvent } from "@solidjs/start/server";

// URL de connexion à MongoDB
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

// Méthode POST modifiée pour SolidStart
export async function POST({ request }: APIEvent) {
  try {
    console.log("Requête POST reçue");
    
    // Dans SolidStart, l'objet de requête est passé via event.request
    const annonce = await request.json();
    console.log("Données reçues:", annonce);
    
    const client = await getMongoClient();
    const db = client.db(dbName);
    const collection = db.collection("ads");
    
    const result = await collection.insertOne(annonce);
    console.log("Insertion réussie, ID:", result.insertedId);
    
    return new Response(
      JSON.stringify({ message: "Annonce ajoutée avec succès", id: result.insertedId }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de l'ajout de l'annonce", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  // Ne fermez pas la connexion à chaque requête
}

// Méthode GET modifiée pour SolidStart
export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db(dbName);
    const collection = db.collection("ads");
    
    const annonces = await collection.find().toArray();
    
    return new Response(JSON.stringify(annonces), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching annonces:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des annonces", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}