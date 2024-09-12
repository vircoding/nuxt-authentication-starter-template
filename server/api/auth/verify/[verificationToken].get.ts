import {
  decodedVerificationTokenSchema,
  verificationTokenSchema,
} from '~/schemas/token.schema'
import { VerificationTokenError, VerifiedError } from '~/server/models/Error'
import { verifyUser } from '~/server/services/auth'

export default defineEventHandler(async (event) => {
  try {
    // Get the verification token
    let { verificationToken } = getRouterParams(event)

    // Validate the verification token
    verificationToken = await verificationTokenSchema.parseAsync(verificationToken)

    // Decode the verification token
    const payload = decodeVerificationToken(verificationToken)
    if (!payload)
      throw new VerificationTokenError('Invalid verification token')

    // Validate the decoded verification token
    const decodedVerificationToken = await decodedVerificationTokenSchema.parseAsync(payload)

    // Verify the user
    const user = await verifyUser(decodedVerificationToken.userId, decodedVerificationToken.code)

    // Get the verification success content
    const verificationSuccessContent = await getVerificationSuccess(user.username).catch(() => {
      return {
        status: 'Success',
        message: `Hello ${user.username}. Your account has been verified succesfully! You can close now this windows.`,
      }
    })

    // Success response
    return verificationSuccessContent
  }
  catch (error) {
    // Verified Error Handler
    if (error instanceof VerifiedError) {
      // Get the response content
      const verificationIsVerifiedContent = await getVerificationIsVerified().catch(() => {
        return {
          status: 'Failed',
          message: 'We are sorry! We can\'t verify your account. This account is verified already.',
        }
      })

      return verificationIsVerifiedContent
    }

    // Get the verification failed content
    const verificationFailedContent = await getVerificationFailed().catch(() => {
      return {
        status: 'Failed',
        message:
          'We are sorry! We can\'t verify your account. Try to request a new email to complete your verification or try later.',
      }
    })

    // Failed response
    return verificationFailedContent
  }
})
