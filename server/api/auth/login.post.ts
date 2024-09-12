import { Prisma } from '@prisma/client'
import { H3Error } from 'h3'
import { ZodError } from 'zod'
import { loginSchema } from '~/schemas/user.schema'
import { BodyError, CredentialsError } from '~/server/models/Error'
import { loginUser, verifyUser } from '~/server/services/auth'

export default defineEventHandler(async (event) => {
  try {
    // Read the body of the request
    const input = await readBody(event)

    // Validate the body
    if (!input)
      throw new BodyError('Body is missing')

    // Validate the input
    const data = await loginSchema.parseAsync(input)

    // Get the user-agent
    const ua = getHeader(event, 'user-agent')

    // Login the user
    const { user, session } = await loginUser(data, ua)

    // Generate the refresh token
    const refreshToken = generateRefreshToken({ code: session.code, id: session.id, userId: session.userId })

    // Generate the access token
    const accessToken = generateAccessToken({ id: session.userId })

    // Send the refresh token
    setCookie(event, 'refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: true,
    })

    return {
      access_token: accessToken,
      user: userTransformer(user),
    }
  }
  catch (error) {
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

    // Bad Credentials Error handler
    if (error instanceof CredentialsError) {
      throw createError({
        status: 401,
        statusMessage: 'Unauthorized',
        message: 'Bad Credentials',
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
