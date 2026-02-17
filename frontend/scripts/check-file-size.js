#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MAX_LINES = 500;
const SRC_DIR = path.join(__dirname, '../src');
const EXCLUDE_PATTERNS = [
  /src\/infrastructure\/api\/.*/,  // Generated API client
  /src\/app\/routeTree\.gen\.ts$/,  // Generated route tree
  /\.gen\.ts$/,  // All generated files
  /\.gen\.tsx$/,  // All generated TSX files
];

/**
 * Check if a file path should be excluded from the check
 * @param {string} filePath - The file path to check
 * @returns {boolean} - True if the file should be excluded
 */
function shouldExclude(filePath) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(relativePath));
}

/**
 * Count lines in a file
 * @param {string} filePath - The file path
 * @returns {number} - The number of lines in the file
 */
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
    return 0;
  }
}

/**
 * Recursively find all TypeScript/TSX files in a directory
 * @param {string} dir - The directory to search
 * @param {Array} fileList - The array to store file paths
 * @returns {Array} - The array of file paths
 */
function findTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Main function to check file sizes
 */
function main() {
  const files = findTypeScriptFiles(SRC_DIR);
  const violations = [];
  
  files.forEach(filePath => {
    if (shouldExclude(filePath)) {
      return;
    }
    
    const lineCount = countLines(filePath);
    
    if (lineCount > MAX_LINES) {
      violations.push({
        path: path.relative(path.join(__dirname, '..'), filePath),
        lines: lineCount,
        excess: lineCount - MAX_LINES
      });
    }
  });
  
  if (violations.length > 0) {
    console.error(`\n❌ File size limit exceeded (${MAX_LINES} lines max):\n`);
    
    violations.forEach(violation => {
      console.error(`  ${violation.path}: ${violation.lines} lines (${violation.excess} lines over limit)`);
    });
    
    console.error('\n💡 Consider splitting these files into smaller modules to improve maintainability.');
    process.exit(1);
  } else {
    console.log('✅ All files are within the size limit.');
    process.exit(0);
  }
}

// Run the script
main();
