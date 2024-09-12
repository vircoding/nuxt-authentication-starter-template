import { H3Error } from 'h3'
import { ZodError } from 'zod'
import { registerSchema } from '~/schemas/user.schema'
import { BodyError, ConflictError } from '~/server/models/Error'
import { registerUser } from '~/server/services/auth'

export default defineEventHandler(async (event) => {
  try {
    // Read the body of the request
    const input = await readBody(event)

    // Validate the body
    if (!input)
      throw new BodyError('Body is missing')

    // Validate the input
    const data = await registerSchema.parseAsync(input)

    // Register the user
    const user = await registerUser({ username: data.username, email: data.email, password: data.password })

    // Generate the verification token
    const verificationToken = generateVerificationToken({
      code: user.verificationCode.code,
      id: user.verificationCode.id,
      userId: user.id,
    })

    // Get the verification email
    const verificationEmailContent = await getVerificationEmail(user.username, verificationToken)

    // Send the verificaion email
    sendVerificationEmail(user.email, verificationEmailContent)

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

    // Conflict Error
    if (error instanceof ConflictError) {
      throw createError({
        status: 409,
        statusMessage: 'Conflict',
        message: 'User exists already',
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
