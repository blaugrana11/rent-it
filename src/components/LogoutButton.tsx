// src/components/LogoutButton.tsx
import { logout } from "~/lib/auth/user"

export default function LogoutButton() {
  return (
    <form method="post" action={logout}>
      <button class="text-red-600 hover:underline" type="submit">
        Log out
      </button>
    </form>
  )
}
