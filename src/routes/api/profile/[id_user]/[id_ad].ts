import type { APIEvent } from '@solidjs/start/server'; 
import { deleteListing } from "~/lib/listing";  

export async function DELETE(event: APIEvent) {
  try {
    console.log("DELETE /api/listings/:id");
    const url = new URL(event.request.url);
    const pathSegments = url.pathname.split('/');
    const adId = pathSegments[pathSegments.length - 1];
    
    console.log("Listing ID to delete:", adId);
    if (!adId) return new Response(JSON.stringify({ error: "ID requis" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
    console.log("Deleting listing with ID:", adId);
    await deleteListing(adId);
    return new Response(JSON.stringify({ message: "Annonce supprimée" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de la suppression de l'annonce." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}