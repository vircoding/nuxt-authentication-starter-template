import { Prisma } from '@prisma/client'
import { H3Error } from 'h3'
import { ZodError } from 'zod'
import { passwordCodeSchema } from '~/schemas/user.schema'
import { deletePasswordCodeById, findPasswordCodeByUserId } from '~/server/db/passwordCode'
import { findUserByEmail, setPasswordPendingById } from '~/server/db/user'
import { BodyError, PasswordCodeError } from '~/server/models/Error'

export default defineEventHandler(async (event) => {
  try {
    // Read the body of the request
    const input = await readBody(event)

    // Validate the body
    if (!input)
      throw new BodyError('Body is missing')

    // Validate the input
    const data = await passwordCodeSchema.parseAsync(input)

    // Find the user by email
    const user = await findUserByEmail(data.email)

    // Find the password code by userId
    const passwordCode = await findPasswordCodeByUserId(user.id)

    // Validate the password codes
    if (data.code !== passwordCode.code)
      throw new PasswordCodeError('Invalid password code')

    // Set Password Pending
    await setPasswordPendingById(user.id)

    // Delete the password code
    await deletePasswordCodeById(passwordCode.id)

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

    if (error instanceof PasswordCodeError) {
      throw createError({
        status: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid code',
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
