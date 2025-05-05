// routes/listing/[id].tsx
import { createAsync, RouteDefinition, useParams } from "@solidjs/router";
import { getListingById } from "~/lib/listing";
import { Show, Suspense, ErrorBoundary, createSignal, createEffect } from "solid-js";
import Layout from "~/components/Layout";


//Directive personnalisée pour la galerie d'images
const createImageGallery = (el: HTMLDivElement, images: () => string[]) => {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  
  // Fonction pour aller à l'image suivante
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images().length);
  };

  // Fonction pour aller à l'image précédente
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images().length) % images().length);
  };

  // Créer la galerie d'images
  const gallery = document.createElement('div');
  gallery.className = 'w-full';

  // Créer le conteneur principal pour l'image
  const mainImage = document.createElement('div');
  mainImage.className = 'relative w-full h-96 bg-gray-200';
  
  // Créer l'élément image
  const img = document.createElement('img');
  img.className = 'w-full h-full object-contain';
  mainImage.appendChild(img);

  // Ajouter les boutons de navigation si plus d'une image
  if (images().length > 1) {
    // Bouton précédent
    const prevButton = document.createElement('button');
    prevButton.className = 'absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md z-10';
    prevButton.innerHTML = '❮';
    prevButton.onclick = prevImage;
    mainImage.appendChild(prevButton);

    // Bouton suivant
    const nextButton = document.createElement('button');
    nextButton.className = 'absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md z-10';
    nextButton.innerHTML = '❯';
    nextButton.onclick = nextImage;
    mainImage.appendChild(nextButton);
  }

  gallery.appendChild(mainImage);

  // Créer les miniatures si plus d'une image
  if (images().length > 1) {
    const thumbnails = document.createElement('div');
    thumbnails.className = 'flex gap-4 overflow-x-auto p-4';
    
    images().forEach((src, idx) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.className = 'h-24 w-auto object-cover rounded cursor-pointer hover:ring-2 hover:ring-indigo-500';
      thumb.alt = `Miniature ${idx + 1}`;
      thumb.onclick = () => setCurrentIndex(idx);
      thumbnails.appendChild(thumb);
    });
    
    gallery.appendChild(thumbnails);
  }

  // Mettre à jour l'affichage en fonction de currentIndex
  createEffect(() => {
    const idx = currentIndex();
    img.src = images()[idx];
    img.alt = `Image ${idx + 1}`;
    
    // Mettre à jour la classe des miniatures
    if (images().length > 1) {
      const thumbnailImgs = gallery.querySelectorAll('.flex.gap-4 img');
      thumbnailImgs.forEach((thumb, i) => {
        if (i === idx) {
          thumb.classList.add('ring-2', 'ring-indigo-500');
        } else {
          thumb.classList.remove('ring-2', 'ring-indigo-500');
        }
      });
    }
  });

  // Ajouter la galerie à l'élément
  el.appendChild(gallery);

  // Nettoyer lors de la destruction du composant
  onCleanup(() => {
    el.innerHTML = '';
  });
};


// Définition de la route avec préchargement
export const route = {
  preload({ params }) {
    return getListingById(params.id);
  }
} satisfies RouteDefinition;

export default function ListingDetailPage() {
  const params = useParams();
  const listing = createAsync(() => getListingById(params.id));

  return (
    <Layout>
      <div class="min-h-screen bg-gray-100 py-12">
        <div class="max-w-4xl mx-auto px-6">
          <ErrorBoundary fallback={<div class="text-red-500 text-center">Oups, une erreur s'est produite...</div>}>
            <Suspense fallback={<div class="text-center text-gray-500">Chargement de l'annonce...</div>}>
              <Show when={listing()} fallback={<div class="text-center">Annonce introuvable</div>}>
                {(data) => (
                  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* En-tête avec le titre et le prix */}
                    <div class="p-6 border-b border-gray-200">
                      <div class="flex justify-between items-start">
                        <h1 class="text-3xl font-bold text-gray-800">{data().title}</h1>
                        <div class="text-2xl font-bold text-indigo-600">{data().price}€</div>
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
                    
                    {/* Images */}
                    <Show when={data().images && data().images.length > 0}>
                      <div class="relative">
                        {/* Image principale */}
                        <div class="w-full h-96 bg-gray-200">
                          <img 
                            src={data().images?.[0]} 
                            alt={data().title}
                            class="w-full h-full object-contain"
                          />
                        </div>
                        
                        {/* Miniatures (si plus d'une image) */}
                        <Show when={data().images && data().images.length > 1}>
                          <div class="p-4 flex gap-4 overflow-x-auto">
                            {data().images?.map((image, index) => (
                              <img 
                                src={image} 
                                alt={`Image ${index + 1}`}
                                class="h-24 w-auto object-cover rounded-md cursor-pointer hover:ring-2 hover:ring-indigo-500"
                              />
                            ))}
                          </div>
                        </Show>
                      </div>
                    </Show>
                    
                    {/* Description */}
                    <div class="p-6">
                      <h2 class="text-xl font-semibold mb-3">Description</h2>
                      <p class="text-gray-700 whitespace-pre-line leading-relaxed">{data().description}</p>
                    </div>
                    
                    {/* Bouton retour */}
                    <div class="p-6 border-t border-gray-200">
                      <a 
                        href="/"
                        class="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                      >
                        ← Retour aux annonces
                      </a>
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