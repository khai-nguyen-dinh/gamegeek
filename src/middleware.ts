/**
 * Middleware to fix Keystatic OAuth issues on Cloudflare
 * Intercepts both the callback and refresh-token endpoints
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

    // ============================================
    // Handle OAuth Callback
    // ============================================
    if (url.pathname === '/api/keystatic/github/oauth/callback' && url.searchParams.has('code')) {
        const code = url.searchParams.get('code');

        if (!clientId || !clientSecret) {
            return new Response(
                `<h1>Missing OAuth Credentials</h1><p>Set KEYSTATIC_GITHUB_CLIENT_ID and KEYSTATIC_GITHUB_CLIENT_SECRET in Cloudflare.</p>`,
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

            // Set cookie and redirect
            const headers = new Headers();
            headers.set('Set-Cookie', `keystatic-gh-access-token=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
            headers.set('Location', '/keystatic');

            return new Response(null, { status: 302, headers });

        } catch (error) {
            return new Response(
                `<h1>OAuth Error</h1><pre>${error instanceof Error ? error.message : String(error)}</pre>`,
                { status: 500, headers: { 'Content-Type': 'text/html' } }
            );
        }
    }

    // ============================================
    // Handle Refresh Token - just validate the existing token
    // ============================================
    if (url.pathname === '/api/keystatic/github/refresh-token' && context.request.method === 'POST') {
        // Get the access token from cookie
        const cookieHeader = context.request.headers.get('cookie') || '';
        const tokenMatch = cookieHeader.match(/keystatic-gh-access-token=([^;]+)/);
        const accessToken = tokenMatch ? tokenMatch[1] : null;

        if (!accessToken) {
            return new Response(JSON.stringify({ error: 'No token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Validate the token by making a request to GitHub
        try {
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'User-Agent': 'Keystatic-Cloudflare',
                    'Accept': 'application/json',
                },
            });

            if (!userResponse.ok) {
                // Token is invalid, clear it
                const headers = new Headers();
                headers.set('Set-Cookie', 'keystatic-gh-access-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Invalid token' }), {
                    status: 401,
                    headers,
                });
            }

            // Token is valid, return success with the same token
            // Keystatic expects { accessToken: string } response
            return new Response(JSON.stringify({ accessToken: accessToken }), {
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

    // Continue to next middleware/route for all other requests
    return next();
});
