import React, { useEffect, useState } from 'react'
import useDashboard from '../../hooks/useDashboard'
import KPICard from '../../components/KPICard'
import TrendChart from '../../components/TrendChart'

export default function DashboardPage() {
  const { stats, fetchStats } = useDashboard()

  useEffect(() => { fetchStats() }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="YTD Emissions" value={`${stats?.ytd ?? '—'} kg`} />
        <KPICard title="CBAM Risk" value={stats?.cbamDistribution?.high ?? '—'} />
        <KPICard title="Credits" value={`${stats?.credits ?? 0}`} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/6 p-4 rounded">
          <h3 className="mb-2">12-month Trend</h3>
          <TrendChart series={stats?.monthly || []} />
        </div>

        <div className="bg-white/6 p-4 rounded">
          <h3 className="mb-2">Breakdown</h3>
          <pre className="text-sm">{JSON.stringify(stats?.breakdown || {}, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
