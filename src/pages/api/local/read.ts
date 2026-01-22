import type { APIRoute } from 'astro';

// This API route is disabled for Cloudflare deployment
// Cloudflare doesn't support Node.js filesystem APIs (fs, path, etc.)
// Use GitHub API instead: /api/github/read
export const GET: APIRoute = async ({ url }) => {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: 'Local filesystem access is not available on Cloudflare. Please use GitHub API endpoint: /api/github/read' 
    }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  );
};

