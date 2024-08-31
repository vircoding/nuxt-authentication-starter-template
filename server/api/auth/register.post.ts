import { H3Error } from 'h3'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { registerSchema } from '~/schemas/user.schema'
import { createUser, deleteUserById, deleteUserByIdIfNotVerified } from '~/server/db/user'
import { createRefreshToken } from '~/server/db/refreshToken'

export default defineEventHandler(async (event) => {
  let userId: null | string = null

  try {
    // Read the body of the request
    const { username, email, password, repassword } = await readBody(event)

    // Validate the input
    const data = await registerSchema.parseAsync({ username, email, password, repassword })

    // Create the new user
    const user = await createUser(data)
    userId = user.id

    // Generate the refresh token
    const refreshToken = generateRefreshToken({ uid: user.id })

    // Create the refresh token
    await createRefreshToken({ token: refreshToken, uid: user.id })

    // Generate the access token
    const accessToken = generateAccessToken({ uid: user.id })

    try {
      // Generate the verification token
      const verificationToken = generateVerificationToken({
        uid: user.id,
        verificationCode: user.verificationCode as string,
      })

      // Get the verification email
      const verificationEmailContent = await getVerificationEmail(user.username, verificationToken)

      // Send the verificaion email
      await sendConfirmationEmail(user.email, verificationEmailContent)
    }
    catch (error) {
      console.error('An error has ocurred while sending the confirmation email', error)
    }

    try {
      // Delete the user if its not verified after 6 minutes
      deleteUserByIdIfNotVerified(user.id, 360000)
    }
    catch (error) {
      console.error('An erros has ocurred while deleting the unverified user', error)
    }

    // Send the refresh token
    setCookie(event, 'refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: true,
    })

    // Send the success response
    return {
      access_token: accessToken,
      user: userTransformer(user),
    }
  }
  catch (error) {
    // Delete the user if it was created before
    if (userId) {
      try {
        await deleteUserById(userId)
      }
      catch (error) {
        console.error('An error has ocuured while deleting the previously created user', error)
      }
    }

    // Zod Error handler
    if (error instanceof ZodError) {
      const fields = error.errors.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))

      throw createError({
        status: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid or missing required parameters',
        data: {
          fields,
        },
      })
    }

    // Prisma Error handler
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      if (error.meta && error.meta.modelName === 'User') {
        throw createError({
          status: 409,
          statusMessage: 'Conflict',
          message: 'User exists already',
        })
      }
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
