import { spawnSync } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const maxAttempts = 45

function run(args, options = {}) {
  return spawnSync('docker', args, {
    cwd: rootDir,
    stdio: 'inherit',
    ...options,
  })
}

function isReady() {
  const postgres = spawnSync(
    'docker',
    ['exec', 'neuro-postgres', 'pg_isready', '-U', 'postgres', '-d', 'neuroeye'],
    { stdio: 'ignore' },
  )

  const redis = spawnSync('docker', ['exec', 'neuro-redis', 'redis-cli', 'ping'], {
    stdio: 'ignore',
  })

  return postgres.status === 0 && redis.status === 0
}

console.log('Stopping API container (free port 8000 for local debug)...')
run(['compose', 'stop', 'api'], { stdio: 'ignore' })

console.log('Starting Postgres + Redis...')
const up = run(['compose', 'up', '-d', 'postgres', 'redis'])

if (up.error) {
  console.error(up.error.message)
  process.exit(1)
}

if (up.status !== 0) {
  process.exit(up.status ?? 1)
}

console.log('Waiting for database and redis...')

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  if (isReady()) {
    console.log('Infra ready — you can debug the backend on http://localhost:8000')
    process.exit(0)
  }

  await sleep(2000)
}

console.error('Timeout: postgres/redis did not become healthy. Run: docker compose ps')
process.exit(1)
