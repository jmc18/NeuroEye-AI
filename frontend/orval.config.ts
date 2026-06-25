import { defineConfig } from 'orval'

export default defineConfig({
  neuroeye: {
    input: {
      target: './src/api/openapi/openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/models',
      client: 'axios-functions',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './src/api/http/axios.ts',
          name: 'customInstance',
        },
        operationName: (operation) => operation.operationId,
      },
    },
  },
})
