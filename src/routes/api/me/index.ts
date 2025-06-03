// api/me.ts
import { type APIEvent } from "@solidjs/start/server";
import { getUser } from "~/lib/auth/user";

export async function GET(event: APIEvent) {
  try {
    console.log("GET /api/me");
    
    // Vérifier d'abord si c'est une requête avec token
    const authHeader = event.request.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {

      console.log("Mobile request with token");
      const token = authHeader.replace('Bearer ', '');
      
      global.userTokens = global.userTokens || new Map();
      const userData = global.userTokens.get(token);
      
      if (!userData) {
        return new Response(JSON.stringify({ error: "Token invalide" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      console.log("User data from token:", userData);
      return new Response(JSON.stringify(userData), {
        headers: { "Content-Type": "application/json" }
      });
    } else {

      console.log("Web request with session");
      const user = await getUser();
      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
  } catch (error) {
    console.error("Error in /api/me:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de la récupération de l'utilisateur." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}