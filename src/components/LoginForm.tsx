// src/components/LoginForm.tsx
import { createSignal } from "solid-js"
import { login } from "~/lib/auth/user"
import { Field } from "~/components/Field";

const loginAction = login

export default function LoginForm() {
  const [error, setError] = createSignal("")

  return (
    <form
      method="post"
      action={loginAction}
      class="space-y-4 bg-white p-6 rounded shadow max-w-md mx-auto"
    >
      <h2 class="text-2xl font-semibold">Connection</h2>

      {error() && <p class="text-red-500">{error()}</p>}

      <Field
        name="email"
        label="E-mail address"
        type="email"
        placeholder="example@domain.com"
      />

      <Field
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
      />

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Log in
      </button>
    </form>
  )
}
