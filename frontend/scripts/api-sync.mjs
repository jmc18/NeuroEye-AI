import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const node = process.execPath
const dev = process.argv.includes('--dev')

if (dev) {
  process.env.VITE_API_URL = 'http://localhost:8000'
}

function runStep(label, scriptPath, args = []) {
  console.log(`\n> ${label}`)
  const result = spawnSync(node, [scriptPath, ...args], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

runStep('fetch OpenAPI snapshot', join('scripts', 'fetch-openapi.mjs'))
runStep('generate Orval client', join('node_modules', 'orval', 'dist', 'bin', 'orval.mjs'))

console.log('\nAPI sync complete.')
