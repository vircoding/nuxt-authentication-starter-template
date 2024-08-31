// Access Token State
export const useAccessToken = () => useState<string>('accessToken')

export function useSetAccessToken(newToken: string): void {
  const accessToken = useAccessToken()
  accessToken.value = newToken
}

// User State
export const useUser = () => useState<{ id: string, username: string, verified: boolean }>('user')

export function useSetUser(newUser: { id: string, username: string, verified: boolean }): void {
  const user = useUser()
  user.value = newUser
}
