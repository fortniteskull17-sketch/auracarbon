import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] via-[#0d131d] to-[#0f1724] text-gray-100 overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">✨ AuraCarbon</div>
          <div className="flex gap-3 items-center">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-indigo-300/30 hover:border-indigo-300 text-indigo-300 text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 animate-fade-in">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight">
            Measure <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">Emissions</span>
            <br />
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Track Progress</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Industrial-grade carbon accounting with IPCC 2019 compliance, 50+ materials across 150 countries, and CBAM risk scoring
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <Link href="/calculator">
            <div className="group p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-indigo-400 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20">
              <div className="text-4xl mb-3">🧮</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">Calculator</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                Calculate emissions from 50+ raw materials across Scope 1, 2 & 3
              </p>
            </div>
          </Link>

          <Link href="/dashboard">
            <div className="group p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-green-400 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-green-300 transition-colors">Dashboard</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                View YTD emissions, CBAM scores, and 12-month trend analysis
              </p>
            </div>
          </Link>

          <Link href="/materials">
            <div className="group p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-blue-400 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors">Materials</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                Browse 50 materials & grid factors for 150 countries
              </p>
            </div>
          </Link>

          <Link href="/records">
            <div className="group p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-purple-400 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors">Records</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                Export calculation history to CSV or PDF for audits
              </p>
            </div>
          </Link>

          <Link href="/admin">
            <div className="group p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-orange-400 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="text-4xl mb-3">👨‍💼</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-orange-300 transition-colors">Admin</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                Manage users, materials, and compliance settings
              </p>
            </div>
          </Link>

          <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-cyan-400 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 group cursor-pointer">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-300 transition-colors">API Docs</h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
              RESTful endpoints for calculations, materials & analytics
            </p>
            <p className="text-xs text-purple-400/60 mt-4 font-semibold">🔄 Coming soon</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-16 border-t border-white/10">
          <div className="group p-6 text-center bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 rounded-2xl border border-indigo-500/20 hover:border-indigo-400 transition-all duration-300 transform hover:scale-105">
            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent mb-2">150</div>
            <div className="text-sm text-gray-300 font-medium">🌍 Countries supported</div>
          </div>
          <div className="group p-6 text-center bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl border border-green-500/20 hover:border-green-400 transition-all duration-300 transform hover:scale-105">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent mb-2">50</div>
            <div className="text-sm text-gray-300 font-medium">⚙️ Raw materials available</div>
          </div>
          <div className="group p-6 text-center bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">30+</div>
            <div className="text-sm text-gray-300 font-medium">✅ Unit test coverage</div>
          </div>
        </div>
      </div>
    </div>
  )
}
