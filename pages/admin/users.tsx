import React, { useEffect, useState } from 'react'

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users')
      const json = await res.json()
      setUsers(json || [])
    } catch (err) { console.error(err) }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <div className="space-y-2">
        {users.map(u => (
          <div key={u.id} className="p-3 bg-white/6 rounded">
            <div className="font-medium">{u.name || u.email}</div>
            <div className="text-sm text-gray-300">Role: {u.role}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
