import { useState, useEffect, useRef } from 'react'
import { formatTime } from '../types'

export function useRateLimit() {
  const [rateStatus, setRateStatus] = useState('ok')
  const [retryAfter, setRetryAfter] = useState(null)
  const [countdown, setCountdown] = useState(null)
  const countdownRef = useRef(null)

  useEffect(() => {
    if (!retryAfter || retryAfter <= 0) return

    setCountdown(Math.ceil(retryAfter))
    setRateStatus('limited')

    if (countdownRef.current) clearInterval(countdownRef.current)

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownRef.current)
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

  function handleRateLimit(data) {
    if (data.rateLimited) {
      setRateStatus('limited')
      if (data.retryAfter) setRetryAfter(data.retryAfter)
    }
  }

  const isLimited = rateStatus === 'limited'
  const countdownLabel = countdown !== null ? formatTime(countdown) : null

  return { isLimited, countdown, countdownLabel, handleRateLimit, setRateStatus }
}
