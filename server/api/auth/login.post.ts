import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import { H3Error } from 'h3'
import { UAParser } from 'ua-parser-js'
import { ZodError } from 'zod'
import { loginSchema } from '~/schemas/user.schema'
import { createSession } from '~/server/db/sesion'
import { findUserByEmail } from '~/server/db/user'
import { BodyError, PasswordError } from '~/server/models/Error'

export default defineEventHandler(async (event) => {
  try {
    // Read the body of the request
    const input = await readBody(event)

    // Validate the body
    if (!input)
      throw new BodyError('Body is missing')

    // Validate the input
    const data = await loginSchema.parseAsync(input)

    // Find the user by email
    const user = await findUserByEmail(data.email)

    // Validate the passwords
    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch)
      throw new PasswordError('Password do not match')

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

    // Generate the refresh token
    const refreshToken = generateRefreshToken({ code: session.code, sessionId: session.id, userId: user.id })

    // Generate the access token
    const accessToken = generateAccessToken({ userId: user.id })

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
    if (
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
      || error instanceof PasswordError
    ) {
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
