// Access Token State
export const useAccessToken = () => useState('accessToken')

// User State
export const useUser = () => useState<{ id: string, username: string, verified: boolean }>('user')
