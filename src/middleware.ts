/**
 * Middleware to fix Keystatic OAuth issues on Cloudflare
 */
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);

    // Get environment variables
    // @ts-ignore - Cloudflare runtime
    const runtime = context.locals?.runtime;
    // @ts-ignore
    const env = runtime?.env || {};

    const clientId = env.KEYSTATIC_GITHUB_CLIENT_ID || import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
    const clientSecret = env.KEYSTATIC_GITHUB_CLIENT_SECRET || import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

    // Helper to get token from cookie
    const getTokenFromCookie = () => {
        const cookieHeader = context.request.headers.get('cookie') || '';
        const tokenMatch = cookieHeader.match(/keystatic-gh-access-token=([^;]+)/);
        return tokenMatch ? tokenMatch[1] : null;
    };

    // ============================================
    // Handle OAuth Callback - Step 1: Show success page to set cookie via JS
    // Using a different approach: render HTML that sets cookie client-side
    // ============================================
    if (url.pathname === '/api/keystatic/github/oauth/callback' && url.searchParams.has('code')) {
        const code = url.searchParams.get('code');

        if (!clientId || !clientSecret) {
            return new Response(
                `<h1>Missing OAuth Credentials</h1>`,
                { status: 500, headers: { 'Content-Type': 'text/html' } }
            );
        }

        const callbackUrl = `${url.origin}/api/keystatic/github/oauth/callback`;

        try {
            const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Keystatic-Cloudflare',
                },
                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code,
                    redirect_uri: callbackUrl,
                }),
            });

            const tokenData = await tokenResponse.json();

            if (tokenData.error || !tokenData.access_token) {
                return new Response(
                    `<h1>GitHub OAuth Error</h1><p>${tokenData.error_description || tokenData.error || 'No access token'}</p>`,
                    { status: 401, headers: { 'Content-Type': 'text/html' } }
                );
            }

            const accessToken = tokenData.access_token;

            // Return HTML page that stores token in localStorage (Keystatic uses localStorage!)
            // and then redirects to /keystatic
            return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Authenticating...</title></head>
        <body>
          <p>Logging you in...</p>
          <script>
            // Keystatic stores the GitHub token in localStorage
            localStorage.setItem('keystatic-gh-access-token', '${accessToken}');
            // Also set as cookie for server-side access
            document.cookie = 'keystatic-gh-access-token=${accessToken}; path=/; max-age=2592000; secure; samesite=lax';
            window.location.href = '/keystatic';
          </script>
        </body>
        </html>
      `, {
                status: 200,
                headers: { 'Content-Type': 'text/html' },
            });

        } catch (error) {
            return new Response(
                `<h1>OAuth Error</h1><pre>${error instanceof Error ? error.message : String(error)}</pre>`,
                { status: 500, headers: { 'Content-Type': 'text/html' } }
            );
        }
    }

    // ============================================
    // Handle Refresh Token
    // ============================================
    if (url.pathname === '/api/keystatic/github/refresh-token' && context.request.method === 'POST') {
        const accessToken = getTokenFromCookie();

        if (!accessToken) {
            // Let the client-side handle it if no server cookie
            return new Response(JSON.stringify({ error: 'No token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Validate token and get user info
        try {
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'User-Agent': 'Keystatic-Cloudflare',
                    'Accept': 'application/json',
                },
            });

            if (!userResponse.ok) {
                return new Response(JSON.stringify({ error: 'Invalid token' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            return new Response(JSON.stringify({ accessToken }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

        } catch (error) {
            return new Response(JSON.stringify({ error: 'Token validation failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    // Continue to next middleware/route
    return next();
});
