import { Prisma } from '@prisma/client'
import { H3Error } from 'h3'
import { z } from 'zod'
import { findUserNotVerifiedById } from '~/server/db/user'
import { updateVerificationCodeByUserId } from '~/server/db/verificationCode'

export default defineEventHandler(async (event) => {
  try {
    // Get the userId
    let userId = event.context.userId

    // Validate the userId
    userId = await z.string().parseAsync(userId)

    // Check if the user is verified
    const user = await findUserNotVerifiedById(userId)

    // Update the verification code
    const verificationCode = await updateVerificationCodeByUserId(user.id)

    try {
      // Generate the verification token
      const verificationToken = generateVerificationToken({
        code: verificationCode.code,
        verificationCodeId: verificationCode.id,
        userId: user.id,
      })

      // Get the verification email
      const verificationEmailContent = await getVerificationEmail(user.username, verificationToken)

      // Send the verificaion email
      sendVerificationEmail(user.email, verificationEmailContent)
    }
    catch (error) {
      console.error('An error has ocurred while sending the confirmation email', error)
    }

    // Send the success response
    return { ok: true }
  }
  catch (error) {
    // Prisma Error handler
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.message === 'No User found') {
      throw createError({
        status: 404,
        statusMessage: 'Not Found',
        message: 'User not found',
      })
    }

    // H3 Error handler
    if (error instanceof H3Error) {
      throw error
    }

    // Unhandled Error
    throw createError({
      status: 500,
      statusMessage: 'Internal Server Error',
      message: 'An unexpected error ocurred',
    })
  }
})
