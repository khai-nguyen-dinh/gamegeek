import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to format date for Keystatic
function formatDate(dateString) {
  // Convert "August 28, 2025" to "2025-08-28"
  const months = {
    'January': '01', 'February': '02', 'March': '03', 'April': '04',
    'May': '05', 'June': '06', 'July': '07', 'August': '08',
    'September': '09', 'October': '10', 'November': '11', 'December': '12'
  };
  
  const parts = dateString.split(' ');
  if (parts.length === 3) {
    const month = months[parts[0]] || '01';
    const day = parts[1].replace(',', '').padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split('T')[0];
}

// Helper to safely format YAML values
function formatYamlValue(value) {
  if (value === null || value === undefined || value === '') {
    return '""';
  }
  if (typeof value === 'string') {
    // Quote strings that contain special characters or spaces
    if (value.includes(':') || value.includes('"') || value.includes("'") || value.includes('\n')) {
      return `"${value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
    }
    // Quote if starts with number or special char
    if (/^[0-9@#]/.test(value)) {
      return `"${value}"`;
    }
    return value;
  }
  if (typeof value === 'boolean') {
    return value.toString();
  }
  return String(value);
}

// Migrate Categories
function migrateCategories() {
  console.log('📁 Migrating Categories...');
  const newsData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/news.json'), 'utf8'));
  const categoriesDir = path.join(rootDir, 'src/content/categories');
  
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true });
  }
  
  newsData.categories.forEach(category => {
    const filename = `${category.slug}.md`;
    const filepath = path.join(categoriesDir, filename);
    
    const content = `---
id: ${formatYamlValue(category.id)}
name: ${formatYamlValue(category.name)}
slug: ${formatYamlValue(category.slug)}
---
`;
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`  ✓ Created: ${filename}`);
  });
  
  console.log(`✅ Migrated ${newsData.categories.length} categories\n`);
}

// Migrate Posts
function migratePosts() {
  console.log('📝 Migrating Posts...');
  const newsData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/news.json'), 'utf8'));
  const postsDir = path.join(rootDir, 'src/content/posts');
  
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  
  newsData.posts.forEach(post => {
    const slug = post.slug || createSlug(post.title);
    const filename = `${slug}.md`;
    const filepath = path.join(postsDir, filename);
    
    // Format date
    const formattedDate = formatDate(post.date);
    
    const frontmatter = `---
id: ${formatYamlValue(post.id)}
title: ${formatYamlValue(post.title)}
slug: ${formatYamlValue(slug)}
date: ${formatYamlValue(formattedDate)}
category: ${formatYamlValue(post.category)}
author: ${formatYamlValue(post.author || 'Admin')}
image: ${formatYamlValue(post.image || '')}
thumb: ${formatYamlValue(post.thumb || '')}
thumb2: ${formatYamlValue(post.thumb2 || '')}
thumb3: ${formatYamlValue(post.thumb3 || '')}
breadcrumbBg: ${formatYamlValue(post.breadcrumbBg || '')}
---

`;
    
    // Add content if exists
    const content = post.content ? `\n${post.content}\n` : '';
    
    fs.writeFileSync(filepath, frontmatter + content, 'utf8');
    console.log(`  ✓ Created: ${filename}`);
  });
  
  console.log(`✅ Migrated ${newsData.posts.length} posts\n`);
}

// Migrate Slides
function migrateSlides() {
  console.log('🖼️  Migrating Slides...');
  const slidesData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/slides.json'), 'utf8'));
  const slidesDir = path.join(rootDir, 'src/content/slides');
  
  if (!fs.existsSync(slidesDir)) {
    fs.mkdirSync(slidesDir, { recursive: true });
  }
  
  slidesData.slides.forEach((slide, index) => {
    const slug = slide.title ? createSlug(slide.title) : `slide-${index + 1}`;
    const filename = `${slug}.md`;
    const filepath = path.join(slidesDir, filename);
    
    const frontmatter = `---
id: ${formatYamlValue(slide.id || `slide-${index + 1}`)}
type: ${formatYamlValue(slide.type || 'content')}
title: ${formatYamlValue(slide.title || '')}
slug: ${formatYamlValue(slug)}
subtitle: ${formatYamlValue(slide.subtitle || '')}
description: ${formatYamlValue(slide.description || '')}
buttonText: ${formatYamlValue(slide.buttonText || '')}
buttonLink: ${formatYamlValue(slide.buttonLink || '')}
backgroundImage: ${formatYamlValue(slide.backgroundImage || '')}
image: ${formatYamlValue(slide.image || '')}
order: ${slide.order || index + 1}
active: ${slide.active !== false}
---

`;
    
    fs.writeFileSync(filepath, frontmatter, 'utf8');
    console.log(`  ✓ Created: ${filename}`);
  });
  
  console.log(`✅ Migrated ${slidesData.slides.length} slides\n`);
}

// Main migration function
function migrate() {
  console.log('🚀 Starting migration from JSON to Keystatic...\n');
  
  try {
    migrateCategories();
    migratePosts();
    migrateSlides();
    
    console.log('✨ Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('  1. Check the migrated files in src/content/');
    console.log('  2. Review and adjust any fields if needed');
    console.log('  3. Access Keystatic admin at http://localhost:4321/admin');
    console.log('  4. Verify the data in Keystatic CMS');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
