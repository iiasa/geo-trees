#!/usr/bin/env node

import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

/**
 * Find unused TypeScript and TSX files in the project
 */
function findUnusedFiles() {
	console.log("🔍 Searching for unused files...\n");

	try {
		// Run knip to find unused files
		// Note: knip exits with non-zero code when unused files are found, which is expected
		let output = "";
		try {
			output = execSync("pnpm knip --no-progress", {
				cwd: projectRoot,
				encoding: "utf-8",
				stdio: "pipe",
			});
		} catch (error) {
			// Knip exits with non-zero when unused files are found - this is expected
			output = (error.stdout || error.stderr || "").toString();
		}

		// Parse the output to extract unused files
		const lines = output.split("\n");
		const unusedFiles = [];
		let inUnusedFilesSection = false;

		for (const line of lines) {
			if (line.includes("Unused files")) {
				inUnusedFilesSection = true;
				continue;
			}

			if (inUnusedFilesSection) {
				// Stop when we hit the next section or empty line followed by non-empty line
				if (
					line.includes("Unused dependencies") ||
					line.includes("Unused exports") ||
					line.includes("Unused exported types") ||
					line.includes("Duplicate exports") ||
					line.includes("Configuration hints")
				) {
					break;
				}

				// Extract file paths (they start with "src/")
				// Match lines that contain src/...ts or src/...tsx
				const trimmedLine = line.trim();
				const match = trimmedLine.match(/^(src\/[^\s]+\.(ts|tsx))$/);
				if (match) {
					unusedFiles.push(match[1]);
				}
			}
		}

		if (unusedFiles.length === 0) {
			console.log("✅ No unused files found!\n");
			return;
		}

		console.log(`📋 Found ${unusedFiles.length} potentially unused files:\n`);
		unusedFiles.forEach((file) => {
			console.log(`  - ${file}`);
		});

		console.log("\n⚠️  Note: Some files may be false positives.");
		console.log("   Please review each file before deleting.\n");
		console.log("   Common false positives:");
		console.log("   - Route files used by TanStack Router");
		console.log("   - UI components used dynamically");
		console.log("   - Generated files (already ignored)");
		console.log("   - shadcn/ui components (already ignored)\n");

		// Return the list for potential automation
		return unusedFiles;
	} catch (error) {
		console.error("❌ Error running knip:", error.message);
		if (error.stdout) {
			console.error("\nKnip output:", error.stdout);
		}
		if (error.stderr) {
			console.error("\nKnip errors:", error.stderr);
		}
		process.exit(1);
	}
}

// Run the script
findUnusedFiles();

