/**
 * Patch Keystatic OAuth for Cloudflare compatibility
 * 
 * Fixes: Keystatic doesn't send redirect_uri in token exchange, 
 * causing GitHub to reject with 401 on Cloudflare Workers.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = resolve(__dirname, '../node_modules/@keystatic/core/dist');

if (!existsSync(distPath)) {
    console.log('ℹ️ Keystatic not found. Skipping patch.');
    process.exit(0);
}

// Find worker API files
const files = readdirSync(distPath).filter(f =>
    f.includes('api') && f.endsWith('.worker.js')
);

if (files.length === 0) {
    console.log('ℹ️ No Keystatic worker files found.');
    process.exit(0);
}

let patchedCount = 0;

for (const file of files) {
    const filePath = join(distPath, file);
    let content = readFileSync(filePath, 'utf8');

    // Skip if already patched
    if (content.includes('PATCHED_REDIRECT_URI')) {
        console.log(`✅ Already patched: ${file}`);
        continue;
    }

    // Find and patch the GitHub OAuth token exchange
    // Looking for the fetch call to github.com/login/oauth/access_token
    // and adding redirect_uri to the body

    // Pattern: The token exchange typically looks like:
    // fetch("https://github.com/login/oauth/access_token", { body: JSON.stringify({ code, client_id, client_secret }) })

    let patched = false;

    // Try to find and patch the token exchange
    // Match patterns like: {code:X,client_id:Y.clientId,client_secret:Y.secret}
    const tokenExchangePattern = /(\{code:\w+,client_id:\w+\.clientId,client_secret:\w+\.secret)\}/g;

    if (tokenExchangePattern.test(content)) {
        content = content.replace(tokenExchangePattern, (match, prefix) => {
            patched = true;
            // Extract the callback URL - it's usually stored in a variable before this
            return `${prefix},redirect_uri:n}/*PATCHED_REDIRECT_URI*/`;
        });
    }

    // Alternative pattern for different minification
    const altPattern = /client_secret:(\w+)\.secret\}/g;
    if (!patched && altPattern.test(content)) {
        content = content.replace(altPattern, (match, varName) => {
            patched = true;
            return `client_secret:${varName}.secret,redirect_uri:n}/*PATCHED_REDIRECT_URI*/`;
        });
    }

    // Another alternative - look for the specific structure
    const altPattern2 = /(client_secret:\w+\.secret)(\s*\})/g;
    if (!patched && altPattern2.test(content)) {
        content = content.replace(altPattern2, (match, secretPart, ending) => {
            patched = true;
            return `${secretPart},redirect_uri:n${ending}/*PATCHED_REDIRECT_URI*/`;
        });
    }

    if (patched) {
        writeFileSync(filePath, content);
        patchedCount++;
        console.log(`✅ Patched: ${file}`);
    }
}

if (patchedCount > 0) {
    console.log(`\n✅ Patched ${patchedCount} file(s) for Cloudflare OAuth compatibility`);
} else {
    console.log('⚠️ Could not find code to patch. The fix may already be included.');
}

process.exit(0);
