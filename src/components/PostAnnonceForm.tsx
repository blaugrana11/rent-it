import { createSignal } from "solid-js";

export default function PostAnnonceForm() {
  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [price, setPrice] = createSignal("");
  const [image, setImage] = createSignal<File | null>(null);
  const [message, setMessage] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!title() || !price() || !description()) {
      setMessage("Tous les champs sont requis !");
      return;
    }

    const formData = new FormData();
    formData.append("title", title());
    formData.append("description", description());
    formData.append("price", price());
    formData.append("image", image() as File);

    try {
      const res = await fetch("/api/annonces", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Annonce ajoutée avec succès !");
      } else {
        setMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setMessage("Une erreur est survenue.");
    }
  };

  return (
    <div class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-xl font-bold mb-4">Ajouter une Annonce</h2>
      <form onSubmit={handleSubmit} class="space-y-4">
        <input
          type="text"
          placeholder="Titre"
          class="w-full border p-2 rounded"
          value={title()}
          onInput={(e) => setTitle(e.currentTarget.value)}
        />
        <input
            type="text"
            placeholder="Description"
            class="w-full border p-2 rounded"
            value={description()}
            onInput={(e) => setDescription(e.currentTarget.value)}
            />
        <input
          type="number"
          placeholder="Prix (€)"
          class="w-full border p-2 rounded"
          value={price()}
          onInput={(e) => setPrice(e.currentTarget.value)}
        />
        <input
          type="file"
          accept="image/*"
          class="w-full border p-2 rounded"
          onChange={(e) => setImage(e.currentTarget.files?.[0] || null)}
        />
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">
          Publier
        </button>
      </form>
      {message() && <p class="text-red-500 mt-2">{message()}</p>}
    </div>
  );
}
