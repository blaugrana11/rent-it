import type { APIEvent } from '@solidjs/start/server'; 
import { getListingById, updateListing, deleteListing } from "~/lib/listing";  
import { useParams } from '@solidjs/router'

export async function GET(event: APIEvent) {
  try {
    const id = event.params.id; // Récupère l'ID depuis l'URL
    if (!id) return new Response(JSON.stringify({ error: "ID requis" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
    
    const listing = await getListingById(id);
    if (!listing) return new Response(JSON.stringify({ error: "Annonce non trouvée" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
    
    return new Response(JSON.stringify(listing), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de la récupération de l'annonce." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// export async function PUT(event: APIEvent) {
//   try {
//     const id = event.params.id;
//     console.log("PUT /api/listings/:id", id);
//     if (!id) return new Response(JSON.stringify({ error: "ID requis" }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" }
//     });

//     const formData = await event.request.formData();

//     const result = await updateListing(id, formData);
    
//     return new Response(JSON.stringify({ message: "Annonce mise à jour", result }), {
//       headers: { "Content-Type": "application/json" }
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: "Erreur lors de la mise à jour de l'annonce." }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// }

// export async function DELETE(event: APIEvent) {
//   try {
//     const id = event.params.id;
//     if (!id) return new Response(JSON.stringify({ error: "ID requis" }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" }
//     });
//     console.log("DELETE /api/listings/:id", id);
//     await deleteListing(id);
//     return new Response(JSON.stringify({ message: "Annonce supprimée" }), {
//       headers: { "Content-Type": "application/json" }
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: "Erreur lors de la suppression de l'annonce." }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// }