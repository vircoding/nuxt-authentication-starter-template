import bcrypt from 'bcrypt'
import { prisma } from '.'

export function createUser(data: { username: string, email: string, password: string }) {
  const hashPassword = bcrypt.hashSync(data.password, 10)

  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashPassword,
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
  return new Promise<true>((resolve, reject) => {
    // Delete user sessions
    prisma.session.deleteMany({ where: { userId: id } }).then(() => {
      // Delete user verification code
      prisma.verificationCode.delete({ where: { userId: id } }).then(() => {
        // Delete user
        prisma.user.delete({ where: { id } }).then(() => resolve(true)).catch(error => reject(error))
      }).catch(error => reject(error))
    }).catch(error => reject(error))
  })
}

export function deleteUserByIdIfNotVerified(id: string, timeout: number) {
  return new Promise<true>((resolve, reject) => {
    setTimeout(async () => {
      // Find the user by id if its not verified
      await findUserNotVerifiedById(id)
        .then(() => {
          // Delete the user
          deleteUserById(id)
            .then(() => resolve(true))
            .catch(error => reject(error))
        })
        .catch((error) => {
          reject(error)
        })
    }, timeout)
  })
}

export function findUserById(id: string) {
  return prisma.user.findUniqueOrThrow({ where: { id } }) // throws P2025 if not found
}

export function verifyUser(id: string) {
  return prisma.user.update({
    where: { id },
    data: {
      verified: true,
    },
  })
}

export function findUserByEmail(email: string) {
  return prisma.user.findUniqueOrThrow({ where: { email } }) // throws P2025 if not found
}
