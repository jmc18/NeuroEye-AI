import { admin } from './admin'
import { app } from './app'
import { auth } from './auth'
import { common } from './common'
import { errors } from './errors'
import { eyetracking } from './eyetracking'
import { home } from './home'
import { legal } from './legal'
import { patients } from './patients'
import { reports } from './reports'
import { shared } from './shared'

const es = {
  common,
  auth,
  home,
  app,
  legal,
  errors,
  shared,
  patients,
  eyetracking,
  reports,
  admin,
} as const

export default es

export type TranslationResources = typeof es
