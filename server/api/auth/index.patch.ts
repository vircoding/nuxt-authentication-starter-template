import { Prisma } from '@prisma/client'
import { H3Error } from 'h3'
import { z, ZodError } from 'zod'
import { updateSchema } from '~/schemas/user.schema'
import { updateUserById } from '~/server/db/user'
import { BodyError, PasswordError } from '~/server/models/Error'

export default defineEventHandler(async (event) => {
  try {
    // Get the userId
    let userId = event.context.userId

    // Validate the userId
    userId = await z.string().parseAsync(userId).catch(() => {
      throw new Error('Unhandled Error')
    })

    // Read the body of the request
    const input = await readBody(event)

    // Validate the body
    if (!input)
      throw new BodyError('Body is missing')

    // Validate the input
    const data = await updateSchema.parseAsync(input)

    // Update the user by id
    const user = await updateUserById(userId, data)

    return { user: userTransformer(user) }
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
