import { type APIEvent } from "@solidjs/start/server";
import { getUser } from "~/lib/auth/user";


export async function GET(event: APIEvent) {
  try {
    console.log("GET /api/me");
    const user = await getUser();
    return new Response(JSON.stringify(user), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de la récupération de l'utilisateur." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}