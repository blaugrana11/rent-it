import { useSubmission } from "@solidjs/router"
import { login } from "~/lib/auth/user"
import { Field } from "~/components/Field"

export default function LoginForm() {
  const submission = useSubmission(login)

  return (
    <form
      method="post"
      action={login}
      class="bg-white max-w-md mx-auto mt-16 p-8 rounded-2xl shadow-xl space-y-6 border border-gray-200"
    >
      <h2 class="text-3xl font-bold text-gray-800 text-center">Log in</h2>

      {submission.error && (
        <div class="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
          {submission.error}
          Incorrect password or email address.
          Please try again.
        </div>
      )}

      <div class="space-y-4">
        <Field
          name="email"
          label="Email address"
          type="email"
          placeholder="example@domain.com"
        />

        <Field
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-150"
        disabled={submission.pending}
      >
        {submission.pending ? "Logging in..." : "Log in"}
      </button>
    </form>
  )
}
