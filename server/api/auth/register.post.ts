import { Prisma } from '@prisma/client'
import { H3Error } from 'h3'
import { UAParser } from 'ua-parser-js'
import { ZodError } from 'zod'
import { registerSchema } from '~/schemas/user.schema'
import { createSession } from '~/server/db/sesion'
import { createUser, deleteUserById, deleteUserByIdIfNotVerified } from '~/server/db/user'
import { createVerificationCode } from '~/server/db/verificationCode'
import { BodyError } from '~/server/models/Error'

export default defineEventHandler(async (event) => {
  let createdUserId: null | string = null

  try {
    // Read the body of the request
    const input = await readBody(event)

    // Validate the body
    if (!input)
      throw new BodyError('Body is missing')

    // Validate the input
    const data = await registerSchema.parseAsync(input)

    // Create the new user
    const user = await createUser(data)
    createdUserId = user.id

    // Get and parse the user-agent
    const ua = getHeader(event, 'user-agent')
    const parsedUA = UAParser(ua)

    // Create the session
    const session = await createSession({
      userId: user.id,
      browser: parsedUA.browser.name,
      os: parsedUA.os.name,
      cpu: parsedUA.cpu.architecture,
    })

    // Create the verfication code
    const verificationCode = await createVerificationCode({ userId: user.id })

    // Generate the refresh token
    const refreshToken = generateRefreshToken({ code: session.code, sessionId: session.id, userId: user.id })

    // Generate the access token
    const accessToken = generateAccessToken({ userId: user.id })

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
      console.error('An error has ocurred while deleting the unverified user', error)
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
    if (createdUserId) {
      try {
        await deleteUserById(createdUserId)
      }
      catch (error) {
        console.error('An error has ocuured while deleting the previously created user', error)
      }
    }

    // Body Error
    if (error instanceof BodyError) {
      throw createError({
        status: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid JSON body',
      })
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
