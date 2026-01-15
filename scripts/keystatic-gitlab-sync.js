#!/usr/bin/env node

/**
 * Script to automatically commit and push Keystatic content changes to GitLab
 * This script watches for changes in src/content/ and automatically commits/pushes them
 */

import { execSync } from 'child_process';
import chokidar from 'chokidar';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const contentDir = join(projectRoot, 'src', 'content');

let commitTimeout = null;
const DEBOUNCE_MS = 2000; // Wait 2 seconds after last change before committing

function commitAndPush() {
  try {
    console.log('📝 Detecting changes in content...');
    
    // Check if there are changes
    const status = execSync('git status --porcelain src/content/', { 
      cwd: projectRoot,
      encoding: 'utf-8' 
    });

    if (!status.trim()) {
      console.log('✅ No changes detected');
      return;
    }

    console.log('💾 Committing changes...');
    
    // Add all content files
    execSync('git add src/content/', { 
      cwd: projectRoot,
      stdio: 'inherit' 
    });

    // Create commit with timestamp
    const timestamp = new Date().toISOString();
    const commitMessage = `chore: update content via Keystatic CMS - ${timestamp}`;
    
    execSync(`git commit -m "${commitMessage}"`, { 
      cwd: projectRoot,
      stdio: 'inherit' 
    });

    console.log('🚀 Pushing to GitLab...');
    
    // Push to GitLab
    execSync('git push origin main', { 
      cwd: projectRoot,
      stdio: 'inherit' 
    });

    console.log('✅ Successfully pushed to GitLab!');
  } catch (error) {
    console.error('❌ Error committing/pushing:', error.message);
  }
}

function debouncedCommit() {
  if (commitTimeout) {
    clearTimeout(commitTimeout);
  }
  
  commitTimeout = setTimeout(() => {
    commitAndPush();
  }, DEBOUNCE_MS);
}

console.log('👀 Watching for content changes in:', contentDir);
console.log('📦 Changes will be automatically committed and pushed to GitLab');
console.log('Press Ctrl+C to stop watching\n');

// Watch the content directory recursively
const watcher = chokidar.watch(contentDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
});

watcher
  .on('add', (path) => {
    console.log(`📝 File added: ${path}`);
    debouncedCommit();
  })
  .on('change', (path) => {
    console.log(`📝 File changed: ${path}`);
    debouncedCommit();
  })
  .on('unlink', (path) => {
    console.log(`📝 File deleted: ${path}`);
    debouncedCommit();
  });
