// routes/register.tsx
import Layout from "~/components/Layout";
import RegisterForm from "~/components/RegisterForm";
import { A } from "@solidjs/router";

export default function Register() {
  return (
    <Layout>
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Left: Form Section */}
          <div class="w-full md:w-1/2 p-10 space-y-6">
            <div class="text-center">
              <h2 class="text-3xl font-extrabold text-gray-800">Create your account</h2>
              <p class="mt-2 text-sm text-gray-600">
                Already have an account?{" "}
                <A href="/login" class="text-indigo-600 hover:underline">
                  Log in
                </A>
              </p>
            </div>

            <RegisterForm />
          </div>

          {/* Right: Visual Section */}
          <div class="hidden md:flex w-1/2 items-center justify-center">
            <img
              src="public/img/Wavy_Gen-01_Single-07.jpg"
              alt="Registration Visual"
              class="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
