import { load as loadYaml } from 'js-yaml';
import siteContentRaw from '../keystatic/site-content.yaml?raw';

let cachedContent: any | null = null;
let cachedGlobals: any | null = null;

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

async function getGlobalsData(): Promise<any> {
  if (cachedGlobals && !import.meta.env.DEV) {
    return cachedGlobals;
  }

  const globals: any = {};
  
  try {
    // Load navbar
    try {
      const navbarModule = await import('../keystatic/globals/navbar.mdoc?raw');
      const navbarRaw = typeof navbarModule === 'string' ? navbarModule : navbarModule?.default || '';
      if (navbarRaw) {
        const navbarData = parseFrontmatter(navbarRaw);
        if (navbarData.navbar) {
          globals.navbar = navbarData.navbar;
        }
      }
    } catch (e) {
      console.warn('Could not load navbar.mdoc');
    }

    // Load footer
    try {
      const footerModule = await import('../keystatic/globals/footer.mdoc?raw');
      const footerRaw = typeof footerModule === 'string' ? footerModule : footerModule?.default || '';
      if (footerRaw) {
        const footerData = parseFrontmatter(footerRaw);
        if (footerData.footer) {
          globals.footer = footerData.footer;
        }
      }
    } catch (e) {
      console.warn('Could not load footer.mdoc');
    }

    // Load contactForm
    try {
      const contactFormModule = await import('../keystatic/globals/contactForm.mdoc?raw');
      const contactFormRaw = typeof contactFormModule === 'string' ? contactFormModule : contactFormModule?.default || '';
      if (contactFormRaw) {
        const contactFormData = parseFrontmatter(contactFormRaw);
        if (contactFormData.contactForm) {
          globals.contactForm = contactFormData.contactForm;
        }
      }
    } catch (e) {
      console.warn('Could not load contactForm.mdoc');
    }

    // Load meta
    try {
      const metaModule = await import('../keystatic/globals/meta.mdoc?raw');
      const metaRaw = typeof metaModule === 'string' ? metaModule : metaModule?.default || '';
      if (metaRaw) {
        const metaData = parseFrontmatter(metaRaw);
        if (metaData.meta) {
          globals.meta = metaData.meta;
        }
      }
    } catch (e) {
      console.warn('Could not load meta.mdoc');
    }
  } catch (error) {
    console.error('Error loading globals:', error);
  }

  if (!import.meta.env.DEV) {
    cachedGlobals = globals;
  }

  return globals;
}

function getContentData(): any {
  if (cachedContent && !import.meta.env.DEV) {
    return cachedContent;
  }

  let data: any = null;

  if (siteContentRaw && typeof siteContentRaw === 'string') {
    data = loadYaml(siteContentRaw) ?? null;
  }

  if (!import.meta.env.DEV) {
    cachedContent = data || {};
  }

  return data || {};
}

/**
 * Get content from JSON by path
 * Example: getContent('home.hero.title')
 */
export function getContent(path: string): string {
  const keys = path.split('.');
  let value: any = getContentData();
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Content path not found: ${path}`);
      return '';
    }
  }
  
  return typeof value === 'string' ? value : '';
}

/**
 * Get nested object from content
 * Example: getContentObject('home.services')
 * For globals: getContentObject('navbar'), getContentObject('footer'), etc.
 */
export async function getContentObject(path: string): Promise<any> {
  // Check if it's a global (navbar, footer, contactForm, meta)
  const globals = ['navbar', 'footer', 'contactForm', 'meta'];
  if (globals.includes(path)) {
    const globalsData = await getGlobalsData();
    return globalsData[path] || null;
  }
  
  // Otherwise, get from site content
  const keys = path.split('.');
  let value: any = getContentData();
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Content path not found: ${path}`);
      return null;
    }
  }
  
  return value;
}

/**
 * Get all content data
 */
export function getAllContent() {
  return getContentData();
}
