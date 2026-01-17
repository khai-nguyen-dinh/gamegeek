/**
 * Custom GitHub OAuth callback handler for Keystatic on Cloudflare
 * 
 * This fixes the token exchange issue where Keystatic doesn't send redirect_uri
 */
import type { APIRoute } from 'astro';

const GITHUB_CLIENT_ID = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
        return new Response('Missing authorization code', { status: 400 });
    }

    // Construct the callback URL (must match what was sent in the authorization request)
    const callbackUrl = `${url.origin}/api/keystatic/github/oauth/callback`;

    try {
        // Exchange code for access token - INCLUDE redirect_uri!
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: callbackUrl, // This is the fix!
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error('GitHub OAuth error:', tokenData);
            return new Response(`Authorization failed: ${tokenData.error_description || tokenData.error}`, {
                status: 401
            });
        }

        const accessToken = tokenData.access_token;

        if (!accessToken) {
            return new Response('No access token received', { status: 401 });
        }

        // Store the token in a cookie for Keystatic to use
        // Keystatic expects this cookie format
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
        return new Response('Authorization failed', { status: 500 });
    }
};
