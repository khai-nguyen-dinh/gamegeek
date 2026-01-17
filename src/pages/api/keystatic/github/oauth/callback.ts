/**
 * Custom GitHub OAuth callback handler for Keystatic on Cloudflare
 * Shows detailed errors in browser for debugging
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    const { request, cookies, redirect } = context;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    const debugInfo: string[] = [];
    debugInfo.push('=== OAuth Debug Info ===');
    debugInfo.push(`Time: ${new Date().toISOString()}`);
    debugInfo.push(`Code received: ${code ? 'yes' : 'no'}`);

    if (!code) {
        return new Response(`<h1>Error: Missing authorization code</h1><pre>${debugInfo.join('\n')}</pre>`, {
            status: 400,
            headers: { 'Content-Type': 'text/html' }
        });
    }

    // Get environment variables - try multiple methods for Cloudflare
    // @ts-ignore
    const runtime = context.locals?.runtime;
    // @ts-ignore
    const cfEnv = runtime?.env || {};

    const clientId = cfEnv.KEYSTATIC_GITHUB_CLIENT_ID || import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
    const clientSecret = cfEnv.KEYSTATIC_GITHUB_CLIENT_SECRET || import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

    debugInfo.push(`Client ID found: ${clientId ? 'yes (' + clientId.substring(0, 8) + '...)' : 'NO!'}`);
    debugInfo.push(`Client Secret found: ${clientSecret ? 'yes' : 'NO!'}`);

    if (!clientId || !clientSecret) {
        return new Response(
            `<h1>Error: Missing OAuth credentials</h1>
       <p>Please set KEYSTATIC_GITHUB_CLIENT_ID and KEYSTATIC_GITHUB_CLIENT_SECRET in Cloudflare environment variables.</p>
       <pre>${debugInfo.join('\n')}</pre>`,
            { status: 500, headers: { 'Content-Type': 'text/html' } }
        );
    }

    const callbackUrl = `${url.origin}/api/keystatic/github/oauth/callback`;
    debugInfo.push(`Callback URL: ${callbackUrl}`);

    try {
        const tokenRequestBody = {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: callbackUrl,
        };

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Keystatic-Cloudflare',
            },
            body: JSON.stringify(tokenRequestBody),
        });

        const tokenText = await tokenResponse.text();
        debugInfo.push(`GitHub response status: ${tokenResponse.status}`);

        let tokenData;
        try {
            tokenData = JSON.parse(tokenText);
        } catch {
            debugInfo.push(`GitHub response (not JSON): ${tokenText}`);
            return new Response(
                `<h1>Error: Invalid response from GitHub</h1><pre>${debugInfo.join('\n')}</pre>`,
                { status: 401, headers: { 'Content-Type': 'text/html' } }
            );
        }

        if (tokenData.error) {
            debugInfo.push(`GitHub error: ${tokenData.error}`);
            debugInfo.push(`GitHub error description: ${tokenData.error_description || 'none'}`);
            return new Response(
                `<h1>GitHub OAuth Error</h1>
         <p><strong>Error:</strong> ${tokenData.error}</p>
         <p><strong>Description:</strong> ${tokenData.error_description || 'No description'}</p>
         <pre>${debugInfo.join('\n')}</pre>`,
                { status: 401, headers: { 'Content-Type': 'text/html' } }
            );
        }

        const accessToken = tokenData.access_token;

        if (!accessToken) {
            debugInfo.push(`Response data: ${JSON.stringify(tokenData)}`);
            return new Response(
                `<h1>Error: No access token</h1><pre>${debugInfo.join('\n')}</pre>`,
                { status: 401, headers: { 'Content-Type': 'text/html' } }
            );
        }

        // Success! Set cookie and redirect
        cookies.set('keystatic-gh-access-token', accessToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
        });

        return redirect('/keystatic');

    } catch (error) {
        debugInfo.push(`Exception: ${error instanceof Error ? error.message : String(error)}`);
        return new Response(
            `<h1>Error during OAuth</h1><pre>${debugInfo.join('\n')}</pre>`,
            { status: 500, headers: { 'Content-Type': 'text/html' } }
        );
    }
};
