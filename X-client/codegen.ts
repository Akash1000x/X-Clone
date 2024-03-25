import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
   schema: 'http://localhost:8000/graphql',
   documents: ['src/**/*.{tsx,ts}'],
   generates: {
      './src/gql/': {
        preset: 'client',
      }
   }
}
export default config;