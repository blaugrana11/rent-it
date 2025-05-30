import { createSignal, createEffect, For, Show } from "solid-js";
import { useSubmission, useNavigate } from "@solidjs/router";
import { createListingAction } from "~/lib/listing";
import { Field } from "~/components/Field";

function AddListingForm() {
  const navigate = useNavigate();
  const submission = useSubmission(createListingAction);
  const [files, setFiles] = createSignal<File[]>([]);
  const [previewUrls, setPreviewUrls] = createSignal<string[]>([]);
  const [success, setSuccess] = createSignal(false);
  
  createEffect(() => {
  if (submission.result && !submission.pending && submission.result.success) {
    setSuccess(true);
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1500); // Attendre 800ms avant redirection
  }
});

  const handleInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;

    // Nettoyer les anciennes URLs
    previewUrls().forEach((url) => URL.revokeObjectURL(url));

    const newFiles = Array.from(input.files);
    setFiles(newFiles);
    setPreviewUrls(newFiles.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index: number) => {
    const newFiles = [...files()];
    const newUrls = [...previewUrls()];

    // Révoquer l’ancienne URL
    URL.revokeObjectURL(newUrls[index]);

    newFiles.splice(index, 1);
    newUrls.splice(index, 1);

    setFiles(newFiles);
    setPreviewUrls(newUrls);

    // Mettre à jour input.files
    const input = document.getElementById("images") as HTMLInputElement;
    if (input) {
      const dt = new DataTransfer();
      newFiles.forEach((file) => dt.items.add(file));
      input.files = dt.files;
    }
  };

  return (
    <div class="max-w-4xl mx-auto my-8 px-4">
      <Show when={success()}>
  <div class="mb-6 p-4 rounded-lg bg-green-100 border-l-4 border-green-500 text-green-700">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium">
          Your ad has been published successfully!
        </p>
      </div>
    </div>
  </div>
</Show>

      <form
        action={createListingAction}
        method="post"
        enctype="multipart/form-data"
        class="bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <Header />

        <div class="p-8">
          <Field
            name="title"
            label="Add title"
            placeholder="Ex: Specialized Bike enduro 2021"
          />
          <Field
            name="description"
            label="Detailed description"
            placeholder="Describe your product, its condition, its features..."
            tag="textarea"
          />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Field
              name="price"
              label="Price (€/day)"
              placeholder="0.00"
              type="number"
            />
            <Field name="condition" label="Product condition" tag="select">
              <option value="neuf">New</option>
              <option value="comme neuf">Like new</option>
              <option value="bon état">Good condition</option>
              <option value="état moyen">Average condition</option>
              <option value="mauvais état">Poor condition</option>
            </Field>
          </div>

          <div class="mb-8">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Product photos
            </label>

            <input
              id="images"
              name="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleInputChange}
              class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />

            <Show when={previewUrls().length > 0}>
              <div class="mt-4">
                <p class="text-sm text-gray-700 mb-2">
                  {previewUrls().length} selected image(s)
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <For each={previewUrls()}>
                    {(url, index) => (
                      <div class="relative rounded-lg overflow-hidden h-24 bg-gray-100 group">
                        <img
                          src={url}
                          alt="Preview"
                          class="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index())}
                          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>

          <div class="text-center">
            <button
              type="submit"
              class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-70"
            >
              {submission.pending ? "in Progress ..." : "Publish Ad"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const Header = () => (
  <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
    <h2 class="text-2xl font-bold text-white text-left">
      What would you like to rent out ?
    </h2>
    <p class="text-indigo-100 text-left mt-2">
      Share your rental item with the community
    </p>
  </div>
);

export default AddListingForm;
