// src/routes/index.tsx
import { createResource } from "solid-js";
import PostAnnonceForm from "~/components/PostAnnonceForm";


// Définition du type Annonce
type Annonce = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image : string;
};

const fetchAnnonces = async (): Promise<Annonce[]> => {
  const res = await fetch("http://localhost:3000/api/annonces"); // 🔥 Ajoute l'URL complète
  return res.json();
};


const deleteAnnonce = async (id: string) => {
  await fetch(`/api/annonces?id=${id}`, { method: "DELETE" });
  window.location.reload(); // Rafraîchir la liste
};
export default function Home() {
  // Utilisation de createResource pour récupérer les annonces
  const [annonces] = createResource(fetchAnnonces);

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Liste des annonces</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {annonces()?.map((annonce: Annonce) => (
      <div key={annonce._id} class="border p-4 rounded shadow-lg">
        <img src={annonce.image} alt={annonce.title} class="w-full h-48 object-cover rounded" />
        <h2 class="text-xl font-semibold mt-2">{annonce.title}</h2>
        <p class="text-gray-700">Prix: {annonce.price} €</p>
        <button
          class="bg-red-500 text-white px-3 py-1 rounded mt-2"
          onClick={() => deleteAnnonce(annonce._id)}
        >
          Supprimer
        </button>
      </div>
    ))}
      <PostAnnonceForm />
      </div>
    </div>
  );
}
