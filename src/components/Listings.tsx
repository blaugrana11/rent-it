import { ErrorBoundary, Suspense, For } from "solid-js";
import { createAsync } from "@solidjs/router";
import { getListings } from "~/lib/listing";

export default function ListingsPage() {
  const listings = createAsync(() => getListings());

  return (
    <div class="min-h-screen bg-gray-100 py-12">
      <div class="max-w-7xl mx-auto px-6">
        <h1 class="text-4xl font-bold text-gray-800 text-center mb-10">
          Annonces disponibles
        </h1>

        <ErrorBoundary fallback={<div class="text-red-500 text-center">Oups, une erreur est survenue.</div>}>
          <Suspense fallback={<div class="text-center text-gray-500">Chargement en cours...</div>}>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <For each={listings()}>
                {(listing) => (
                  <div class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-2">{listing.title}</h2>
                    <p class="text-gray-600 flex-1">{listing.description}</p>
                    <p class="mt-4 text-lg text-indigo-600 font-bold">Prix : {listing.price}€</p>

                    {listing.images && listing.images.length > 0 && (
                      <div class="mt-4">
                        <div class="grid grid-cols-2 gap-3">
                          {listing.images.slice(0, 4).map((image, index) => (
                            <img
                              src={image}
                              alt={`Image ${index + 1}`}
                              class="w-full h-32 object-cover rounded-md shadow-sm"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </For>
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
