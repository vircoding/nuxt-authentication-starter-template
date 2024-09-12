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

    return { data }
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
