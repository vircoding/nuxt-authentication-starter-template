import bcrypt from 'bcrypt'
import { prisma } from '.'

export function createUser(data: { username: string, email: string, password: string }) {
  const hashPassword = bcrypt.hashSync(data.password, 10)
  const verificationCode = crypto.randomUUID()

  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashPassword,
      verificationCode,
    },
  }) // throws P2002 if email already exists
}

function findUserNotVerifiedById(id: string) {
  return prisma.user.findUniqueOrThrow({
    where: {
      id,
      verified: false,
    },
  })
}

export function deleteUserById(id: string) {
  return new Promise((resolve, reject) => {
    prisma.refreshToken
      .deleteMany({
        where: {
          uid: id,
        },
      })
      .then(async () => {
        await prisma.user
          .delete({
            where: { id },
          })
          .catch((error) => {
            reject(error)
          })
      })
      .catch((error) => {
        reject(error)
      })

    resolve(true)
  })
}

export function deleteUserByIdIfNotVerified(id: string, timeout: number) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      await findUserNotVerifiedById(id)
        .then(async () => {
          await deleteUserById(id)
            .then(() => {
              resolve(true)
            })
            .catch((error) => {
              reject(error)
            })
        })
        .catch((error) => {
          if (error.message === 'No User found')
            resolve(true)
          reject(error)
        })
    }, timeout)
  })
};

export function findUserById(id: string) {
  return prisma.user.findUniqueOrThrow({ where: { id } }) // throws P2025 if not found
}

export function verifyUser(id: string) {
  return prisma.user.update({
    where: { id },
    data: {
      verified: true,
      verificationCode: null,
    },
  })
}

export function findUserByEmail(email: string) {
  return prisma.user.findUniqueOrThrow({ where: { email } }) // throws P2025 if not found
}
