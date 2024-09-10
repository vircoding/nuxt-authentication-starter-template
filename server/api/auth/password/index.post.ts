import { Prisma } from '@prisma/client'
import { H3Error } from 'h3'
import { ZodError } from 'zod'
import { requestPasswordSchema } from '~/schemas/user.schema'
import { deletePasswordCodeByIdTimeout, upsertPasswordCode } from '~/server/db/passwordCode'
import { findUserByEmail } from '~/server/db/user'
import { BodyError } from '~/server/models/Error'

export default defineEventHandler(async (event) => {
  try {
    // Read the body of the request
    const input = await readBody(event)

    // Validate the body
    if (!input)
      throw new BodyError('Body is missing')

    // Validate the input
    const data = await requestPasswordSchema.parseAsync(input)

    // Find the user by email
    const user = await findUserByEmail(data.email)

    // Create or update the password code
    const passwordCode = await upsertPasswordCode({ userId: user.id })

    try {
      // Get the password email
      const passwordEmailContent = await getPasswordEmail(user.username, passwordCode.code)

      // Send the password email
      sendPasswordEmail(user.email, passwordEmailContent)
    }
    catch (error) {
      console.error('An error has ocurred while sending the password email', error)
    }

    // Delete the password code after 2 minutes
    try {
      deletePasswordCodeByIdTimeout(passwordCode.id, 120000)
    }
    catch (error) {
      console.error('An error has ocurred while deleting the password code', error)
    }

    // Send the success response
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
