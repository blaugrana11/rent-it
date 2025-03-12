import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const dbName = "rentit";
const client = new MongoClient(url);
export const db = client.db(dbName);
export const db_ads = db.collection("ads");