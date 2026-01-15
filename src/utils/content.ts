import contentData from '../data/content.json';

/**
 * Get content from JSON by path
 * Example: getContent('home.hero.title')
 */
export function getContent(path: string): string {
  const keys = path.split('.');
  let value: any = contentData;
  
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
 */
export function getContentObject(path: string): any {
  const keys = path.split('.');
  let value: any = contentData;
  
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
  return contentData;
}
