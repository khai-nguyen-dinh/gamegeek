import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const filePath = url.searchParams.get('path');

  if (!filePath) {
    return new Response(
      JSON.stringify({ success: false, error: 'File path is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const repo = 'khai-nguyen-dinh/gamegeek';
    const branch = 'main';
    
    // Fetch file content from GitHub
    const githubUrl = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;
    const response = await fetch(githubUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GameGeek-CMS',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ success: false, error: 'File not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Decode base64 content
    // Use atob for browser/Cloudflare compatibility
    const content = typeof Buffer !== 'undefined'
      ? Buffer.from(data.content, 'base64').toString('utf-8')
      : decodeURIComponent(escape(atob(data.content)));

    return new Response(
      JSON.stringify({ success: true, content }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

