/**
 * Middleware to intercept Keystatic OAuth callback and fix the redirect_uri issue
 */
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);

    // Intercept the OAuth callback
    if (url.pathname === '/api/keystatic/github/oauth/callback' && url.searchParams.has('code')) {
        const code = url.searchParams.get('code');

        // Get environment variables
        // @ts-ignore - Cloudflare runtime
        const runtime = context.locals?.runtime;
        // @ts-ignore
        const env = runtime?.env || {};

        const clientId = env.KEYSTATIC_GITHUB_CLIENT_ID || import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
        const clientSecret = env.KEYSTATIC_GITHUB_CLIENT_SECRET || import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return new Response(
                `<h1>Missing OAuth Credentials</h1>
         <p>KEYSTATIC_GITHUB_CLIENT_ID: ${clientId ? 'Found' : 'MISSING'}</p>
         <p>KEYSTATIC_GITHUB_CLIENT_SECRET: ${clientSecret ? 'Found' : 'MISSING'}</p>
         <p>Please set these in Cloudflare Dashboard → Settings → Environment Variables</p>`,
                { status: 500, headers: { 'Content-Type': 'text/html' } }
            );
        }

        const callbackUrl = `${url.origin}/api/keystatic/github/oauth/callback`;

        try {
            // Exchange code for access token WITH redirect_uri
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
                    redirect_uri: callbackUrl, // THE FIX!
                }),
            });

            const tokenData = await tokenResponse.json();

            if (tokenData.error) {
                return new Response(
                    `<h1>GitHub OAuth Error</h1>
           <p><strong>Error:</strong> ${tokenData.error}</p>
           <p><strong>Description:</strong> ${tokenData.error_description || 'None'}</p>
           <p><strong>Callback URL used:</strong> ${callbackUrl}</p>
           <p>Make sure this exact URL is set in your GitHub OAuth App settings.</p>`,
                    { status: 401, headers: { 'Content-Type': 'text/html' } }
                );
            }

            const accessToken = tokenData.access_token;

            if (!accessToken) {
                return new Response(
                    `<h1>No Access Token Received</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre>`,
                    { status: 401, headers: { 'Content-Type': 'text/html' } }
                );
            }

            // Set the cookie and redirect to Keystatic
            const headers = new Headers();
            headers.set('Set-Cookie', `keystatic-gh-access-token=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
            headers.set('Location', '/keystatic');

            return new Response(null, {
                status: 302,
                headers,
            });

        } catch (error) {
            return new Response(
                `<h1>OAuth Error</h1><pre>${error instanceof Error ? error.message : String(error)}</pre>`,
                { status: 500, headers: { 'Content-Type': 'text/html' } }
            );
        }
    }

    // Continue to next middleware/route for all other requests
    return next();
});
