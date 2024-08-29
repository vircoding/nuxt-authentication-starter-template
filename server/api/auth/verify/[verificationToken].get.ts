import {
  verificationTokenSchema,
  decodedVerificationTokenSchema,
} from '~/server/schemas/token.schema';
import { findUserById, verifyUser } from '~/server/db/user';
import { CustomVerifiedError } from '~/server/models/error';

export default defineEventHandler(async (event) => {
  try {
    // Get the verification token
    let { verificationToken } = getRouterParams(event);

    // Validate the verification token
    verificationToken = await verificationTokenSchema.parseAsync(verificationToken);

    // Decode the verification token
    let payload = decodeVerificationToken(verificationToken);
    if (!payload) throw new Error('Invalid verification token');

    // Validate the decoded verification token
    payload = await decodedVerificationTokenSchema.parseAsync(payload);

    // Find the user by id
    let user = await findUserById(payload.uid);

    // Validate if user its not yet verified
    if (user.verified) throw new CustomVerifiedError('This account is verified already');

    // Validate the verification code
    if (user.verificationCode !== payload.verificationCode)
      throw new Error('Invalid verification token');

    // Update the user
    user = await verifyUser(user.id).catch(() => {
      throw new Error('The verification has failed');
    });

    // Get the verification success content
    const verificationSuccessContent = await getVerificationSuccess(user.username).catch(() => {
      return {
        status: 'Success',
        message: `Hello ${user.username}. Your account has been verified succesfully! You can close now this windows.`,
      };
    });

    // Success response
    return verificationSuccessContent;
  } catch (error) {
    // Verified Error Handler
    if (error instanceof CustomVerifiedError) {
      // Get the response content
      const verificationIsVerifiedContent = await getVerificationIsVerified().catch(() => {
        return {
          status: 'Failed',
          message: "We are sorry! We can't verify your account. This account is verified already.",
        };
      });

      return verificationIsVerifiedContent;
    }

    // Get the verification failed content
    const verificationFailedContent = await getVerificationFailed().catch(() => {
      return {
        status: 'Failed',
        message:
          "We are sorry! We can't verify your account. Try to request a new email to complete your verification or try later.",
      };
    });

    // Failed response
    return verificationFailedContent;
  }
});
