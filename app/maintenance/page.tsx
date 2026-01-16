"use client"

import { useEffect, useState } from "react"
import { CountdownTimer } from "@/components/maintenance/countdown-timer"

interface MaintenanceData {
  is_active: boolean
  title: string
  message: string
  end_time: string
}

export default function MaintenancePage() {
  const [maintenance, setMaintenance] = useState<MaintenanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await fetch("/api/maintenance")
        const data = await response.json()
        setMaintenance(data)
      } catch (error) {
        console.error("Failed to fetch maintenance status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaintenance()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!maintenance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-red-600">Failed to load maintenance status</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{maintenance.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {maintenance.is_active ? "Currently in progress" : "Scheduled"}
            </p>
          </div>

          {/* Message */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">{maintenance.message}</p>
          </div>

          {/* Countdown Timer */}
          {maintenance.end_time && (
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <CountdownTimer endTime={maintenance.end_time} />
            </div>
          )}

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Thank you for your patience. We'll notify you when we're back online.
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex h-3 w-3 rounded-full bg-yellow-500 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Maintenance in progress</span>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(maintenance.end_time).toLocaleString()}</p>
        </div>
      </div>
    </main>
  )
}
