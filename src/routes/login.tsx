// src/routes/login.tsx
import LoginForm from "~/components/LoginForm"
import Layout from "~/components/Layout";

export default function LoginPage() {
  return (
    <Layout>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
    </Layout>
  )
}
