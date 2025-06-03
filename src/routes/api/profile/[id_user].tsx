// api/profile/[id].ts
import { type APIEvent } from "@solidjs/start/server";
import { getUserListingsById } from "~/lib/auth/user";



async function getUserFromRequest(event: APIEvent) {
  const authHeader = event.request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    console.log("Mobile request with token");
    const token = authHeader.replace('Bearer ', '');
    
    global.userTokens = global.userTokens || new Map();
    const userData = global.userTokens.get(token);
    
    if (!userData) {
      return null;
    }
    
    return userData; 
  }
  
  return null;
}

export async function GET(event: APIEvent) {
  try {
    console.log("GET /api/profile/[id]");
    

    const url = new URL(event.request.url);
    const pathSegments = url.pathname.split('/');
    const userId = pathSegments[pathSegments.length - 1]; // Dernier segment
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "ID utilisateur manquant" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    console.log("Requested user ID:", userId);
    

    const currentUser = await getUserFromRequest(event);
    if (!currentUser) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    console.log("Current user:", currentUser.email);
    

    const listings = await getUserListingsById(userId);
    
    console.log(`Found ${listings.length} listings for user ${userId}`);
    
    return new Response(JSON.stringify({
      success: true,
      listings,
      user: {
        id: userId,
  
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error in /api/profile/[id]:", error);
    return new Response(JSON.stringify({ 
      error: "Erreur lors de la récupération des annonces",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}