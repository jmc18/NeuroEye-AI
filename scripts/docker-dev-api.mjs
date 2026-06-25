import { spawn, spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')

function runSync(args) {
  const result = spawnSync('docker', args, {
    cwd: rootDir,
    stdio: 'inherit',
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

runSync(['compose', 'up', '--build', '-d', 'api'])

console.log('\nFollowing API logs (Ctrl+C to stop)...\n')

const logs = spawn('docker', ['compose', 'logs', '-f', 'api'], {
  cwd: rootDir,
  stdio: 'inherit',
})

logs.on('exit', (code) => {
  process.exit(code ?? 0)
})
