import { ErrorBoundary, Suspense, For } from "solid-js";
import { createAsync } from "@solidjs/router";
import { getListings } from "~/lib/listing";

export default function ListingsPage() {
  // Correction ici - on passe une fonction qui appelle getListings
  const listings = createAsync(() => getListings());

  return (
    <div class="min-h-screen bg-gray-100 py-10">
      <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 class="text-3xl font-semibold text-center text-gray-800 mb-6">Liste des annonces</h1>

        <ErrorBoundary fallback={<div class="text-red-500 text-center">Oups, quelque chose s'est mal passé !</div>}>
          <Suspense fallback={<div class="text-center text-gray-500">Chargement des annonces...</div>}>
            <ul class="space-y-6">
              <For each={listings()}>
                {(listing) => (
                  <li class="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <h2 class="text-xl font-medium text-gray-900">{listing.title}</h2>
                    <p class="text-gray-600 mt-2">{listing.description}</p>
                    <p class="mt-2 text-lg text-gray-800 font-semibold">Prix : {listing.price}€</p>

                    {/* Affichage des images */}
                    {listing.images && listing.images.length > 0 && (
                      <div class="mt-4">
                        <h3 class="text-lg font-medium text-gray-900">Images :</h3>
                        <div class="grid grid-cols-3 gap-4 mt-2">
                          {listing.images.map((image, index) => (
                            <img
                              
                              src={image}
                              alt={`Image ${index + 1} de l'annonce`}
                              class="w-full h-40 object-cover rounded-lg shadow-sm"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                )}
              </For>
            </ul>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
