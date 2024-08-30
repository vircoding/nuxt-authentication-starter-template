import fs from 'node:fs'
import { join } from 'node:path'
import handlebars from 'handlebars'

const DIR = 'server/templates'

export async function getVerificationEmail(username: string, verificationToken: string) {
  const file = fs.readFileSync(join(DIR, 'verificationEmail.hbs'))
  const template = handlebars.compile(file.toString())
  return template({ username, verificationToken })
}

export async function getVerificationSuccess(username: string) {
  const file = fs.readFileSync(join(DIR, 'verificationSuccess.hbs'))
  const template = handlebars.compile(file.toString())
  return template({ username })
}

export async function getVerificationIsVerified() {
  const file = fs.readFileSync(join(DIR, 'verificationIsVerified.hbs'))
  const template = handlebars.compile(file.toString())
  return template({})
}

export async function getVerificationFailed() {
  const file = fs.readFileSync(join(DIR, 'verificationFailed.hbs'))
  const template = handlebars.compile(file.toString())
  return template({})
}
