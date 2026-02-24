import { useState } from 'react'

export default function useDashboard() {
  const [stats, setStats] = useState<any | null>(null)

  async function fetchStats() {
    try {
      const res = await fetch('/api/dashboard/stats')
      const json = await res.json()
      setStats(json)
    } catch (err) {
      console.error('fetchStats', err)
    }
  }

  return { stats, fetchStats }
}
