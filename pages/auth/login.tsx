import React, { useState } from 'react'
import { signIn } from 'next-auth/react'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b1020] to-[#0f1724] text-gray-100">
      <div className="w-full max-w-md p-8 bg-white/6 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Sign in to AuraCarbon</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm">Email</span>
            <input
              className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm">Password</span>
            <input
              className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">or continue with</div>
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => signIn('google')}
            className="flex-1 py-2 rounded-md bg-white/8 text-white"
          >
            Google
          </button>
          <button
            onClick={() => signIn('github')}
            className="flex-1 py-2 rounded-md bg-white/8 text-white"
          >
            GitHub
          </button>
        </div>

        <div className="mt-4 text-center text-sm">
          <a href="/auth/register" className="text-indigo-300 hover:underline">Create an account</a>
        </div>
      </div>
    </div>
  )
}
