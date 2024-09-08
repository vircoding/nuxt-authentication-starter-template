// Access Token State
export const accessTokenState = () => useState<string>('accessToken')

// User State
export const userState = () => useState<{ id: string, username: string, verified: boolean }>('user')
