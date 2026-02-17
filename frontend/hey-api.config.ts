import { defineConfig } from '@hey-api/openapi-ts';

/**
 * Hey API configuration for generating TypeScript SDK client
 * from ABP API OpenAPI specification.
 *
 * Run with: pnpm generate-api
 */
export default defineConfig({
  // Input OpenAPI specification URL
  input: process.env.VITE_OPENAPI_SPEC_URL || 'https://localhost:44324/swagger/v1/swagger.json',

  // Output configuration
  output: {
    path: 'src/infrastructure/api',
    clean: true, // Clean output directory before generating
  },

  // Use fetch client (default)
  client: 'fetch',

  // Plugins
  plugins: [
    {
      name: '@hey-api/client-fetch',
      runtimeConfigPath: '../../hey-api',
    },
    // Zod validation schemas
    {
      name: 'zod',
      types: {
        infer: true, // Generate z.infer types for better TypeScript support
      },
    },
    // TanStack Query integration
    {
      name: '@tanstack/react-query',
      queryOptions: true, // Generate query options functions
      queryKeys: true, // Generate query key functions
      mutationOptions: true, // Generate mutation options functions
    },
  ],
});
