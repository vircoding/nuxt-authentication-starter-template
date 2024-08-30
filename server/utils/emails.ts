import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: useRuntimeConfig().nodemailerHost,
  port: 465,
  secure: true,
  auth: {
    user: useRuntimeConfig().nodemailerUser,
    pass: useRuntimeConfig().nodemailerPassword,
  },
})

function transportConfirmationEmail(email: string, content: string) {
  return transporter.sendMail({
    from: '"vircoding API" <vircoding98@gmail.com>',
    to: email,
    subject: 'Complete your account verification',
    html: content,
  })
}

export function sendConfirmationEmail(email: string, content: string, attempts: number) {
  return new Promise((resolve, reject) => {
    transportConfirmationEmail(email, content).catch(async () => {
      let attemptCount = attempts - 1
      while (attemptCount > 0) {
        try {
          await new Promise((resolve) => {
            setTimeout(async () => {
              transportConfirmationEmail(email, content)
                .then(() => {
                  resolve(true)
                })
                .catch(() => {
                  throw new Error('An error has ocuured while sending the email')
                })
            }, 5000)
          }).catch((error) => {
            throw error
          })

          break
        }
        catch (error) {
          attemptCount--
          if (attemptCount <= 0)
            reject(error)
        }
      }
    })

    resolve(true)
  })
}
