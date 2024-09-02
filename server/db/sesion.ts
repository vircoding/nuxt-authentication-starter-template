import { prisma } from '.'

export function createSession(data: { userId: string, browser?: string, os?: string, cpu?: string }) {
  const code = crypto.randomUUID()
  return prisma.session.create({
    data: {
      code,
      browser: data.browser,
      os: data.os,
      cpu: data.cpu,
      userId: data.userId,
    },
  })
}
