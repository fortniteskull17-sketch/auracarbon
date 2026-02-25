import React, { useEffect, useState } from 'react'
import useDashboard from '../../hooks/useDashboard'
import TrendChart from '../../components/TrendChart'

export default function DashboardPage() {
  const { stats, fetchStats } = useDashboard()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats().then(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] via-[#0d131d] to-[#0f1724]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">📊 Emissions</span>
            <br />
            <span className="text-gray-100">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-lg">Your carbon footprint overview and analytics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* YTD Emissions */}
          <div className="group relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-blue-400 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute top-4 right-4 text-3xl opacity-20">📈</div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">YTD Emissions</h3>
            <div className="text-5xl font-bold text-white mb-2">
              {isLoading ? (
                <span className="animate-pulse">—</span>
              ) : (
                <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  {stats?.ytd?.toLocaleString() ?? '—'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">kg CO₂e</p>
          </div>

          {/* CBAM Risk High */}
          <div className="group relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-orange-400 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
            <div className="absolute top-4 right-4 text-3xl opacity-20">⚠️</div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">CBAM Risk (High)</h3>
            <div className="text-5xl font-bold text-white mb-2">
              {isLoading ? (
                <span className="animate-pulse">—</span>
              ) : (
                <span className="bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                  {stats?.cbamDistribution?.high ?? '—'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">High risk materials</p>
          </div>

          {/* Credits */}
          <div className="group relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-green-400 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="absolute top-4 right-4 text-3xl opacity-20">💳</div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Carbon Credits</h3>
            <div className="text-5xl font-bold text-white mb-2">
              {isLoading ? (
                <span className="animate-pulse">—</span>
              ) : (
                <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                  {stats?.credits?.toLocaleString() ?? '0'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">Offset credits available</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 12-Month Trend - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="p-8 bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl h-full">
              <h3 className="text-2xl font-bold text-white mb-2">📈 12-Month Trend</h3>
              <p className="text-sm text-gray-400 mb-6">Monthly emissions over the past year</p>
              <div className="h-80">
                <TrendChart series={stats?.monthly || []} />
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="p-8 bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">📊 Summary</h3>
            <div className="space-y-5">
              <div className="group p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Average Monthly</p>
                <p className="text-2xl font-bold text-indigo-300">
                  {isLoading ? '—' : (stats?.ytd ? (stats.ytd / 12).toFixed(0) : '—')}
                </p>
                <p className="text-xs text-gray-500 mt-1">kg CO₂e/month</p>
              </div>

              <div className="group p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Records</p>
                <p className="text-2xl font-bold text-purple-300">
                  {isLoading ? '—' : stats?.breakdown?.length ?? '0'}
                </p>
                <p className="text-xs text-gray-500 mt-1">calculations logged</p>
              </div>

              <div className="group p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Mid Risk</p>
                <p className="text-2xl font-bold text-yellow-300">
                  {isLoading ? '—' : stats?.cbamDistribution?.medium ?? '—'}
                </p>
                <p className="text-xs text-gray-500 mt-1">CBAM materials</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
