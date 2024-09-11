import { useTimer as timerHook } from 'vue-timer-hook'

function getTimeout(timeout: number) {
  const time = new Date()
  time.setSeconds(time.getSeconds() + timeout)

  return time.getTime()
}

export default function useTimer(timeout: number) {
  const timer = timerHook(getTimeout(timeout), false)

  return {
    ...timer,
    restart() {
      timer.restart(getTimeout(timeout), true)
    },
  }
}
