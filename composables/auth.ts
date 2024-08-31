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
  try {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body,
    })

    setAccessToken(data.access_token)
    setUser(data.user)
  }
  catch (error) {
    console.error(error)
    throw new Error('An error has ocurred while login')
  }
}

export async function useRegister(body: RegisterBody) {
  try {
    const data = await $fetch('/api/auth/register', {
      method: 'POST',
      body,
    })

    setAccessToken(data.access_token)
    setUser(data.user)
  }
  catch (error) {
    console.error(error)
    throw new Error('An error has ocurred while register')
  }
}
