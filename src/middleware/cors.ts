import { createMiddleware } from '@solidjs/start/middleware'

export default createMiddleware({
  onBeforeResponse: (event) => {

    const origin = event.request.headers.get('Origin') || '*';
    

    event.response.headers.set('Access-Control-Allow-Origin', origin);
    event.response.headers.set('Access-Control-Allow-Credentials', 'true');
    event.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    event.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    

    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: event.response.headers
      });
    }
  },
})