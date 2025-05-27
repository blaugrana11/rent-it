import { type APIEvent } from "@solidjs/start/server";
import { getListings, createListing } from "~/lib/listing";


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

export async function POST(event: APIEvent) {
  try {
    console.log("POST /api/listings");
    const formData = await event.request.formData();
    console.log("formData", formData);
    const result = await createListing(formData);
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