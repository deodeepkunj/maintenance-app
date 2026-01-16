"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface MaintenanceData {
  id: string
  is_active: boolean
  title: string
  message: string
  start_time: string | null
  end_time: string | null
}

export default function AdminMaintenancePage() {
  const router = useRouter()
  const [maintenance, setMaintenance] = useState<MaintenanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    is_active: false,
    title: "Scheduled Maintenance",
    message: "",
    start_time: "",
    end_time: "",
  })

  useEffect(() => {
    fetchMaintenance()
  }, [])

  const fetchMaintenance = async () => {
    try {
      const response = await fetch("/api/maintenance")
      const data = await response.json()
      setMaintenance(data)
      setFormData({
        is_active: data.is_active,
        title: data.title,
        message: data.message,
        start_time: data.start_time ? new Date(data.start_time).toISOString().slice(0, 16) : "",
        end_time: data.end_time ? new Date(data.end_time).toISOString().slice(0, 16) : "",
      })
    } catch (error) {
      console.error("Failed to fetch maintenance status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/maintenance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: formData.is_active,
          title: formData.title,
          message: formData.message,
          start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
          end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
        }),
      })

      if (response.ok) {
        alert("Maintenance status updated successfully!")
        await fetchMaintenance()
      } else {
        alert("Failed to update maintenance status")
      }
    } catch (error) {
      console.error("Error updating maintenance:", error)
      alert("Error updating maintenance status")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maintenance Control</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage scheduled maintenance and communicate with users
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {/* Active Toggle */}
          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-6 h-6 rounded border-gray-300"
              />
              <span className="ml-3 font-medium text-gray-900 dark:text-white">Activate Maintenance Mode</span>
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Scheduled Maintenance"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Describe the maintenance..."
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
            <input
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Time</label>
            <input
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Current Status */}
        {maintenance && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Status</h2>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-medium">Active:</span> {maintenance.is_active ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-medium">Title:</span> {maintenance.title}
              </p>
              <p>
                <span className="font-medium">Start:</span>{" "}
                {maintenance.start_time ? new Date(maintenance.start_time).toLocaleString() : "Not set"}
              </p>
              <p>
                <span className="font-medium">End:</span>{" "}
                {maintenance.end_time ? new Date(maintenance.end_time).toLocaleString() : "Not set"}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
