// /routes/create.tsx
import AddListingForm from "~/components/AddListingForm";

export default function CreatePage() {
  return (
    <div class="min-h-screen flex items-start justify-center bg-white-50 py-10">
      <div class="w-full max-w-2xl">
        <h1 class="text-3xl font-semibold text-center text-[#600AFF] mb-8  mt-6">
          Place an Ad
        </h1>
        <AddListingForm />
      </div>
    </div>
  );
}






