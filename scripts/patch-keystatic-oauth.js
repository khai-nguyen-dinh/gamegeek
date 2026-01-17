/**
 * Post-install script to patch Keystatic OAuth for Cloudflare compatibility
 * 
 * This fixes a bug where Keystatic omits the redirect_uri during OAuth token exchange,
 * causing GitHub to reject the request with a 401 error on Cloudflare Workers.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const oauthFilePath = resolve(__dirname, '../node_modules/@keystatic/core/api/github/oauth.js');

try {
    let content = readFileSync(oauthFilePath, 'utf8');

    // Check if already patched
    if (content.includes('redirect_uri: callbackUrl')) {
        console.log('✅ Keystatic OAuth already patched');
        process.exit(0);
    }

    // Patch the token exchange to include redirect_uri
    // The issue is that GitHub requires redirect_uri in the token exchange
    // when it was provided in the initial authorization request
    const originalCode = `code,
        client_id: config.clientId,
        client_secret: config.secret`;

    const patchedCode = `code,
        client_id: config.clientId,
        client_secret: config.secret,
        redirect_uri: callbackUrl`;

    if (content.includes(originalCode)) {
        content = content.replace(originalCode, patchedCode);
        writeFileSync(oauthFilePath, content);
        console.log('✅ Keystatic OAuth patched successfully for Cloudflare');
    } else {
        console.log('⚠️ Could not find exact code to patch. Keystatic may have been updated.');
        console.log('   Please check the OAuth implementation manually.');
    }
} catch (error) {
    console.error('❌ Failed to patch Keystatic:', error.message);
    process.exit(1);
}
