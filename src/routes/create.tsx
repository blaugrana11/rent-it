// /routes/create.tsx
import AddListingForm from "~/components/AddListingForm";

export default function CreatePage() {
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 class="text-3xl font-semibold text-center text-gray-800 mb-8">Créer une annonce</h1>
        <AddListingForm />
      </div>
    </div>
  );
}
