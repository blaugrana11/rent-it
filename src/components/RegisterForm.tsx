// src/components/RegisterForm.tsx
import { createSignal } from "solid-js"
import { register } from "~/lib/auth/user"

export default function RegisterForm() {
  const [error, setError] = createSignal("")

  return (
    <form
      method="post"
      action={register}
      class="space-y-4 bg-white p-6 rounded shadow max-w-md mx-auto"
    >
      <h2 class="text-2xl font-semibold">Inscription</h2>

      {error() && <p class="text-red-500">{error()}</p>}

      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          type="email"
          required
          class="w-full mt-1 border p-2 rounded"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          name="password"
          type="password"
          required
          class="w-full mt-1 border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        S'inscrire
      </button>
    </form>
  )
}
