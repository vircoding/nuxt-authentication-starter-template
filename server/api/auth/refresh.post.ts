import { Prisma } from '@prisma/client'
import { H3Error } from 'h3'
import jwt from 'jsonwebtoken'
import { ZodError } from 'zod'
import { decodedRefreshTokenSchema, refreshTokenSchema } from '~/schemas/token.schema'
import { findSessionById, updateSessionCode } from '~/server/db/session'
import { findUserById } from '~/server/db/user'
import { RefreshTokenError } from '~/server/models/Error'

export default defineEventHandler(async (event) => {
  try {
    // Get the refresh token
    let refreshToken = getCookie(event, 'refresh_token')

    // Validate the refresh token
    refreshToken = await refreshTokenSchema.parseAsync(refreshToken)

    // Decode the refresh token
    const payload = decodeRefreshToken(refreshToken)

    // Validate the decoded refresh token
    const decodedRefreshToken = await decodedRefreshTokenSchema.parseAsync(payload)

    // Find the user by id
    const user = await findUserById(decodedRefreshToken.userId)

    // Find the session by id
    let session = await findSessionById(decodedRefreshToken.sessionId)

    // Validate the session
    if (session.code !== decodedRefreshToken.code)
      throw new RefreshTokenError('Invalid refresh token')

    // Update the session code
    session = await updateSessionCode(session.id)

    // Generate the new refresh token
    refreshToken = generateRefreshToken({ code: session.code, sessionId: session.id, userId: user.id })

    // Generate the new access token
    const accessToken = generateAccessToken({ userId: user.id })

    // Send the refresh token
    setCookie(event, 'refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: true,
    })

    // Send the success response
    return {
      access_token: accessToken,
    }
  }
  catch (error) {
    // Refresh Token Format Error handler
    if (error instanceof ZodError || error instanceof RefreshTokenError) {
      deleteCookie(event, 'refresh_token')

      throw createError({
        status: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid or missing refresh token',
      })
    }

    // JsonWebToken Error handler
    if (error instanceof jwt.JsonWebTokenError) {
      deleteCookie(event, 'refresh_token')

      if (error instanceof jwt.TokenExpiredError) {
        throw createError({
          status: 401,
          statusMessage: 'Unauthorized',
          message: 'The refresh token has expired',
        })
      }
      else {
        throw createError({
          status: 400,
          statusMessage: 'Bad Request',
          message: 'Invalid or missing refresh token',
        })
      }
    }

    // Prisma Error handler
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      deleteCookie(event, 'refresh_token')

      // Find User/Session Error handler
      if (error.code === 'P2025') {
        throw createError({
          status: 400,
          statusMessage: 'Bad Request',
          message: 'Invalid or missing refresh token',
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
