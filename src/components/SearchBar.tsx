// components/SearchBar.tsx
import { createSignal, JSX } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = createSignal(typeof searchParams.query === 'string' ? searchParams.query : "");
  const [condition, setCondition] = createSignal(typeof searchParams.condition === 'string' ? searchParams.condition : "");
  const [minPrice, setMinPrice] = createSignal(typeof searchParams.minPrice === 'string' ? searchParams.minPrice : "");
  const [maxPrice, setMaxPrice] = createSignal(typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : "");
  const [showFilters, setShowFilters] = createSignal(false);
  
  const navigate = useNavigate();

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    // Ajouter les paramètres seulement s'ils ont une valeur
    const query = searchQuery();
    const cond = condition();
    const minP = minPrice();
    const maxP = maxPrice();
    
    // S'assurer que ce sont des chaînes de caractères et qu'elles ne sont pas vides
    if (typeof query === 'string' && query.trim()) params.append("query", query);
    if (typeof cond === 'string' && cond) params.append("condition", cond);
    if (typeof minP === 'string' && minP) params.append("minPrice", minP);
    if (typeof maxP === 'string' && maxP) params.append("maxPrice", maxP);
    
    // Rediriger avec les paramètres de recherche
    navigate(`/?${params.toString()}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters());
  };

  return (
    <div class="w-full max-w-3xl mx-auto mb-8">
        <form onSubmit={handleSubmit} class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto">
            <div class="flex items-center space-x-4 w-full bg-white">
                
                <input
                    type="text"
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                    class="flex-1 p-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                />

                <button
                    type="button"
                    onClick={toggleFilters}
                    class="py-2 px-3 flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                    <span>Filters</span>
                    <span class="ml-2 text-lg">{showFilters() ? '▲' : '▼'}</span>
                </button>

                <button
                    type="submit"
                    class="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-70"
                >
                    Search
                </button>
            </div>

        
        {showFilters() && (
          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={condition()}
                onChange={(e) => setCondition(e.target.value)}
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
                value={minPrice()}
                onInput={(e) => setMinPrice(e.target.value)}
                min="0"
                class="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Maximum price (€)
              </label>
              <input
                type="number"
                value={maxPrice()}
                onInput={(e) => setMaxPrice(e.target.value)}
                min="0"
                class="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
        
        {(condition() !== "" || minPrice() !== "" || maxPrice() !== "") && (
          <div class="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setCondition("");
                setMinPrice("");
                setMaxPrice("");
                //navigate("/");
              }}
              class="inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
            >
              Clear filters
            </button>
          </div>
        )}
      </form>
    </div>
  );
}