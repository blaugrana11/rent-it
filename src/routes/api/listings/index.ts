import { type APIEvent } from "@solidjs/start/server";
import { getListings, createListingAction } from "~/lib/listing";


export async function GET(event: APIEvent) {
  try {
    console.log("GET /api/listings");
    const listings = await getListings();
    return new Response(JSON.stringify(listings), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de la récupération des annonces." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

export async function POST(event: APIEvent) {
  try {
    console.log("POST /api/listings");
    const formData = await event.request.formData();
    console.log("formData", formData);
    const result = await createListingAction(formData);
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erreur lors de la création de l'annonce." }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}