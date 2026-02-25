import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    } as any)

    setLoading(false)
    if (res && 'error' in res && res.error) setError(res.error)
    else window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b1020] via-[#0d131d] to-[#0f1724] text-gray-100 overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-md p-8 bg-white/8 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-500 animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✨</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent mb-1">Welcome Back</h1>
          <p className="text-sm text-gray-400">Sign in to your AuraCarbon account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              className="w-full rounded-lg bg-white/10 border border-white/20 hover:border-white/40 focus:border-indigo-400 focus:bg-white/15 px-4 py-3 text-gray-100 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              className="w-full rounded-lg bg-white/10 border border-white/20 hover:border-white/40 focus:border-indigo-400 focus:bg-white/15 px-4 py-3 text-gray-100 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⚡</span>
                Signing in…
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white/8 backdrop-blur-xl border border-white/20 rounded-full text-gray-400">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => signIn('google')}
            className="py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🔍 Google
          </button>
          <button
            onClick={() => signIn('github')}
            className="py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            👨 GitHub
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <Link href="/auth/register" className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors">Create one</Link>
        </div>
      </div>
    </div>
  )
}
