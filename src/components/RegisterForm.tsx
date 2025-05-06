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
      class="bg-white max-w-md mx-auto p-8 rounded-2xl shadow-xl space-y-6 border border-gray-200"
    >
  

      {error() && (
        <div class="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
          {error()}
        </div>
      )}

      <div class="space-y-4">
        <Field
          name="pseudo"
          label="Username"
          type="text"
          placeholder="e.g. johndoe123"
        />

        <Field
          name="email"
          label="Email Address"
          type="email"
          placeholder="example@domain.com"
        />

        <Field
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-150"
      >
        Register
      </button>
    </form>
  );
}
