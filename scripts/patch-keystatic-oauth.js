/**
 * Post-install script to patch Keystatic OAuth for Cloudflare compatibility
 * 
 * This fixes a bug where Keystatic omits the redirect_uri during OAuth token exchange,
 * causing GitHub to reject the request with a 401 error on Cloudflare Workers.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const nodeModulesPath = resolve(__dirname, '../node_modules/@keystatic/core/dist');

// Check if the dist folder exists
if (!existsSync(nodeModulesPath)) {
    console.log('ℹ️ Keystatic not found. Skipping OAuth patch.');
    process.exit(0);
}

// Find all api-*.worker.js files (used by Cloudflare)
const files = readdirSync(nodeModulesPath).filter(f =>
    f.startsWith('api-') && f.endsWith('.worker.js')
);

if (files.length === 0) {
    console.log('ℹ️ No Keystatic worker API files found. Skipping patch.');
    process.exit(0);
}

let patchedCount = 0;
let alreadyPatchedCount = 0;

for (const file of files) {
    const filePath = join(nodeModulesPath, file);

    try {
        let content = readFileSync(filePath, 'utf8');

        // Check if already patched
        if (content.includes('redirect_uri')) {
            alreadyPatchedCount++;
            continue;
        }

        // Look for the OAuth token exchange pattern (minified)
        // Pattern: code,client_id:e.clientId,client_secret:e.secret
        // We need to add redirect_uri after client_secret

        const patterns = [
            // Minified pattern variations
            {
                regex: /code,client_id:(\w+)\.clientId,client_secret:\1\.secret\}/g,
                replacement: (match, varName) =>
                    `code,client_id:${varName}.clientId,client_secret:${varName}.secret,redirect_uri:callbackUrl}`
            },
            {
                regex: /code,client_id:(\w+)\.clientId,client_secret:\1\.secret,/g,
                replacement: (match, varName) =>
                    `code,client_id:${varName}.clientId,client_secret:${varName}.secret,redirect_uri:callbackUrl,`
            },
            // Alternative patterns
            {
                regex: /"code":(\w+),"client_id":(\w+)\.clientId,"client_secret":\2\.secret/g,
                replacement: (match, codeVar, configVar) =>
                    `"code":${codeVar},"client_id":${configVar}.clientId,"client_secret":${configVar}.secret,"redirect_uri":callbackUrl`
            }
        ];

        let patched = false;
        for (const pattern of patterns) {
            if (pattern.regex.test(content)) {
                content = content.replace(pattern.regex, pattern.replacement);
                patched = true;
            }
        }

        if (patched) {
            writeFileSync(filePath, content);
            patchedCount++;
            console.log(`✅ Patched: ${file}`);
        }
    } catch (error) {
        console.error(`⚠️ Error processing ${file}:`, error.message);
    }
}

if (patchedCount > 0) {
    console.log(`\n✅ Keystatic OAuth patched successfully (${patchedCount} file(s))`);
} else if (alreadyPatchedCount > 0) {
    console.log(`✅ Keystatic OAuth already patched (${alreadyPatchedCount} file(s))`);
} else {
    console.log('⚠️ No files needed patching. This could mean:');
    console.log('   - Keystatic already includes the fix');
    console.log('   - The code pattern has changed');
}

// Always exit successfully to not block the build
process.exit(0);
