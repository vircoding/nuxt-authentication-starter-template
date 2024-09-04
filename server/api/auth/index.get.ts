import { H3Error } from 'h3'
import { Prisma } from '@prisma/client'
import { userIdSchema } from '~/schemas/user.schema'
import { findUserById } from '~/server/db/user'

export default defineEventHandler(async (event) => {
  try {
    // TODO Get the userId
    const userId = event.context.userId
    console.info('4-Context: ', userId)

    // TODO Validate the userId
    // userId = await userIdSchema.parseAsync(userId)

    // TODO Find the user by id
    const user = await findUserById(userId)

    // TODO Send the success response
    return { user: userTransformer(user) }
  }
  catch (error) {
    // Bad Credentials Error handler
    if ((error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')) {
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
