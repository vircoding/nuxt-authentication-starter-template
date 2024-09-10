interface User {
  id?: string
  username?: string
  verified?: boolean
}

interface Session {
  accessToken?: string
  isLoggedIn: boolean
}

// Session Data
export function useSessionData() {
  return useState<Session>('sessionData', () => ({
    accessToken: undefined,
    isLoggedIn: false,
  }))
}

export function clearSessionData() {
  useSessionData().value = {
    accessToken: undefined,
    isLoggedIn: false,
  }
}

// User Data
export function useUserData() {
  return useState<User>('userData', () => ({
    id: undefined,
    username: undefined,
    verified: undefined,
  }))
}

export function clearUserData() {
  useUserData().value = {
    id: undefined,
    username: undefined,
    verified: undefined,
  }
}

export function useInitLoading() {
  return useState<boolean>('initLoading', () => true)
}
