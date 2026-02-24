import React, { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) return setError('Passwords do not match')
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    setLoading(false)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return setError(body?.message || 'Registration failed')
    }

    // auto sign-in after registration
    await signIn('credentials', { redirect: false, email, password } as any)
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b1020] to-[#0f1724] text-gray-100">
      <div className="w-full max-w-md p-8 bg-white/6 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Create an AuraCarbon account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm">Full name</span>
            <input className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className="block">
            <span className="text-sm">Email</span>
            <input className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label className="block">
            <span className="text-sm">Password</span>
            <input className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          <label className="block">
            <span className="text-sm">Confirm password</span>
            <input className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </label>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button type="submit" className="w-full py-2 px-4 bg-green-600 hover:bg-green-500 rounded-md text-white" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <a href="/auth/login" className="text-indigo-300 hover:underline">Already have an account? Sign in</a>
        </div>
      </div>
    </div>
  )
}
