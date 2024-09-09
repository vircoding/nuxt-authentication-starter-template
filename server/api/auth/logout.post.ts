import { Prisma } from '@prisma/client'
import { H3Error } from 'h3'
import jwt from 'jsonwebtoken'
import { ZodError } from 'zod'
import { decodedRefreshTokenSchema, refreshTokenSchema } from '~/schemas/token.schema'
import { deleteSessionById, findSessionById } from '~/server/db/sesion'
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

    // Find the session by id
    let session = await findSessionById(decodedRefreshToken.sessionId)

    // Validate the session
    if (session.code !== decodedRefreshToken.code)
      throw new RefreshTokenError('Invalid refresh token')

    // Delete the session
    session = await deleteSessionById(session.id)

    // Delete the refresh token
    deleteCookie(event, 'refresh_token')

    // Send the success response
    return { session_id: session.id }
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
