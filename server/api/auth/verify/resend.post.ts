import { H3Error } from 'h3'
import { ZodError } from 'zod'
import { resendSchema } from '~/schemas/user.schema'
import { BodyError, NotFoundError, VerifiedError } from '~/server/models/Error'
import { resetVerificationCode } from '~/server/services/auth'

export default defineEventHandler(async (event) => {
  try {
    // Read the body of the request
    const input = await readBody(event)

    // Validate the body
    if (!input)
      throw new BodyError('Body is missing')

    // Validate the input
    const data = await resendSchema.parseAsync(input)

    // Reset verification code
    const { user, verificationCode } = await resetVerificationCode(data.email)

    // Generate the verification token
    const verificationToken = generateVerificationToken({
      code: verificationCode.code,
      id: verificationCode.id,
      userId: verificationCode.userId,
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

    if (error instanceof NotFoundError) {
      throw createError({
        status: 404,
        statusMessage: 'Not Found',
        message: 'User not found',
      })
    }

    if (error instanceof VerifiedError) {
      throw createError({
        status: 409,
        statusMessage: 'Conflict',
        message: 'This account is verified already',
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
