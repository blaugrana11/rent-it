import { type APIEvent } from "@solidjs/start/server";
import { logout } from "~/lib/auth/user";


export async function POST(event: APIEvent) {
  try {
    console.log("POST /api/logout");
    const result = await logout();
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de la déconnexion." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
