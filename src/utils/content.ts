import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadYaml } from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');
const keystaticContentPath = path.join(rootDir, 'src/keystatic/site-content.yaml');
const legacyContentPath = path.join(rootDir, 'src/data/content.json');

let cachedContent: any | null = null;

function getContentData(): any {
  if (cachedContent && !import.meta.env.DEV) {
    return cachedContent;
  }

  let data: any = null;

  if (fs.existsSync(keystaticContentPath)) {
    const yamlContent = fs.readFileSync(keystaticContentPath, 'utf8');
    data = loadYaml(yamlContent) ?? null;
  }

  if (!data && fs.existsSync(legacyContentPath)) {
    const jsonContent = fs.readFileSync(legacyContentPath, 'utf8');
    data = JSON.parse(jsonContent);
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
