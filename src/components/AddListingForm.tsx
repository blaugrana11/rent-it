import { createSignal, createEffect, For, Show, JSX } from "solid-js";
import { useSubmission } from "@solidjs/router";
import { createListingAction } from "~/lib/listing";
import { Dynamic } from "solid-js/web";

function AddListingForm() {
  let fileInput: HTMLInputElement;
  const submission = useSubmission(createListingAction);
  const [imageFiles, setImageFiles] = createSignal<File[]>([]);
  const [previewUrls, setPreviewUrls] = createSignal<
    { id: string; url: string }[]
  >([]);
  const [isDragging, setIsDragging] = createSignal(false);

  // Effect to clean up object URLs on component unmount
  createEffect(() => {
    return () => {
      previewUrls().forEach((item) => URL.revokeObjectURL(item.url));
    };
  });

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (newFiles.length === 0) return;

    // Add new files to existing ones
    const updatedFiles = [...imageFiles(), ...newFiles];
    setImageFiles(updatedFiles);

    // Generate preview URLs for new files
    const newPreviews = newFiles.map((file) => ({
      id: crypto.randomUUID(), // Generate unique ID for each image
      url: URL.createObjectURL(file),
    }));

    setPreviewUrls([...previewUrls(), ...newPreviews]);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer) {
      handleFiles(e.dataTransfer.files);
      fileInput!.files = e.dataTransfer.files
    }
  };

  const removeImage = (id: string, index: number) => {
    // Remove file from imageFiles
    const filesArray = [...imageFiles()];
    filesArray.splice(index, 1);
    setImageFiles(filesArray);

    // Remove preview URL
    const preview = previewUrls().find((item) => item.id === id);
    if (preview) {
      URL.revokeObjectURL(preview.url);
    }

    setPreviewUrls((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div class="max-w-4xl mx-auto my-8 px-4">
      {/* Success notification */}
      <div
        id="success-message"
        class="hidden mb-6 p-4 rounded-lg bg-green-100 border-l-4 border-green-500 text-green-700"
      >
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
            <p class="text-sm font-medium">Annonce créée avec succès !</p>
          </div>
        </div>
      </div>

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

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              class={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${isDragging() ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-500"}`}
            >
              <input
                ref={fileInput!}
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/*"
              />
              <label for="images" class="cursor-pointer">
                <div class="space-y-2">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div class="text-sm text-gray-600">
                    <span class="font-medium text-indigo-600 hover:underline">
                      Click to add images
                    </span>{" "}
                    or drag and drop
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
              </label>
            </div>

            {/* Image previews */}
            <Show when={previewUrls().length > 0}>
              <div class="mt-4">
                <p class="text-sm text-gray-700 mb-2">
                  {previewUrls().length} selected image(s)
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <For each={previewUrls()}>
                    {(preview, index) => (
                      <div class="relative rounded-lg overflow-hidden h-24 bg-gray-100 group">
                        <img
                          src={preview.url}
                          alt="Preview"
                          class="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(preview.id, index())}
                          class="absolute right-2 top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>

          {/* Submit button */}
          <div class="text-center">
            <button
              type="submit"
              class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-70"
            >
              {submission.pending
                ? "in Progress ..."
                : "Publish Ad"}
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

type FieldProps = {
  name: string;
  label: string;
} & (
  | ({
      tag?: "input";
    } & JSX.InputHTMLAttributes<HTMLInputElement>)
  | ({
      tag: "textarea";
    } & JSX.TextareaHTMLAttributes<HTMLTextAreaElement>)
  | ({
      tag: "select";
    } & JSX.SelectHTMLAttributes<HTMLSelectElement>)
);

const Field = (props: FieldProps) => (
  <div class="mb-6">
    <label
      for={props.name}
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {props.label}
    </label>
    <Dynamic
      component={props.tag ?? "input"}
      required
      class="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
      {...props}
      children={props.children}
    />
  </div>
);

export default AddListingForm;
