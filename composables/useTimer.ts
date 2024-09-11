import { useTimer as timerHook } from 'vue-timer-hook'

function getTimeout(timeout: number) {
  const time = new Date()
  time.setMinutes(time.getMinutes() + timeout)

  return time.getTime()
}

export default function useTimer(timeout: number) {
  return timerHook(getTimeout(timeout), false)
}
