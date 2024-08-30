import { prisma } from '.'

export function createRefreshToken(data: { token: string, uid: string }) {
  return prisma.refreshToken.create({ data }) // throws P2002 if token already exists
}
