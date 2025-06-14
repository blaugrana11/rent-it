// components/Listings.tsx
import { ErrorBoundary, Suspense, For, Show } from "solid-js";
import { createAsync, RouteDefinition, useSearchParams } from "@solidjs/router";
import { getListings } from "~/lib/listing";
import SearchBar from "./SearchBar";

export const route = {
  preload({ location }) {
    const params = new URLSearchParams(location.search);
    const searchParams = {
      query: params.get("query") ?? undefined,
      condition: params.get("condition") ?? undefined,
      minPrice: params.get("minPrice") !== null ? Number(params.get("minPrice")) : undefined,
      maxPrice: params.get("maxPrice") !== null ? Number(params.get("maxPrice")) : undefined
    };
    
    getListings(searchParams);
  }
} satisfies RouteDefinition;

export default function ListingsPage() {
  const [searchParams] = useSearchParams();

  const searchOptions = () => ({
    query: typeof searchParams.query === 'string' ? searchParams.query : undefined,
    condition: typeof searchParams.condition === 'string' ? searchParams.condition : undefined,
    minPrice: typeof searchParams.minPrice === 'string' ? Number(searchParams.minPrice) : undefined,
    maxPrice: typeof searchParams.maxPrice === 'string' ? Number(searchParams.maxPrice) : undefined
  });
  

  const listingsResource = createAsync(() => getListings(searchOptions()));

  const hasListings = () => {
    const data = listingsResource();
    return data !== undefined && Array.isArray(data) && data.length > 0;
  };
  
  return (
    <div class="min-h-screen bg-gray-100 py-12">
      <div class="max-w-7xl mx-auto px-6">

        
        <SearchBar />
        
        <ErrorBoundary fallback={<div class="text-red-500 text-center">Ouch an error has occured ... </div>}>
          <Suspense fallback={<div class="text-center text-gray-500">Loading ...</div>}>
            <Show
              when={hasListings()}
              fallback={
                <div class="text-center py-10">
                  <p class="text-xl text-gray-600">No ad matches your search</p>
                  <p class="text-gray-500 mt-2">Try changing your search criteria</p>
                </div>
              }
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <For each={listingsResource() || []}>
                  {(listing) =>( 
                    <a 
                    href={`/listing/${listing._id}`} 
                    class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col cursor-pointer"
                  >
                      <h2 class="text-2xl font-semibold text-gray-900 mb-2">{listing.title}</h2>
                      <p class="text-gray-600 flex-1">{listing.description}</p>
                      <div class="mt-4 flex justify-between items-center">
                        <p class="text-lg text-indigo-600 font-bold">Price : {listing.price}€</p>
                        {listing.condition && (
                          <span class="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                          {listing.condition === "bon état"
                            ? "Good condition"
                            : listing.condition === "neuf"
                            ? "New"
                            : listing.condition === "état moyen"
                            ? "Average condition"
                            : listing.condition === "mauvais état"
                            ? "Bad condition"
                            : listing.condition === "comme neuf"
                            ? "Like new"
                            : listing.condition}
                        </span>
                        
                        )}
                      </div>
                      
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
                    </a>
                  )}
                </For>
              </div>
            </Show>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}