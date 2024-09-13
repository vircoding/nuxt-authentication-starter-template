import bcrypt from 'bcrypt'
import { UAParser } from 'ua-parser-js'
import type { User, VerificationCode } from '@prisma/client'
import prisma from '~/server/services/db'
import { ConflictError, CredentialsError, NotFoundError, VerificationTokenError, VerifiedError } from '../models/Error'

interface UserRegisterData {
  username: string
  email: string
  password: string
}

interface UserLoginData {
  email: string
  password: string
}

type UserAndVerificationCodeCreateResult = {
  verificationCode: VerificationCode
} & User

function createUserAndVerificationCode(userData: UserRegisterData) {
  userData.password = bcrypt.hashSync(userData.password, 10)

  return prisma.user.create({
    data: {
      ...userData,
      verificationCode: {
        create: { code: crypto.randomUUID() },
      },
    },
    include: {
      verificationCode: true,
    },
  })
}

export function registerUser(userData: UserRegisterData) {
  return prisma.$transaction(async (tx) => {
    const founded = await tx.user.findUnique({
      where: { email: userData.email },
      select: { verified: true },
    })

    if (founded) {
      if (founded.verified) {
        throw new ConflictError('User exists already')
      }
      else {
        const [_deleted, created] = await prisma.$transaction([
          prisma.user.delete({ where: { email: userData.email } }),
          createUserAndVerificationCode(userData),
        ])

        return created as UserAndVerificationCodeCreateResult
      }
    }

    const created = await createUserAndVerificationCode(userData)
    return created as UserAndVerificationCodeCreateResult
  })
}

export function verifyUser(id: string, code: string) {
  return prisma.$transaction(async (tx) => {
    // Find the user and the verification code
    const founded = await tx.user.findUniqueOrThrow({
      where: { id },
      select: {
        verified: true,
        verificationCode: {
          select: {
            code: true,
          },
        },
      },
    })

    // Validate if user its not yet verified
    if (founded.verified)
      throw new VerifiedError('This account is verified already')

    // Validate the verification code
    if (founded.verificationCode?.code !== code)
      throw new VerificationTokenError('Invalid verification token')

    // Update the user
    const updated = await prisma.user.update({
      where: { id },
      data: {
        verified: true,
        verificationCode: {
          delete: true,
        },
      },
      select: {
        username: true,
      },
    })

    return updated
  })
}

export function loginUser(userData: UserLoginData, ua: string | undefined) {
  return prisma.$transaction(async (tx) => {
    // Find the verified user by email
    const user = await tx.user.findUnique({
      where: { email: userData.email, verified: true },
    })

    if (!user)
      throw new CredentialsError('User not founded or wrong password')

    // Compare passwords
    const passwordMatch = await bcrypt.compare(userData.password, user.password)
    if (!passwordMatch)
      throw new CredentialsError('User not founded or wrong password')

    // Get and parse the user-agent
    const parsedUA = UAParser(ua)

    // Create the session
    const session = await prisma.session.create({
      data: {
        code: crypto.randomUUID(),
        browser: parsedUA.browser.name,
        os: parsedUA.os.name,
        cpu: parsedUA.cpu.architecture,
        userId: user.id,
      },
      select: {
        id: true,
        code: true,
        userId: true,
      },
    })

    return { user, session }
  })
}

export function resetVerificationCode(email: string) {
  return prisma.$transaction(async (tx) => {
    // Find the verified user by email
    const user = await tx.user.findUnique({
      where: { email },
      select: { id: true, username: true, email: true, verified: true },
    })

    if (!user)
      throw new NotFoundError('User not found')

    if (user.verified)
      throw new VerifiedError('This account is verified already')

    const verificationCode = await tx.verificationCode.update({
      where: { userId: user.id },
      data: { code: crypto.randomUUID() },
      select: { id: true, code: true, userId: true },
    })

    return { user, verificationCode }
  })
}

export async function findUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user)
    throw new NotFoundError('User not found')

  return user
}
