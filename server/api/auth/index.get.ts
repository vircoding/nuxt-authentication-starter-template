import { Prisma } from '@prisma/client'
import { H3Error } from 'h3'
import { z } from 'zod'
import { findUserById } from '~/server/db/user'

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
    // Prisma Error handler
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
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
