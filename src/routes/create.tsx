// /routes/create.tsx
import AddListingForm from "~/components/AddListingForm";
import { getUser } from "~/lib/auth/user";
import { redirect } from "@solidjs/router";
import Layout from "~/components/Layout";
import { ErrorBoundary, Suspense } from "solid-js";

export const route = {
  preload: async () => {
    const user = await getUser();
    if (!user) {
      return redirect("/login");
    }
  },
};


export default function CreatePage() {
  return (
    <Layout protected>
    <ErrorBoundary fallback={<div class="text-red-500 text-center">An error occurred while loading the ad creation page.</div>}>
    <Suspense fallback={<div class="text-center text-gray-500">Loading ad creation form...</div>}>
    <div class="min-h-screen flex items-start justify-center bg-white-50 py-10">
      <div class="w-full max-w-2xl">
        <h1 class="text-3xl font-semibold text-center text-[#600AFF] mb-8 mt-6">
          Place an Ad
        </h1>
        <AddListingForm />
      </div>
    </div>
    </Suspense>
    </ErrorBoundary>
    </Layout>
  );
}
