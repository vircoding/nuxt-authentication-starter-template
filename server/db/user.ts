import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import { prisma } from '.'
import { ConflictError } from '../models/Error'

// export function createUser(data: { username: string, email: string, password: string }) {
//   const hashPassword = bcrypt.hashSync(data.password, 10)

//   return prisma.user.create({
//     data: {
//       username: data.username,
//       email: data.email,
//       password: hashPassword,
//     },
//   }) // throws P2002 if email already exists
// }

export async function createUser(data: { username: string, email: string, password: string }) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } })

  if (existingUser) {
    console.info('Hereeee')
    if (existingUser.verified) {
      console.info('Verified')
      throw new ConflictError('Verified user exists already')
    }
    else {
      console.info('Not verified')
      await prisma.user.delete({ where: { id: existingUser.id } })
    }
  }

  const hash = bcrypt.hashSync(data.password, 10)
  return prisma.user.create({ data: { username: data.username, email: data.email, password: hash } })
}

export function findUserNotVerifiedById(id: string) {
  return prisma.user.findUniqueOrThrow({
    where: {
      id,
      verified: false,
    },
  })
}

export async function deleteUserById(id: string) {
  await prisma.passwordCode.delete({ where: { userId: id } })
  await prisma.session.deleteMany({ where: { userId: id } })
  await prisma.verificationCode.delete({ where: { userId: id } })
  await prisma.user.delete({ where: { id } })
}

export function deleteUserById2(id: string) {
  return new Promise<true>((resolve, reject) => {
    // Delete user sessions
    prisma.session.deleteMany({ where: { userId: id } }).then(() => {
      // Delete user verification code
      prisma.verificationCode.delete({ where: { userId: id } }).then(() => {
        // Delete user
        prisma.user.delete({ where: { id } }).then(() => resolve(true)).catch(error => reject(error))
      }).catch(error => reject(error))
    }).catch((error) => {
      console.info(error)
      reject(error)
    })
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

export function updateUserById(id: string, data: { username: string }) {
  return prisma.user.update({
    where: { id },
    data: { username: data.username },
  })
}

export function setPasswordPendingById(id: string) {
  return prisma.user.update({ where: { id }, data: { passwordPending: true } })
}

export function unsetPasswordPendingByIdTimeout(id: string, timeout: number) {
  return new Promise<true>((resolve, reject) => {
    setTimeout(async () => {
      await prisma.user.update({
        where: { id },
        data: { passwordPending: { unset: true } },
      }).then(() => resolve(true)).catch(error => reject(error))
    }, timeout)
  })
}

export function findUserWithPasswordPendingByEmail(email: string) {
  return prisma.user.findFirstOrThrow({ where: { email, passwordPending: true } })
}

export function resetPasswordById(id: string, data: { password: string }) {
  const hashPassword = bcrypt.hashSync(data.password, 10)

  return prisma.user.update({
    where: { id },
    data: { password: hashPassword, passwordPending: { unset: true } },
  })
}
