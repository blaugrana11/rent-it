// src/components/RegisterForm.tsx
import { createSignal } from "solid-js";
import { register } from "~/lib/auth/user";
import { Field } from "~/components/Field";

export default function RegisterForm() {
  const [error, setError] = createSignal("");

  return (
    <form
      method="post"
      action={register}
      class="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-6"
    >
      <h2 class="text-2xl font-bold text-center text-gray-800">Create an account</h2>

      {error() && (
        <div class="text-red-600 bg-red-100 p-2 rounded text-sm">
          {error()}
        </div>
      )}

      <Field
        name="email"
        label="E-mail address"
        type="email"
        placeholder="exemple@domain.com"
      />

      <Field
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
      />

      <button
        type="submit"
        class="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
      >
        Register
      </button>
    </form>
  );
}
