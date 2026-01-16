"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  endTime: string
}

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime()
      const now = new Date().getTime()
      const distance = end - now

      if (distance < 0) {
        setTimeLeft("Maintenance complete!")
        return
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Estimated time remaining</p>
      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 font-mono">{timeLeft || "Calculating..."}</p>
    </div>
  )
}
