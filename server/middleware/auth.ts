import { H3Error } from 'h3'
import jwt from 'jsonwebtoken'
import { ZodError } from 'zod'
import { accessTokenSchema, decodedAccessTokenSchema } from '~/schemas/token.schema'

export default defineEventHandler(async (event) => {
  const endpoints = [
    { path: '/api/auth', method: 'GET' },
    { path: '/api/auth', method: 'PATCH' },
    { path: '/api/auth/verify/resend', method: 'POST' },
  ]

  if (middlewareMatched(endpoints, event.path, event.method)) {
    try {
      // Get the access token
      let accessToken = getHeader(event, 'Authorization')?.split(' ')[1]

      // Validate the access token
      accessToken = await accessTokenSchema.parseAsync(accessToken)

      // Decode the access token
      const payload = decodeAccessToken(accessToken)

      // Validate the decoded access token
      const decodedAccessToken = await decodedAccessTokenSchema.parseAsync(payload)

      // Add userId to context
      event.context.userId = decodedAccessToken.userId
    }
    catch (error) {
      // Access Token Format Error handler
      if (error instanceof ZodError) {
        throw createError({
          status: 400,
          statusMessage: 'Bad Request',
          message: 'Invalid or missing access token',
        })
      }

      // JsonWebToken Error handler
      if (error instanceof jwt.JsonWebTokenError) {
        if (error instanceof jwt.TokenExpiredError) {
          throw createError({
            status: 401,
            statusMessage: 'Unauthorized',
            message: 'The access token has expired',
          })
        }
        else {
          throw createError({
            status: 400,
            statusMessage: 'Bad Request',
            message: 'Invalid or missing access token',
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
  }
})
