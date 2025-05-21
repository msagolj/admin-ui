const API_BASE_URL = 'https://admin.hlx.page';

// Install event - just skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Fetch event - handle API requests
self.addEventListener('fetch', (event) => {
  // Only handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      (async () => {
        // Clone the request to modify it
        const request = event.request.clone();
        
        // Get the path after /api/
        const path = request.url.split('/api/')[1];
        
        // Create new URL for the target API
        const newUrl = `${API_BASE_URL}/${path}`;
        
        // Create new request with the target URL
        const newRequest = new Request(newUrl, {
          method: request.method,
          headers: request.headers,
          body: request.body,
          mode: 'cors',
          credentials: 'include'
        });

        try {
          // Forward the request to the actual API
          const response = await fetch(newRequest);
          
          // Clone the response to modify headers
          const newResponse = response.clone();
          
          // Add CORS headers
          const headers = new Headers(newResponse.headers);
          headers.set('Access-Control-Allow-Origin', '*');
          
          // Return modified response
          return new Response(newResponse.body, {
            status: newResponse.status,
            statusText: newResponse.statusText,
            headers: headers
          });
        } catch (error) {
          console.error('Service worker fetch error:', error);
          return new Response(JSON.stringify({ error: 'Network error' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      })()
    );
  }
});

// Activate event - claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
}); 