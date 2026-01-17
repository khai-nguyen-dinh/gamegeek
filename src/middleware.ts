/**
 * Middleware to fix Keystatic OAuth issues on Cloudflare
 * Intercepts OAuth callback, refresh-token, and user endpoints
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
    // Handle Refresh Token
    // ============================================
    if (url.pathname === '/api/keystatic/github/refresh-token' && context.request.method === 'POST') {
        const accessToken = getTokenFromCookie();

        if (!accessToken) {
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
                const headers = new Headers();
                headers.set('Set-Cookie', 'keystatic-gh-access-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Invalid token' }), {
                    status: 401,
                    headers,
                });
            }

            const user = await userResponse.json();

            // Return in the format Keystatic expects
            return new Response(JSON.stringify({
                accessToken: accessToken,
                user: {
                    login: user.login,
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar_url,
                }
            }), {
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

    // ============================================
    // Handle Tree/Content API - passthrough to GitHub
    // ============================================
    if (url.pathname.startsWith('/api/keystatic/github/')) {
        const accessToken = getTokenFromCookie();

        if (!accessToken) {
            return new Response(JSON.stringify({ error: 'No token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // For other Keystatic API endpoints, let them pass through to the built-in handler
        // but ensure the token is available
        // @ts-ignore
        context.locals.keystatic_token = accessToken;
    }

    // Continue to next middleware/route for all other requests
    return next();
});
