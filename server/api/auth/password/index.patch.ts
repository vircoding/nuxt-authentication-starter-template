import { Prisma } from '@prisma/client'
import { H3Error } from 'h3'
import { ZodError } from 'zod'
import { resetPasswordSchema } from '~/schemas/user.schema'
import { deletePasswordCodeById } from '~/server/db/passwordCode'
import { findUserByEmail, findUserWithPasswordPendingByEmail, resetPasswordById } from '~/server/db/user'
import { BodyError } from '~/server/models/Error'

export default defineEventHandler(async (event) => {
  try {
    // Read the body of the request
    const input = await readBody(event)

    // Validate the body
    if (!input)
      throw new BodyError('Body is missing')

    // Validate the input
    const data = await resetPasswordSchema.parseAsync(input)

    // Find the user by email if its pending for password reset
    const user = await findUserWithPasswordPendingByEmail(data.email)

    // Update the user password
    await resetPasswordById(user.id, { password: data.password })

    return { ok: true }
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
        status: 401,
        statusMessage: 'Unauthorized',
        message: 'User is not pending for password reset or does not exists',
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
