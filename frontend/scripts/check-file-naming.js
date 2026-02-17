#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SRC_DIR = path.join(__dirname, '../src');

// Patterns to exclude from naming checks
const EXCLUDE_PATTERNS = [
	/src\/infrastructure\/api\/.*/, // Generated API client
	/src\/routeTree\.gen\.ts$/, // Generated route tree
	/\.gen\.ts$/, // All generated files
	/\.gen\.tsx$/, // All generated TSX files
];

// Special route file names allowed (TanStack Router conventions)
const ALLOWED_ROUTE_NAMES = [
	'__root.tsx',
	'__root.ts',
	'index.tsx',
	'index.ts',
];

// Route files can have dots (e.g., auth.login.ts, api.health.ts)
const ROUTE_DIRS = [
	'src/routes',
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
 * Check if a file is in a route directory
 * @param {string} filePath - The file path to check
 * @returns {boolean} - True if the file is in a route directory
 */
function isRouteFile(filePath) {
	const relativePath = path.relative(path.join(__dirname, '..'), filePath);
	return ROUTE_DIRS.some(dir => relativePath.startsWith(dir));
}

/**
 * Check if a route file name is allowed (special names or has dots)
 * @param {string} fileName - The file name to check
 * @returns {boolean} - True if the file name is allowed
 */
function isAllowedRouteFileName(fileName) {
	// Check if it's a special route name
	if (ALLOWED_ROUTE_NAMES.includes(fileName)) {
		return true;
	}
	
	// Route files can have dots (TanStack Router convention)
	// e.g., auth.login.ts, api.health.ts, api.proxy.$.ts
	if (fileName.includes('.')) {
		return true;
	}
	
	return false;
}

/**
 * Check if a file name follows kebab-case convention
 * @param {string} fileName - The file name (without extension)
 * @returns {boolean} - True if the file name is kebab-case
 */
function isKebabCase(fileName) {
	// kebab-case: lowercase letters, numbers, and hyphens only
	// Must start with a letter
	// Cannot have consecutive hyphens
	// Cannot end with a hyphen
	return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(fileName);
}

/**
 * Check if a file name is PascalCase
 * @param {string} fileName - The file name (without extension)
 * @returns {boolean} - True if the file name is PascalCase
 */
function isPascalCase(fileName) {
	// PascalCase: starts with uppercase letter, followed by camelCase
	return /^[A-Z][a-zA-Z0-9]*$/.test(fileName);
}

/**
 * Get file naming rules based on file type and location
 * @param {string} filePath - The file path
 * @param {string} fileName - The file name
 * @returns {object} - Rules object with expectedCase and allowedExtensions
 */
function getNamingRules(filePath, fileName) {
	const relativePath = path.relative(path.join(__dirname, '..'), filePath);
	let baseName = path.basename(fileName, path.extname(fileName));

	// Strip .test suffix for test files
	if (baseName.endsWith('.test')) {
		baseName = baseName.slice(0, -5); // Remove '.test'
	}

	const ext = path.extname(fileName);
	
	// Route files have special rules
	if (isRouteFile(filePath)) {
		return {
			expectedCase: 'any', // Routes can have dots and special names
			allowedExtensions: ['.ts', '.tsx'],
			isAllowed: isAllowedRouteFileName(fileName),
		};
	}
	
	// Hook files: kebab-case, .ts extension (or .tsx if contains JSX)
	if (relativePath.includes('/hooks/')) {
		return {
			expectedCase: 'kebab-case',
			allowedExtensions: ['.ts', '.tsx'],
			isAllowed: (ext === '.ts' || ext === '.tsx') && isKebabCase(baseName),
		};
	}
	
	// Component files: kebab-case, .tsx extension
	// Exception: index.ts and types.ts files are allowed in component directories
	if (relativePath.includes('/components/')) {
		if (fileName === 'index.ts' || fileName === 'types.ts') {
			return {
				expectedCase: 'kebab-case',
				allowedExtensions: ['.ts'],
				isAllowed: true,
			};
		}
		return {
			expectedCase: 'kebab-case',
			allowedExtensions: ['.tsx'],
			isAllowed: ext === '.tsx' && isKebabCase(baseName),
		};
	}
	
	// Store files: kebab-case, .ts extension
	if (relativePath.includes('/stores/')) {
		return {
			expectedCase: 'kebab-case',
			allowedExtensions: ['.ts'],
			isAllowed: ext === '.ts' && isKebabCase(baseName),
		};
	}
	
	// Constants files: always named constants.ts
	if (fileName === 'constants.ts') {
		return {
			expectedCase: 'constants',
			allowedExtensions: ['.ts'],
			isAllowed: true,
		};
	}
	
	// Utility files: kebab-case, .ts extension
	if (relativePath.includes('/utils/')) {
		return {
			expectedCase: 'kebab-case',
			allowedExtensions: ['.ts'],
			isAllowed: ext === '.ts' && isKebabCase(baseName),
		};
	}
	
	// Data files: kebab-case with dots allowed, .ts extension
	if (relativePath.includes('/data/')) {
		return {
			expectedCase: 'kebab-case',
			allowedExtensions: ['.ts'],
			isAllowed: ext === '.ts' && (isKebabCase(baseName) || baseName.includes('.')),
		};
	}
	
	// Default: kebab-case for .ts files, kebab-case for .tsx files
	return {
		expectedCase: 'kebab-case',
		allowedExtensions: ['.ts', '.tsx'],
		isAllowed: (ext === '.ts' || ext === '.tsx') && isKebabCase(baseName),
	};
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
 * Main function to check file naming
 */
function main() {
	const files = findTypeScriptFiles(SRC_DIR);
	const violations = [];
	
	files.forEach(filePath => {
		if (shouldExclude(filePath)) {
			return;
		}
		
		const fileName = path.basename(filePath);
		const relativePath = path.relative(path.join(__dirname, '..'), filePath);
		const rules = getNamingRules(filePath, fileName);
		
		if (!rules.isAllowed) {
			const baseName = path.basename(fileName, path.extname(fileName));
			const ext = path.extname(fileName);
			const isPascal = isPascalCase(baseName);
			
			let issue = '';
			if (rules.expectedCase === 'kebab-case' && isPascal) {
				issue = `PascalCase (should be kebab-case)`;
			} else if (rules.expectedCase === 'kebab-case' && !isKebabCase(baseName)) {
				issue = `Invalid naming (should be kebab-case)`;
			} else if (!rules.allowedExtensions.includes(ext)) {
				issue = `Wrong extension (should be ${rules.allowedExtensions.join(' or ')})`;
			} else {
				issue = `Does not match naming convention`;
			}
			
			violations.push({
				path: relativePath,
				fileName,
				issue,
				expected: rules.expectedCase,
			});
		}
	});
	
	if (violations.length > 0) {
		console.error(`\n❌ File naming convention violations:\n`);
		
		violations.forEach(violation => {
			console.error(`  ${violation.path}`);
			console.error(`    Issue: ${violation.issue}`);
			console.error(`    Expected: ${violation.expected}`);
			console.error('');
		});
		
		console.error('💡 File naming conventions:');
		console.error('   - Components: kebab-case.tsx (e.g., user-form.tsx)');
		console.error('   - Hooks: kebab-case.ts (e.g., use-auth.ts)');
		console.error('   - Stores: kebab-case.ts (e.g., user-store.ts)');
		console.error('   - Utils: kebab-case.ts (e.g., format-date.ts)');
		console.error('   - Routes: kebab-case with dots allowed (e.g., auth.login.ts)');
		console.error('   - Constants: always constants.ts');
		console.error('');
		
		process.exit(1);
	} else {
		console.log('✅ All files follow naming conventions.');
		process.exit(0);
	}
}

// Run the script
main();

