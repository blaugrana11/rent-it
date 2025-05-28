import { createMiddleware } from '@solidjs/start/middleware'

export default createMiddleware({
  onBeforeResponse: (event) => {
    // Obtenir l'origine de la requête
    const origin = event.request.headers.get('Origin') || '*';
    
    // Configurer les en-têtes CORS avec l'origine spécifique au lieu de '*'
    event.response.headers.set('Access-Control-Allow-Origin', origin);
    event.response.headers.set('Access-Control-Allow-Credentials', 'true');
    event.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    event.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Gestion des requêtes preflight OPTIONS
    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: event.response.headers
      });
    }
  },
})