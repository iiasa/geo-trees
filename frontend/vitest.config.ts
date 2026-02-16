import { defineConfig } from 'vitest/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test-utils/setup.ts'],
		include: ['**/*.{test,spec}.{ts,tsx}'],
		exclude: ['node_modules', 'dist', '.output', 'e2e/'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov', 'json'],
			thresholds: {
				global: {
					statements: 70,
					branches: 65,
					functions: 70,
					lines: 70,
				},
			},
			exclude: [
				'node_modules/',
				'dist/',
				'.output/',
				'coverage/',
				'**/*.d.ts',
				'**/*.config.{ts,js}',
				'**/hey-api.ts',
				'**/routeTree.gen.ts',
				'**/types.gen.ts',
				'**/zod.gen.ts',
				'**/client.gen.ts',
				'**/*.gen.ts',
				'**/*.gen.tsx',
				'e2e/',
				'src/test-utils/',
				'src/logo.svg',
			],
		},
		globals: true,
		globalSetup: './src/test-utils/global-setup.ts',
	},
	plugins: [
		viteTsConfigPaths({
			projects: ['./tsconfig.json'],
		}),
	],
})
