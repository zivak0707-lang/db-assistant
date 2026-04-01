import { useState, useEffect, useRef } from 'react'
import { RateStatus, formatTime } from '../types'

export function useRateLimit() {
  const [rateStatus, setRateStatus] = useState<RateStatus>('ok')
  const [retryAfter, setRetryAfter] = useState<number | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!retryAfter || retryAfter <= 0) return

    setCountdown(Math.ceil(retryAfter))
    setRateStatus('limited')

    if (countdownRef.current) clearInterval(countdownRef.current)

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownRef.current!)
          setRateStatus('ok')
          setRetryAfter(null)
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [retryAfter])

  function handleRateLimit(data: { rateLimited?: boolean; retryAfter?: number | null }) {
    if (data.rateLimited) {
      setRateStatus('limited')
      if (data.retryAfter) setRetryAfter(data.retryAfter)
    }
  }

  const isLimited = rateStatus === 'limited'

  const countdownLabel = countdown !== null ? formatTime(countdown) : null

  return {
    isLimited,
    countdown,
    countdownLabel,
    handleRateLimit,
    setRateStatus,
  }
}