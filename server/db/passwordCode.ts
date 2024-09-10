import { prisma } from '.'

export function upsertPasswordCode(data: { userId: string }) {
  const code = (Math.floor(Math.random() * 900000) + 100000).toString()

  return prisma.passwordCode.upsert({
    where: { userId: data.userId },
    update: { code },
    create: { code, userId: data.userId },
  })
}

export function findPasswordCodeByUserId(userId: string) {
  return prisma.passwordCode.findUniqueOrThrow({ where: { userId } })
}

export function deletePasswordCodeById(id: string) {
  return prisma.passwordCode.delete({ where: { id } })
}
