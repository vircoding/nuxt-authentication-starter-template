import { H3Error } from 'h3'
import { ZodError } from 'zod'
import jwt from 'jsonwebtoken'
import { accessTokenSchema, decodedAccessTokenSchema } from '~/schemas/token.schema'

export default defineEventHandler(async (event) => {
  const endpoints = [
    '/api/auth',
    '/api/auth/',
  ]

  if (middlewareMatched(endpoints, getRequestURL(event).pathname)) {
    try {
      // Get the access token
      let accessToken = getHeader(event, 'Authorization')?.split(' ')[1]

      console.info('1-Init: ', accessToken)

      // Validate the access token
      accessToken = await accessTokenSchema.parseAsync(accessToken)
      console.info('2-Validated: ', accessToken)

      // Decode the access token
      const payload = decodeAccessToken(accessToken)
      console.info('3-Decoded: ', payload)

      // Validate the decoded access token
      const decodedAccessToken = await decodedAccessTokenSchema.parseAsync(payload)
      console.info('3-Revalidated: ', decodedAccessToken)

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
