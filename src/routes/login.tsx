// src/routes/login.tsx
import LoginForm from "~/components/LoginForm"
import Layout from "~/components/Layout"
import { ErrorBoundary, Suspense } from "solid-js"

export default function LoginPage() {
  return (
    
    <Layout>
      <ErrorBoundary fallback={<div class="text-red-500 text-center">An error occurred while loading the login page.</div>}>
      <Suspense fallback={<div class="text-center text-gray-500">Loading login form...</div>}>
      <div class="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 flex items-center justify-center px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-2xl p-10 max-w-5xl w-full">

          <div class="hidden md:flex flex-col justify-center items-start space-y-6 pr-6 border-r border-gray-200">
            <h1 class="text-4xl font-bold text-indigo-600">Welcome back!</h1>
            <p class="text-gray-600 text-lg">
              Log in to manage your listings, update your account, and post new ads.
            </p>
            <img
              src="public\img\Wavy_Tech-28_Single-10.jpg"
              alt="Login illustration"
              class="w-full max-w-xs"
            />
          </div>


          <div class="flex flex-col justify-center space-y-6">
            <LoginForm />
            <div class="text-center">
              <p class="text-gray-600">
                Don't have an account?
                <a
                  href="/register"
                  class="ml-1 inline-block text-indigo-600 hover:underline font-medium"
                >
                  Sign up here →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      </Suspense>
      </ErrorBoundary>
    </Layout>
  )
}
