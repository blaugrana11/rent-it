// src/components/LogoutButton.tsx
import { logout } from "~/lib/auth/user";

export default function LogoutButton() {
  return (
    <form method="post" action={logout}>
      <button
        type="submit"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
      >
        Log out
      </button>
    </form>
  );
}
