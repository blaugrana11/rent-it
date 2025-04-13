// src/components/RegisterForm.tsx
import { createSignal } from "solid-js";
import { register } from "~/lib/auth/user";
import { Field } from "~/components/Field"; // On suppose que tu extrais le Field dans un fichier

export default function RegisterForm() {
  const [error, setError] = createSignal("");

  return (
    <form
      method="post"
      action={register}
      class="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-6"
    >
      <h2 class="text-2xl font-bold text-center text-gray-800">Créer un compte</h2>

      {error() && (
        <div class="text-red-600 bg-red-100 p-2 rounded text-sm">
          {error()}
        </div>
      )}

      <Field
        name="email"
        label="Adresse e-mail"
        type="email"
        placeholder="exemple@domaine.com"
      />

      <Field
        name="password"
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
      />

      <button
        type="submit"
        class="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
      >
        S’inscrire
      </button>
    </form>
  );
}
