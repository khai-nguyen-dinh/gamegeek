import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dump } from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'src/keystatic');

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

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function clearDir(dirPath) {
  ensureDir(dirPath);
  for (const entry of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    if (fs.lstatSync(fullPath).isFile()) {
      fs.unlinkSync(fullPath);
    }
  }
}

// Migrate Categories
function migrateCategories() {
  console.log('📁 Migrating Categories...');
  const newsData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/news.json'), 'utf8'));
  const categoriesDir = path.join(rootDir, 'src/keystatic/categories');

  clearDir(categoriesDir);

  newsData.categories.forEach(category => {
    const filename = `${category.slug}.yaml`;
    const filepath = path.join(categoriesDir, filename);

    const data = {
      id: category.id ?? '',
      name: category.name ?? '',
      slug: category.slug ?? '',
    };

    fs.writeFileSync(filepath, dump(data, { lineWidth: -1 }), 'utf8');
    console.log(`  ✓ Created: ${filename}`);
  });
  
  console.log(`✅ Migrated ${newsData.categories.length} categories\n`);
}

// Migrate Posts
function migratePosts() {
  console.log('📝 Migrating Posts...');
  const newsData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/news.json'), 'utf8'));
  const postsDir = path.join(rootDir, 'src/keystatic/posts');

  clearDir(postsDir);

  newsData.posts.forEach(post => {
    const slug = post.slug || createSlug(post.title);
    const filename = `${slug}.mdoc`;
    const filepath = path.join(postsDir, filename);
    
    // Format date
    const formattedDate = formatDate(post.date);
    
    const frontmatterData = {
      id: post.id ?? '',
      title: {
        name: post.title || '',
        slug,
      },
      slug,
      date: formattedDate,
      category: post.category || '',
      author: post.author || 'Admin',
      image: post.image || '',
      thumb: post.thumb || '',
      thumb2: post.thumb2 || '',
      thumb3: post.thumb3 || '',
      breadcrumbBg: post.breadcrumbBg || '',
    };
    const frontmatter = `---\n${dump(frontmatterData, { lineWidth: -1 })}---\n\n`;
    
    // Add content if exists
    const content = post.content ? `${post.content}\n` : '';
    
    fs.writeFileSync(filepath, frontmatter + content, 'utf8');
    console.log(`  ✓ Created: ${filename}`);
  });
  
  console.log(`✅ Migrated ${newsData.posts.length} posts\n`);
}

// Migrate Slides
function migrateSlides() {
  console.log('🖼️  Migrating Slides...');
  const slidesData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/slides.json'), 'utf8'));
  const slidesDir = path.join(rootDir, 'src/keystatic/slides');

  clearDir(slidesDir);

  slidesData.slides.forEach((slide, index) => {
    const slugSource = slide.title || slide.id || `slide-${index + 1}`;
    const slug = createSlug(slugSource);
    const filename = `${slug}.yaml`;
    const filepath = path.join(slidesDir, filename);

    const data = {
      id: slide.id || `slide-${index + 1}`,
      type: slide.type || 'content',
      title: slide.title || '',
      slug: {
        name: slugSource,
        slug,
      },
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      buttonText: slide.buttonText || '',
      buttonLink: slide.buttonLink || '',
      backgroundImage: slide.backgroundImage || '',
      image: slide.image || null,
      order: slide.order || index + 1,
      active: slide.active !== false,
    };

    fs.writeFileSync(filepath, dump(data, { lineWidth: -1 }), 'utf8');
    console.log(`  ✓ Created: ${filename}`);
  });
  
  console.log(`✅ Migrated ${slidesData.slides.length} slides\n`);
}

// Migrate Site Content (Singleton)
function migrateSiteContent() {
  console.log('📄 Migrating Site Content...');
  const contentData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/content.json'), 'utf8'));
  const outputPath = path.join(contentDir, 'site-content.yaml');
  const legacyJsonPath = path.join(contentDir, 'site-content.json');

  const siteContent = contentData || {};

  if (fs.existsSync(legacyJsonPath)) {
    fs.unlinkSync(legacyJsonPath);
  }
  fs.writeFileSync(outputPath, dump(siteContent, { lineWidth: -1 }), 'utf8');
  console.log('  ✓ Created: site-content.yaml');
  console.log('✅ Migrated site content\n');
}

// Main migration function
function migrate() {
  console.log('🚀 Starting migration from JSON to Keystatic...\n');
  
  try {
    migrateCategories();
    migratePosts();
    migrateSlides();
    migrateSiteContent();
    
    console.log('✨ Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('  1. Check the migrated files in src/keystatic/');
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
