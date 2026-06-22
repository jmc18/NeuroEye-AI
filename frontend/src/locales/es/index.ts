import { app } from './app'
import { auth } from './auth'
import { common } from './common'
import { errors } from './errors'
import { home } from './home'
import { legal } from './legal'
import { shared } from './shared'

const es = {
  common,
  auth,
  home,
  app,
  legal,
  errors,
  shared,
} as const

export default es

export type TranslationResources = typeof es
