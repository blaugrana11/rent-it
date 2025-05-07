// routes/listing/[id].tsx
import { createAsync, RouteDefinition, useParams } from "@solidjs/router";
import { getListingById } from "~/lib/listing";
import { Show, Suspense, ErrorBoundary, createSignal, createEffect } from "solid-js";
import Layout from "~/components/Layout";

// Définition de la route avec préchargement
export const route = {
  preload({ params }) {
    return getListingById(params.id);
  }
} satisfies RouteDefinition;

export default function ListingDetailPage() {
  const params = useParams();
  const listing = createAsync(() => getListingById(params.id));
  
  // État pour gérer l'image actuellement affichée
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);
  
  // Fonctions pour naviguer entre les images
  const goToPrevImage = () => {
    if (!listing()?.images) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? listing().images.length - 1 : prev - 1
    );
  };
  
  const goToNextImage = () => {
    if (!listing()?.images) return;
    setCurrentImageIndex(prev => 
      prev === listing().images.length - 1 ? 0 : prev + 1
    );
  };
  
  // Fonction pour changer directement à une image spécifique
  const goToImage = (index:number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Layout>
      <div class="min-h-screen bg-gray-100 py-12">
        <div class="max-w-4xl mx-auto px-6">
          <ErrorBoundary fallback={<div class="text-red-500 text-center">Ouch, an error has occured...</div>}>
            <Suspense fallback={<div class="text-center text-gray-500">Ad loading...</div>}>
            <div class="p-2 ">
            <a
              href="/"
              class="inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-150 ease-in-out"
            >
              ← Back to listings
            </a>

            </div>
              <Show when={listing()} fallback={<div class="text-center">Ad not found</div>}>
                {(data) => (
                  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* En-tête avec le titre et le prix */}
                    <div class="p-6 border-b border-gray-200">

                      <div class="flex justify-between items-start">
                        <h1 class="text-3xl font-bold text-gray-800">{data().title}</h1>
                    
                      </div>
                      
                      {/* Badge de condition */}
                      {data().condition && (
                        <div class="mt-2">
                          <span class="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            {data().condition}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Images avec carrousel */}
                    <Show when={data().images && data().images.length > 0}>
                      <div class="relative">
                        {/* Conteneur d'image principale avec navigation */}
                        <div class="w-full h-96 bg-gray-200 relative">
                          <img 
                            src={data().images?.[currentImageIndex()]} 
                            alt={`${data().title} - Image ${currentImageIndex() + 1}`}
                            class="w-full h-full object-contain"
                          />
                          
                          {/* Boutons de navigation */}
                          <Show when={data().images && data().images.length > 1}>
                            <div class="absolute inset-0 flex items-center justify-between p-4">
                              <button 
                                onClick={goToPrevImage} 
                                class="bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Image précédente"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button 
                                onClick={goToNextImage} 
                                class="bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Image suivante"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Indicateur de position */}
                            <div class="absolute bottom-4 left-0 right-0 flex justify-center">
                              <div class="bg-white/70 px-3 py-1 rounded-full text-sm">
                                {currentImageIndex() + 1} / {data().images.length}
                              </div>
                            </div>
                          </Show>
                        </div>
                        
                        {/* Miniatures (si plus d'une image) */}
                        <Show when={data().images && data().images.length > 1}>
                          <div class="p-4 flex gap-4 overflow-x-auto">
                            {data().images?.map((image, index) => (
                              <img 
                                src={image} 
                                alt={`Image ${index + 1}`}
                                class={`h-24 w-auto object-cover rounded-md cursor-pointer transition-all ${
                                  currentImageIndex() === index ? 'ring-2 ring-indigo-500 shadow-md' : 'opacity-70 hover:opacity-100'
                                }`}
                                onClick={() => goToImage(index)}
                              />
                            ))}
                          </div>
                        </Show>
                      </div>
                    </Show>
                    
                    {/* Description */}
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-3">
                            <h2 class="text-xl font-semibold">Description</h2>
                            <div class="text-xl font-bold text-indigo-600">{data().price}€/day</div>
                        </div>
                        <p class="text-gray-700 whitespace-pre-line leading-relaxed">{data().description}</p>
                    </div>
                  </div>
                )}
              </Show>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </Layout>
  );
}