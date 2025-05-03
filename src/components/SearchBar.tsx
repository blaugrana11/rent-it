// components/SearchBar.tsx
import { createSignal, JSX } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = createSignal(searchParams.query || "");
  const [condition, setCondition] = createSignal(searchParams.condition || "");
  const [minPrice, setMinPrice] = createSignal(searchParams.minPrice || "");
  const [maxPrice, setMaxPrice] = createSignal(searchParams.maxPrice || "");
  const [showFilters, setShowFilters] = createSignal(false);
  
  const navigate = useNavigate();

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    // Ajouter les paramètres seulement s'ils ont une valeur
    if (searchQuery().trim()) params.append("query", searchQuery());
    if (condition()) params.append("condition", condition());
    if (minPrice()) params.append("minPrice", minPrice());
    if (maxPrice()) params.append("maxPrice", maxPrice());
    
    // Rediriger avec les paramètres de recherche
    navigate(`/?${params.toString()}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters());
  };

  return (
    <div class="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center">
          <input
            type="text"
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des objets..."
            class="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            class="bg-indigo-600 text-white p-2 rounded-r-lg hover:bg-indigo-700 transition-colors"
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={toggleFilters}
            class="ml-2 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Filtres {showFilters() ? '▲' : '▼'}
          </button>
        </div>
        
        {showFilters() && (
          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                État
              </label>
              <select
                value={condition()}
                onChange={(e) => setCondition(e.target.value)}
                class="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous les états</option>
                <option value="neuf">Neuf</option>
                <option value="comme neuf">Comme neuf</option>
                <option value="bon état">Bon état</option>
                <option value="état moyen">État moyen</option>
                <option value="mauvais état">Mauvais état</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Prix minimum (€)
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
                Prix maximum (€)
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
        
        {(searchQuery() || condition() || minPrice() || maxPrice()) && (
          <div class="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCondition("");
                setMinPrice("");
                setMaxPrice("");
                navigate("/");
              }}
              class="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </form>
    </div>
  );
}