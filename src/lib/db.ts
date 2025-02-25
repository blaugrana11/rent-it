import { MongoClient } from "mongodb";

// URL de connexion à MongoDB
export const url = "mongodb://localhost:27017";
export const dbName = "rentit";
export const client = new MongoClient(url);