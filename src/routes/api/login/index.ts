import { type APIEvent } from "@solidjs/start/server";
import { login } from "~/lib/auth/user";


export async function POST(event: APIEvent) {
  console.log("POST /api/login");
  
  try {
    console.log("POST /api/login");
    const formData = await event.request.formData();
    console.log("formData", formData);
    const result = await login(formData);
    console.log("result", result);
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erreur lors de la connexion" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}