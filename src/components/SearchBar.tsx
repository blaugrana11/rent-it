// components/SearchBar.tsx
import { createSignal, createMemo, Show } from "solid-js";
import { redirect, useNavigate } from "@solidjs/router";
import { useSearchParams } from "@solidjs/router";

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = createSignal(searchParams.query ?? "");
  const [condition, setCondition] = createSignal(searchParams.condition ?? "");
  const [minPrice, setMinPrice] = createSignal(searchParams.minPrice ?? "");
  const [maxPrice, setMaxPrice] = createSignal(searchParams.maxPrice ?? "");
  const [showFilters, setShowFilters] = createSignal(false);


  const updateParams = () => {
    const params: Record<string, string> = {};
  
    const q = query();
    const c = condition();
    const min = minPrice();
    const max = maxPrice();
  
    if (typeof q === "string" && q.trim()) params.query = q.trim();
    if (typeof c === "string" && c) params.condition = c;
    if (typeof min === "string" && min) params.minPrice = min;
    if (typeof max === "string" && max) params.maxPrice = max;
  
    setSearchParams(params);
  };


  createMemo(() => {
    query(); condition(); minPrice(); maxPrice();
    updateParams();
  });

  const navigate = useNavigate();

  const clearFilters = () => {
    setQuery("");
    setCondition("");
    setMinPrice("");
    setMaxPrice("");

    navigate("/", { replace: true });
  };

  return (
    <div class="w-full max-w-3xl mx-auto mb-8">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full">
        <div class="flex items-center space-x-4">
          <input
            type="text"
            value={query()}
            onInput={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search items..."
            class="flex-1 p-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters())}
            class="py-2 px-3 flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md transition"
          >
            <span>Filters</span>
            <span class="ml-2 text-lg">{showFilters() ? '▲' : '▼'}</span>
          </button>
        </div>

        <Show when={showFilters()}>
          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={condition()}
                onChange={(e) => setCondition(e.currentTarget.value)}
                class="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Any condition</option>
                <option value="neuf">New</option>
                <option value="comme neuf">Like new</option>
                <option value="bon état">Good condition</option>
                <option value="état moyen">Average condition</option>
                <option value="mauvais état">Bad condition</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Minimum price (€)
              </label>
              <input
                type="number"
                min="0"
                value={minPrice()}
                onInput={(e) => setMinPrice(e.currentTarget.value)}
                class="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Maximum price (€)
              </label>
              <input
                type="number"
                min="0"
                value={maxPrice()}
                onInput={(e) => setMaxPrice(e.currentTarget.value)}
                class="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </Show>

        <Show when={condition() || minPrice() || maxPrice()}>
          <div class="mt-4 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              class="inline-flex items-center px-4 py-2 border border-red-600 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition"
            >
              Clear filters
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}