import type { APIRoute } from 'astro';
import { load as loadYaml } from 'js-yaml';

const REPO = 'khai-nguyen-dinh/gamegeek';
const BRANCH = 'main';
const BASE_PATH = 'src/keystatic/page-content';

// Available pages
const PAGES = ['home', 'about', 'contact', 'news', 'blog', 'career', 'program'];

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

async function fetchPageContent(page: string): Promise<any> {
  const filePath = `${BASE_PATH}/${page}.mdoc`;
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
    return parsed[page] || parsed;
  } catch (error: any) {
    console.error(`Error fetching ${page}:`, error);
    return null;
  }
}

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const page = url.searchParams.get('page');
    
    // If specific page requested
    if (page) {
      if (!PAGES.includes(page)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Invalid page. Available pages: ${PAGES.join(', ')}` 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const content = await fetchPageContent(page);
      
      if (!content) {
        return new Response(
          JSON.stringify({ success: false, error: `Page "${page}" not found` }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          page,
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

    // If no page specified, return all pages
    const allPages: Record<string, any> = {};
    
    await Promise.all(
      PAGES.map(async (pageName) => {
        const content = await fetchPageContent(pageName);
        if (content) {
          allPages[pageName] = content;
        }
      })
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        pages: allPages,
        availablePages: PAGES
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
