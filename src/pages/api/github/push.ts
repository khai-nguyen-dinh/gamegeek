import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
  const { request, cookies } = context;
  try {
    const { path, content, message } = await request.json();

    if (!path || !content) {
      return new Response(
        JSON.stringify({ success: false, error: 'Path and content are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate JSON
    try {
      JSON.parse(content);
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const repo = 'khai-nguyen-dinh/gamegeek';
    const branch = 'main';
    
    // Try to get token from multiple sources (priority order):
    // 1. Header X-GitHub-Token (from client-side localStorage)
    // 2. Cookie (if user logged in via Keystatic OAuth)
    // 3. Environment variables (GITHUB_TOKEN, KEYSTATIC_GITHUB_TOKEN, etc.)
    const tokenFromHeader = request.headers.get('X-GitHub-Token');
    const tokenFromCookie = cookies.get('keystatic-gh-access-token')?.value;
    
    // Get environment variables (support Cloudflare runtime)
    // @ts-ignore
    const runtime = context.locals?.runtime;
    // @ts-ignore
    const env = runtime?.env || {};
    
    const githubToken = 
      tokenFromHeader ||
      tokenFromCookie || 
      env.GITHUB_TOKEN || 
      env.KEYSTATIC_GITHUB_TOKEN ||
      import.meta.env.GITHUB_TOKEN ||
      import.meta.env.KEYSTATIC_GITHUB_TOKEN;

    if (!githubToken) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'GitHub token not found. Please either:\n1. Login via Keystatic OAuth (visit /keystatic first)\n2. Set GITHUB_TOKEN or KEYSTATIC_GITHUB_TOKEN environment variable' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Get current file SHA (if exists)
    let sha: string | undefined;
    try {
      const getFileUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
      const getFileResponse = await fetch(getFileUrl, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GameGeek-CMS',
        },
      });

      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        sha = fileData.sha;
      }
    } catch (error) {
      // File doesn't exist, will create new one
    }

    // Step 2: Encode content to base64
    // Use btoa for browser/Cloudflare compatibility
    const encodedContent = typeof Buffer !== 'undefined' 
      ? Buffer.from(content, 'utf-8').toString('base64')
      : btoa(unescape(encodeURIComponent(content)));

    // Step 3: Create or update file
    const pushUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
    const pushResponse = await fetch(pushUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'GameGeek-CMS',
      },
      body: JSON.stringify({
        message: message || 'Update JSON file via CMS',
        content: encodedContent,
        branch: branch,
        ...(sha && { sha }), // Include SHA if updating existing file
      }),
    });

    if (!pushResponse.ok) {
      const errorData = await pushResponse.json();
      throw new Error(errorData.message || `GitHub API error: ${pushResponse.status}`);
    }

    const result = await pushResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        commitSha: result.commit.sha,
        message: 'File successfully pushed to GitHub'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

