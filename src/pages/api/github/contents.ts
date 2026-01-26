import type { APIRoute } from 'astro';
import { load as loadYaml } from 'js-yaml';

const REPO = 'khai-nguyen-dinh/gamegeek';
const BRANCH = 'main';

function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  let match = content.match(frontmatterRegex);
  
  if (!match) {
    const firstDash = content.indexOf('---\n');
    if (firstDash === 0) {
      const secondDash = content.indexOf('\n---\n', firstDash + 4);
      if (secondDash > 0) {
        const yamlContent = content.substring(4, secondDash);
        try {
          const data = loadYaml(yamlContent) as any;
          return data || {};
        } catch (error) {
          console.error('Error parsing YAML:', error);
          return {};
        }
      }
    }
    return {};
  }

  const yamlContent = match[1];
  try {
    const data = loadYaml(yamlContent) as any;
    return data || {};
  } catch (error) {
    console.error('Error parsing YAML:', error);
    return {};
  }
}

async function fetchFileContent(path: string, decode: boolean = true): Promise<any> {
  const githubUrl = `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`;
  
  try {
    const response = await fetch(githubUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GameGeek-CMS',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // If it's a directory, return the list
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        sha: item.sha,
        url: item.html_url,
        download_url: item.download_url,
        git_url: item.git_url,
      }));
    }

    // If it's a file and decode is requested
    if (decode && data.type === 'file') {
      const content = typeof Buffer !== 'undefined'
        ? Buffer.from(data.content, 'base64').toString('utf-8')
        : decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));

      // Try to parse if it's a .mdoc or .yaml file
      if (data.name.endsWith('.mdoc')) {
        const parsed = parseFrontmatter(content);
        return {
          ...data,
          content: content,
          parsed: parsed,
        };
      } else if (data.name.endsWith('.yaml') || data.name.endsWith('.yml')) {
        try {
          const parsed = loadYaml(content) as any;
          return {
            ...data,
            content: content,
            parsed: parsed,
          };
        } catch (error) {
          return {
            ...data,
            content: content,
          };
        }
      }

      return {
        ...data,
        content: content,
      };
    }

    // Return raw file info
    return {
      name: data.name,
      path: data.path,
      type: data.type,
      size: data.size,
      sha: data.sha,
      url: data.html_url,
      download_url: data.download_url,
      git_url: data.git_url,
      encoding: data.encoding,
      content: decode ? undefined : data.content, // Only include content if decode is true
    };
  } catch (error: any) {
    console.error(`Error fetching ${path}:`, error);
    throw error;
  }
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const path = url.searchParams.get('path');
    const decode = url.searchParams.get('decode') !== 'false'; // Default to true
    const raw = url.searchParams.get('raw') === 'true'; // Return raw GitHub response

    if (!path) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Path parameter is required. Example: ?path=src/keystatic/categories' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If raw mode, return direct GitHub API response
    if (raw) {
      const githubUrl = `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`;
      const response = await fetch(githubUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GameGeek-CMS',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        return new Response(
          JSON.stringify({ success: false, error: errorData.message || `GitHub API error: ${response.status}` }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      return new Response(
        JSON.stringify({ success: true, data }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300'
          } 
        }
      );
    }

    // Process and decode content
    const result = await fetchFileContent(path, decode);

    if (result === null) {
      return new Response(
        JSON.stringify({ success: false, error: `Path "${path}" not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        path,
        data: result 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        } 
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
