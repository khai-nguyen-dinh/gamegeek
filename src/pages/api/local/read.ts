import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../../../../');

export const GET: APIRoute = async ({ url }) => {
  const filePath = url.searchParams.get('path');

  if (!filePath) {
    return new Response(
      JSON.stringify({ success: false, error: 'File path is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Resolve file path relative to project root
    const fullPath = join(projectRoot, filePath);

    // Security: Ensure the path is within project root
    const resolvedPath = join(projectRoot, filePath);
    if (!resolvedPath.startsWith(projectRoot)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid file path' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Read file from local filesystem
    const content = readFileSync(resolvedPath, 'utf-8');

    return new Response(
      JSON.stringify({ success: true, content }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return new Response(
        JSON.stringify({ success: false, error: 'File not found in local filesystem' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

