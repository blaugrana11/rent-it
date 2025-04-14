import { createSignal, createEffect } from "solid-js"
import { useSubmission } from "@solidjs/router"
import { login } from "~/lib/auth/user"
import { Field } from "~/components/Field"

export default function LoginForm() {
  const [error, setError] = createSignal("")
  const submission = useSubmission(login)
  
  createEffect(() => {
    if (submission.result) {
      if (!submission.result.success && submission.result.error) {
        setError(submission.result.error)
      } else if (submission.result.success) {
        // Redirection manuelle si nécessaire
        window.location.href = "/"
      }
    }
  })
  
  return (
    <form
      method="post"
      action={login}
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
        autocomplete="current-password"
      />
      
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={submission.pending}
      >
        {submission.pending ? "In progress..." : "Log in"}
      </button>
    </form>
  )
}