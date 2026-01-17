/**
 * Custom GitHub OAuth callback handler for Keystatic on Cloudflare
 * This overrides Keystatic's built-in callback to fix the redirect_uri issue
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    const { request, cookies, redirect } = context;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    console.log('=== Custom OAuth Callback Hit ===');
    console.log('URL:', url.toString());
    console.log('Code received:', code ? 'yes' : 'no');

    if (!code) {
        return new Response('Missing authorization code', { status: 400 });
    }

    // Get environment variables - on Cloudflare they're in the platform runtime
    // @ts-ignore - Cloudflare runtime binding
    const env = context.locals?.runtime?.env || import.meta.env;

    const clientId = env.KEYSTATIC_GITHUB_CLIENT_ID;
    const clientSecret = env.KEYSTATIC_GITHUB_CLIENT_SECRET;

    console.log('Client ID available:', clientId ? 'yes' : 'no');
    console.log('Client Secret available:', clientSecret ? 'yes' : 'no');

    if (!clientId || !clientSecret) {
        console.error('Missing GitHub OAuth credentials');
        return new Response('Server configuration error: Missing OAuth credentials', { status: 500 });
    }

    // Construct the callback URL (must match exactly what was sent in authorization)
    const callbackUrl = `${url.origin}/api/keystatic/github/oauth/callback`;
    console.log('Callback URL:', callbackUrl);

    try {
        const tokenRequestBody = {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: callbackUrl,
        };

        console.log('Token request body (without secret):', {
            ...tokenRequestBody,
            client_secret: '[REDACTED]'
        });

        // Exchange code for access token
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
        console.log('Token response status:', tokenResponse.status);
        console.log('Token response:', tokenText.substring(0, 200));

        let tokenData;
        try {
            tokenData = JSON.parse(tokenText);
        } catch {
            console.error('Failed to parse token response as JSON');
            return new Response(`Authorization failed: Invalid response from GitHub`, { status: 401 });
        }

        if (tokenData.error) {
            console.error('GitHub OAuth error:', tokenData);
            return new Response(
                `Authorization failed: ${tokenData.error_description || tokenData.error}`,
                { status: 401 }
            );
        }

        const accessToken = tokenData.access_token;

        if (!accessToken) {
            console.error('No access token in response:', tokenData);
            return new Response('No access token received from GitHub', { status: 401 });
        }

        console.log('Access token received successfully');

        // Store the token in a cookie for Keystatic
        cookies.set('keystatic-gh-access-token', accessToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        // Redirect to Keystatic admin
        return redirect('/keystatic');

    } catch (error) {
        console.error('OAuth callback error:', error);
        return new Response(`Authorization failed: ${error instanceof Error ? error.message : 'Unknown error'}`, {
            status: 500
        });
    }
};
