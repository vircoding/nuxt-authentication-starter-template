import { FatalError } from '~/models/Error'

const { init } = useAuth()

export default defineNuxtPlugin(async () => {
  try {
    await init()
  }
  catch (error) {
    if (error instanceof FatalError)
      showError(error)
  }
  finally {
    useInitLoading().value = false
  }
})
