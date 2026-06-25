import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:8000'
const outputPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'api',
  'openapi',
  'openapi.json',
)

const response = await fetch(`${apiUrl}/openapi.json`)

if (!response.ok) {
  console.error(
    `Failed to fetch OpenAPI schema from ${apiUrl}/openapi.json (${response.status})`,
  )
  console.error('Start the backend first: python -m uvicorn app.main:app --reload')
  process.exit(1)
}

const schema = await response.json()
await writeFile(outputPath, `${JSON.stringify(schema, null, 2)}\n`, 'utf8')

console.log(`OpenAPI schema saved to ${outputPath}`)
