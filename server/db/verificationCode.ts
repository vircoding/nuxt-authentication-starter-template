import { prisma } from '.'

export function createVerificationCode(data: { userId: string }) {
  const code = crypto.randomUUID()

  return prisma.verificationCode.create({
    data: {
      code,
      userId: data.userId,
    },
  })
}

export function findVerificationCodeById(id: string) {
  return prisma.verificationCode.findUniqueOrThrow({ where: { id } }) // throws P2025 if not found
}

export function deleteVerificationCodeById(id: string) {
  return new Promise<true>((resolve, reject) => {
    prisma.verificationCode.delete({ where: { id } })
      .then(() => resolve(true))
      .catch(error => reject(error))
  })
}
