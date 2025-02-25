// src/routes/index.tsx
import { createResource } from "solid-js";

// Définition du type Annonce
type Annonce = {
  _id: string;
  title: string;
  description: string;
  price: number;
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
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold mb-4">Liste des annonces</h1>
      <ul>
        {/* Vérification si les données sont disponibles */}
        {annonces() ? (
          annonces().map((annonce) => (
            <li class="mb-4 p-4 border" key={annonce._id}>
              <h2 class="text-xl">{annonce.title}</h2>
              <p>{annonce.description}</p>
              <p><strong>Prix:</strong> {annonce.price} €</p>
            </li>
          ))
        ) : (
          <p>Chargement des annonces...</p>
        )}
      </ul>
    </div>
  );
}
