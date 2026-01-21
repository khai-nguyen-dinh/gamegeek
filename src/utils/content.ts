import { load as loadYaml } from 'js-yaml';
import siteContentRaw from '../keystatic/site-content.yaml?raw';

let cachedContent: any | null = null;

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
 */
export function getContentObject(path: string): any {
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
