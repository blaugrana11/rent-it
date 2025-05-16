import { useParams, createAsync } from "@solidjs/router";
import { For, Show, Suspense, createSignal, createEffect } from "solid-js";
import { getUserById, getUserListingsById } from "~/lib/auth/user";
import type { RouteDefinition } from "@solidjs/router";
import Layout from "~/components/Layout";
import { deleteListingAction } from "~/lib/listing";

export const route = {
  preload: ({ params }) => getUserListingsById(params.id),
} satisfies RouteDefinition;

export default function ProfilePage() {
  const params = useParams();
  const userId = () => params.id;

  const user = createAsync(() => getUserById(userId()));
  
  // Signaux locaux pour gérer les annonces
  const [listings, setListings] = createSignal([]);

  // Remplir les annonces quand l'userId change
  createEffect(() => {
    getUserListingsById(userId()).then(setListings);
  });

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;
    console.log("Deleting listing with ID:", id);
    const res = await deleteListingAction(id);
    console.log("Delete response:", res);
    if (res.message === "Annonce supprimée avec succès") {
      // Retirer l’annonce supprimée localement
      setListings((prev) => prev.filter((l: any) => l._id !== id));
    } else {
      alert("Failed to delete listing.");
    }
  };

  return (
    <Layout>
      <div class="min-h-screen bg-gray-100 py-12">
        <div class="max-w-7xl mx-auto px-6">
          <Suspense fallback={<p class="text-center text-gray-500">Loading profile...</p>}>
            <Show when={user()} fallback={<p class="text-center text-red-500">User not found</p>}>
              <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">
                {user()?.pseudo}'s Listings
              </h1>

              <Show when={listings().length} fallback={
                <div class="text-center py-10">
                  <p class="text-xl text-gray-600">No ads published yet</p>
                  <p class="text-gray-500 mt-2">This user hasn't posted anything yet.</p>
                </div>
              }>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <For each={listings()}>
                    {(listing: any) => (
                      <div class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col relative">
                        <h2 class="text-2xl font-semibold text-gray-900 mb-2">{listing.title}</h2>
                        <p class="text-gray-600 flex-1">{listing.description}</p>
                        <div class="mt-4 flex justify-between items-center">
                          <p class="text-lg text-indigo-600 font-bold">{listing.price} €</p>
                          {listing.condition && (
                            <span class="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                              {listing.condition}
                            </span>
                          )}
                        </div>

                        {listing.images?.length > 0 && (
                          <div class="mt-4 grid grid-cols-2 gap-3">
                            {listing.images.slice(0, 4).map((img: string, i: number) => (
                              <img
                                src={img}
                                alt={`Image ${i + 1}`}
                                class="w-full h-32 object-cover rounded-md shadow-sm"
                              />
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => handleDelete(listing._id)}
                          class="absolute top-3 right-3 bg-red-100 text-red-600 text-sm px-3 py-1 rounded hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </Show>
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
