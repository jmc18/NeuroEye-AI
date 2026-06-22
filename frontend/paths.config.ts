import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export type PathAliasName =
  | '@'
  | '@app'
  | '@features'
  | '@components'
  | '@lib'
  | '@hooks'
  | '@types'
  | '@assets'
  | '@config'
  | '@locales'
  | '@store'

type PathAlias = {
  name: PathAliasName
  /** Directory relative to project root */
  dir: string
}

/**
 * Single source of truth for import aliases.
 * Keep `tsconfig.app.json` paths in sync when adding or changing entries.
 */
export const PATH_ALIASES = [
  { name: '@', dir: 'src' },
  { name: '@app', dir: 'src/app' },
  { name: '@features', dir: 'src/features' },
  { name: '@components', dir: 'src/components' },
  { name: '@lib', dir: 'src/lib' },
  { name: '@hooks', dir: 'src/hooks' },
  { name: '@types', dir: 'src/types' },
  { name: '@assets', dir: 'src/assets' },
  { name: '@config', dir: 'src/config' },
  { name: '@locales', dir: 'src/locales' },
  { name: '@store', dir: 'src/store' },
] as const satisfies readonly PathAlias[]

export function resolveViteAliases(): Record<string, string> {
  const aliases = Object.fromEntries(
    PATH_ALIASES.map(({ name, dir }) => [name, path.resolve(rootDir, dir)]),
  )

  // Bare import: `import { ROUTES } from '@config'`
  aliases['@config'] = path.resolve(rootDir, 'src/config/index.ts')
  aliases['@store'] = path.resolve(rootDir, 'src/store/index.ts')

  return aliases
}

/**
 * Paths object for tsconfig `compilerOptions.paths`.
 * Used as reference — values are written into tsconfig.app.json.
 */
export const TSCONFIG_PATHS: Record<string, string[]> = Object.fromEntries(
  PATH_ALIASES.map(({ name, dir }) => [`${name}/*`, [`./${dir}/*`]]),
)
