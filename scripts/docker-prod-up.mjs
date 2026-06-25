import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const envFile = process.env.ENV_FILE ?? join(rootDir, '.env.production')

const result = spawnSync(
  'docker',
  ['compose', '-f', 'docker/compose.prod.yml', '--env-file', envFile, 'up', '-d', '--build'],
  {
    cwd: rootDir,
    stdio: 'inherit',
  },
)

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 0)
