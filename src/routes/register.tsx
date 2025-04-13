// routes/register.tsx ou un composant spécifique
import { register } from "~/lib/auth/user";

export default function RegisterForm() {
  return (
    <form method="post" action={register} class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium">Email</label>
        <input name="email" type="email" required class="border p-2 w-full" />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium">Mot de passe</label>
        <input name="password" type="password" required class="border p-2 w-full" />
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">S'inscrire</button>
    </form>
  );
}
