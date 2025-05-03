// routes/register.tsx ou un composant spécifique
import { register } from "~/lib/auth/user";
import Layout from "~/components/Layout";
import RegisterForm from "~/components/RegisterForm";

export default function Register() {
  return (
    <Layout>
      <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <RegisterForm />
      </div>
    </Layout>
  );
}
