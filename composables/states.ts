// Access Token State
export const accessTokenState = () => useState<string>('accessToken')

export const clearAccessTokenState = () => clearNuxtState('accessToken')

// User State
export const userState = () => useState<{ id: string, username: string, verified: boolean }>('user')

export const clearUserState = () => clearNuxtState('user')
