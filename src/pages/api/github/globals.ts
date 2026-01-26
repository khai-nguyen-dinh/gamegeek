import type { APIRoute } from 'astro';
import { load as loadYaml } from 'js-yaml';

const REPO = 'khai-nguyen-dinh/gamegeek';
const BRANCH = 'main';
const BASE_PATH = 'src/keystatic/globals';

// Available globals
const GLOBALS = ['navbar', 'footer', 'contactForm', 'meta'];

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

async function fetchGlobalContent(globalName: string): Promise<any> {
  const filePath = `${BASE_PATH}/${globalName}.mdoc`;
  const githubUrl = `https://api.github.com/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`;
  
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
    
    // Decode base64 content
    const content = typeof Buffer !== 'undefined'
      ? Buffer.from(data.content, 'base64').toString('utf-8')
      : decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));

    // Parse frontmatter
    const parsed = parseFrontmatter(content);
    return parsed[globalName] || parsed;
  } catch (error: any) {
    console.error(`Error fetching ${globalName}:`, error);
    return null;
  }
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const globalName = url.searchParams.get('name');
    
    // If specific global requested
    if (globalName) {
      if (!GLOBALS.includes(globalName)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Invalid global. Available globals: ${GLOBALS.join(', ')}` 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const content = await fetchGlobalContent(globalName);
      
      if (!content) {
        return new Response(
          JSON.stringify({ success: false, error: `Global "${globalName}" not found` }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          name: globalName,
          data: content 
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
          } 
        }
      );
    }

    // If no name specified, return all globals
    const allGlobals: Record<string, any> = {};
    
    await Promise.all(
      GLOBALS.map(async (globalName) => {
        const content = await fetchGlobalContent(globalName);
        if (content) {
          allGlobals[globalName] = content;
        }
      })
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        globals: allGlobals,
        availableGlobals: GLOBALS
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
