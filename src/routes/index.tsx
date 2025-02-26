// src/routes/index.tsx
import { createResource } from "solid-js";

// Définition du type Annonce
type Annonce = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image : string;
};

// Fonction pour récupérer les annonces
async function fetchAnnonces() {
  // Vérifier si nous sommes côté client ou serveur
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"; // URL serveur par défaut en SSR
  const response = await fetch(`${baseUrl}/api/annonces`);
  const data = await response.json();
  return data as Annonce[];
}

export default function Home() {
  // Utilisation de createResource pour récupérer les annonces
  const [annonces] = createResource(fetchAnnonces);

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Liste des annonces</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {annonces()?.map((annonce) => (
          <div class="border p-4 rounded shadow-lg">
            <img src={annonce.image} alt={annonce.title} class="w-full h-48 object-cover rounded" />
            <h2 class="text-xl font-semibold mt-2">{annonce.title}</h2>
            <p class="text-gray-700">Prix: {annonce.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}
