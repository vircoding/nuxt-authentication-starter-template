import type { z } from 'zod'
import type { loginSchema, registerSchema } from '~/server/schemas/user.schema'

type RegisterBody = z.infer<typeof registerSchema>
type LoginBody = z.infer<typeof loginSchema>

function setAccessToken(newToken: string): void {
  const accessToken = useAccessToken()
  accessToken.value = newToken
}

function setUser(newUser: { id: string, username: string, verified: boolean }): void {
  const user = useUser()
  user.value = newUser
}

export async function useLogin(body: LoginBody) {
  return new Promise<true>((resolve, reject) => {
    $fetch('/api/auth/login', {
      method: 'POST',
      body,
    }).then((data) => {
      setAccessToken(data.access_token)
      setUser(data.user)
      resolve(true)
    }).catch(error => reject(error))
  })
}

export async function useRegister(body: RegisterBody) {
  return new Promise<true>((resolve, reject) => {
    $fetch('/api/auth/register', {
      method: 'POST',
      body,
    }).then((data) => {
      setAccessToken(data.access_token)
      setUser(data.user)
      resolve(true)
    }).catch(error => reject(error),
    )
  })
}
