import { FetchError } from 'ofetch'
import type { z } from 'zod'
import {
  AccessTokenExpiredError,
  FatalError,
  InvalidAccessTokenError,
  InvalidRefreshTokenError,
  RefreshTokenExpiredError,
} from '~/models/Error'
import type { loginSchema, registerSchema, updateSchema } from '~/schemas/user.schema'

type RegisterBody = z.infer<typeof registerSchema>
type LoginBody = z.infer<typeof loginSchema>
type UpdateBody = z.infer<typeof updateSchema>

async function register(body: RegisterBody) {
  try {
    const data = await $fetch('/api/auth/register', { method: 'POST', body })
    useSessionData().value.accessToken = data.access_token
    useSessionData().value.isLoggedIn = true
    useUserData().value.id = data.user.id
    useUserData().value.username = data.user.username
    useUserData().value.verified = data.user.verified
  }
  catch (error) {
    if (error instanceof FetchError) {
      // TODO Handle Errors
      throw new FatalError('Unhadled error')
    }
    throw new FatalError('Unexpected error')
  }
}

async function login(body: LoginBody) {
  try {
    const data = await $fetch('/api/auth/login', { method: 'POST', body })
    useSessionData().value.accessToken = data.access_token
    useSessionData().value.isLoggedIn = true
    useUserData().value.id = data.user.id
    useUserData().value.username = data.user.username
    useUserData().value.verified = data.user.verified
  }
  catch (error) {
    if (error instanceof FetchError) {
      // TODO Handle Errors
      throw new FatalError('Unhadled error')
    }
    throw new FatalError('Unexpected error')
  }
}

async function logout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    clearSessionData()
    clearUserData()
  }
  catch (error) {
    if (error instanceof FetchError) {
      if (error.status !== undefined) {
        if (error.status === 401) {
          throw new RefreshTokenExpiredError('The refresh token has expired')
        }
        else if (error.status === 400) {
          throw new InvalidRefreshTokenError('Refresh token error')
        }
      }
    }
    throw new FatalError('Unexpected error')
  }
}

async function refresh() {
  try {
    const data = await $fetch('/api/auth/refresh', { method: 'POST' })
    useSessionData().value.accessToken = data.access_token
    useSessionData().value.isLoggedIn = true
  }
  catch (error) {
    if (error instanceof FetchError) {
      if (error.status !== undefined) {
        if (error.status === 401) {
          throw new RefreshTokenExpiredError('The refresh token has expired')
        }
        else if (error.status === 400) {
          throw new InvalidRefreshTokenError('Refresh token error')
        }
      }
    }
    throw new FatalError('Unexpected error')
  }
}

async function getUser() {
  try {
    const data = await $fetch('/api/auth', {
      headers: {
        Authorization: `Bearer ${useSessionData().value.accessToken}`,
      },
    })
    useUserData().value.id = data.user.id
    useUserData().value.username = data.user.username
    useUserData().value.verified = data.user.verified
  }
  catch (error) {
    if (error instanceof FetchError) {
      if (error.status !== undefined) {
        if (error.status === 401) {
          throw new AccessTokenExpiredError('The access token has expired')
        }
        else if ([400, 404].includes(error.status)) {
          throw new InvalidAccessTokenError('Access token error')
        }
      }
    }
    throw new FatalError('Unexpected error')
  }
}

async function init() {
  await refresh()
  await getUser().catch (() => {
    throw new FatalError('Unexpected error')
  })
  return true
}

async function update(body: UpdateBody) {
  try {
    const data = await $fetch('/api/auth', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${useSessionData().value.accessToken}`,
      },
      body,
    })
    useUserData().value.username = data.user.username
  }
  catch (error) {
    if (error instanceof FetchError) {
      // TODO Handle Errors
      throw new FatalError('Unhadled error')
    }
    throw new FatalError('Unexpected error')
  }
}

export default function () {
  return { register, login, logout, refresh, getUser, init, update }
}
