import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-indigo-500" : "border-transparent hover:border-indigo-400";
  
  return (
    <nav class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div class="flex-shrink-0">
            <a href="/" class="flex items-center">
              <span class="font-bold text-2xl text-white tracking-tight">Rent-it</span>
            </a>
          </div>
          
          {/* Navigation Links */}
          <div class="hidden md:block">
            <div class="ml-10 flex items-center space-x-8">
              <a 
                href="/" 
                class={`text-white font-medium py-2 border-b-2 ${active("/")} transition duration-150 ease-in-out`}
              >
                Home
              </a>
              <a 
                href="/about" 
                class={`text-white font-medium py-2 border-b-2 ${active("/about")} transition duration-150 ease-in-out`}
              >
                About
              </a>
            </div>
          </div>
          
          {/* Place an Ad Button */}
          <div>
            <a 
              href="/create" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Place an Ad
            </a>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div class="md:hidden py-2">
          <div class="flex justify-center space-x-8">
            <a 
              href="/" 
              class={`text-white font-medium py-2 border-b-2 ${active("/")} transition duration-150 ease-in-out`}
            >
              Home
            </a>
            <a 
              href="/about" 
              class={`text-white font-medium py-2 border-b-2 ${active("/about")} transition duration-150 ease-in-out`}
            >
              About
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}