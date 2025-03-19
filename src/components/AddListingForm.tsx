import { createSignal } from "solid-js";
import { createListingAction } from "~/lib/listing";

function AddListingForm() {
  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [price, setPrice] = createSignal(0);
  const [condition, setCondition] = createSignal("neuf");
  const [images, setImages] = createSignal<FileList | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title());
    formData.append("description", description());
    formData.append("price", price().toString());
    formData.append("condition", condition());

    // Si des images sont sélectionnées, on les ajoute à formData
    if (images()) {
      Array.from(images()!).forEach((image) => {
        formData.append("images", image);
      });
    }

    await createListingAction(formData);
    alert("Annonce créée avec succès !");
  };

  return (
    <form onSubmit={handleSubmit} class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Ajouter une annonce</h2>
      <div class="mb-4">
        <label htmlFor="title" class="block text-sm font-medium text-gray-700">Titre</label>
        <input
          id="title"
          type="text"
          value={title()}
          onInput={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'annonce"
          class="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="mb-4">
        <label htmlFor="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description()}
          onInput={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre produit"
          class="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="mb-4">
        <label htmlFor="price" class="block text-sm font-medium text-gray-700">Prix</label>
        <input
          id="price"
          type="number"
          value={price()}
          onInput={(e) => setPrice(Number(e.target.value))}
          placeholder="Prix en €"
          class="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="mb-4">
        <label htmlFor="condition" class="block text-sm font-medium text-gray-700">État</label>
        <select
          id="condition"
          value={condition()}
          onChange={(e) => setCondition(e.target.value)}
          class="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="neuf">Neuf</option>
          <option value="comme neuf">Comme neuf</option>
          <option value="bon état">Bon état</option>
          <option value="état moyen">État moyen</option>
          <option value="mauvais état">Mauvais état</option>
        </select>
      </div>

      <div class="mb-4">
        <label htmlFor="images" class="block text-sm font-medium text-gray-700">Images</label>
        <input
          id="images"
          type="file"
          multiple
          onInput={(e) => setImages(e.target.files)}
          class="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="text-center">
        <button
          type="submit"
          class="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Ajouter l'annonce
        </button>
      </div>
    </form>
  );
}

export default AddListingForm;
