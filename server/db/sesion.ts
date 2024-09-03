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

export function findSessionById(id: string) {
  return prisma.session.findUniqueOrThrow({ where: { id } }) // throws P2025 if not found
}

export function updateSessionCode(id: string) {
  const code = crypto.randomUUID()

  return prisma.session.update({
    where: { id },
    data: { code },
  })
}
