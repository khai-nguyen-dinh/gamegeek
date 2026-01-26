import { load as loadYaml } from 'js-yaml';
import siteContentRaw from '../keystatic/site-content.yaml?raw';

let cachedContent: any | null = null;
let cachedGlobals: any | null = null;
let cachedPageContent: any | null = null;

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

async function getPageContentData(): Promise<any> {
  if (cachedPageContent && !import.meta.env.DEV) {
    return cachedPageContent;
  }

  const pageContent: any = {};
  
  try {
    // Load home
    try {
      const homeModule = await import('../keystatic/page-content/home.mdoc?raw');
      const homeRaw = typeof homeModule === 'string' ? homeModule : homeModule?.default || '';
      if (homeRaw) {
        const homeData = parseFrontmatter(homeRaw);
        if (homeData.home) {
          pageContent.home = homeData.home;
        }
      }
    } catch (e) {
      console.warn('Could not load home.mdoc');
    }

    // Load about
    try {
      const aboutModule = await import('../keystatic/page-content/about.mdoc?raw');
      const aboutRaw = typeof aboutModule === 'string' ? aboutModule : aboutModule?.default || '';
      if (aboutRaw) {
        const aboutData = parseFrontmatter(aboutRaw);
        if (aboutData.about) {
          pageContent.about = aboutData.about;
        }
      }
    } catch (e) {
      console.warn('Could not load about.mdoc');
    }

    // Load contact
    try {
      const contactModule = await import('../keystatic/page-content/contact.mdoc?raw');
      const contactRaw = typeof contactModule === 'string' ? contactModule : contactModule?.default || '';
      if (contactRaw) {
        const contactData = parseFrontmatter(contactRaw);
        if (contactData.contact) {
          pageContent.contact = contactData.contact;
        }
      }
    } catch (e) {
      console.warn('Could not load contact.mdoc');
    }

    // Load news
    try {
      const newsModule = await import('../keystatic/page-content/news.mdoc?raw');
      const newsRaw = typeof newsModule === 'string' ? newsModule : newsModule?.default || '';
      if (newsRaw) {
        const newsData = parseFrontmatter(newsRaw);
        if (newsData.news) {
          pageContent.news = newsData.news;
        }
      }
    } catch (e) {
      console.warn('Could not load news.mdoc');
    }

    // Load blog
    try {
      const blogModule = await import('../keystatic/page-content/blog.mdoc?raw');
      const blogRaw = typeof blogModule === 'string' ? blogModule : blogModule?.default || '';
      if (blogRaw) {
        const blogData = parseFrontmatter(blogRaw);
        if (blogData.blog) {
          pageContent.blog = blogData.blog;
        }
      }
    } catch (e) {
      console.warn('Could not load blog.mdoc');
    }

    // Load career
    try {
      const careerModule = await import('../keystatic/page-content/career.mdoc?raw');
      const careerRaw = typeof careerModule === 'string' ? careerModule : careerModule?.default || '';
      if (careerRaw) {
        const careerData = parseFrontmatter(careerRaw);
        if (careerData.career) {
          pageContent.career = careerData.career;
        }
      }
    } catch (e) {
      console.warn('Could not load career.mdoc');
    }

    // Load program
    try {
      const programModule = await import('../keystatic/page-content/program.mdoc?raw');
      const programRaw = typeof programModule === 'string' ? programModule : programModule?.default || '';
      if (programRaw) {
        const programData = parseFrontmatter(programRaw);
        if (programData.program) {
          pageContent.program = programData.program;
        }
      }
    } catch (e) {
      console.warn('Could not load program.mdoc');
    }
  } catch (error) {
    console.error('Error loading page content:', error);
  }

  if (!import.meta.env.DEV) {
    cachedPageContent = pageContent;
  }

  return pageContent;
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
 * For page content: getContentObject('home'), getContentObject('about'), etc.
 */
export async function getContentObject(path: string): Promise<any> {
  // Check if it's a global (navbar, footer, contactForm, meta)
  const globals = ['navbar', 'footer', 'contactForm', 'meta'];
  if (globals.includes(path)) {
    const globalsData = await getGlobalsData();
    return globalsData[path] || null;
  }
  
  // Check if it's a page content root (home, about, contact, news, blog, career, program)
  const pageContentRoots = ['home', 'about', 'contact', 'news', 'blog', 'career', 'program'];
  const firstKey = path.split('.')[0];
  if (pageContentRoots.includes(firstKey)) {
    const pageContentData = await getPageContentData();
    const keys = path.split('.');
    let value: any = pageContentData;
    
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
  
  // Otherwise, get from site content (legacy)
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
