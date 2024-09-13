import { H3Error } from 'h3'
import { z } from 'zod'
import { NotFoundError } from '~/server/models/Error'
import { findUserById } from '~/server/services/auth'

export default defineEventHandler(async (event) => {
  try {
    // Get the userId
    let userId = event.context.userId

    // Validate the userId
    userId = await z.string().parseAsync(userId)

    // Find the user by id
    const user = await findUserById(userId)

    // Send the success response
    return { user: userTransformer(user) }
  }
  catch (error) {
    // Not Found Error
    if (error instanceof NotFoundError) {
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
