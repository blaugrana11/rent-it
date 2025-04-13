// src/components/LoginForm.tsx
import { createSignal } from "solid-js"
import { log } from "vinxi/dist/types/lib/logger"
import { login } from "~/lib/auth/user"

const loginAction = login

export default function LoginForm() {
  const [error, setError] = createSignal("")

  return (
    <form
      method="post"
      action={loginAction}
      class="space-y-4 bg-white p-6 rounded shadow max-w-md mx-auto"
    >
      <h2 class="text-2xl font-semibold">Connexion</h2>

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
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Se connecter
      </button>
    </form>
  )
}
