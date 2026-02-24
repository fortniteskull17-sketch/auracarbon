import React from 'react'

export default function AdminIndex() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin</h2>
      <div className="space-y-3">
        <a href="/admin/compliance" className="text-indigo-300 hover:underline">Compliance</a>
        <a href="/admin/users" className="text-indigo-300 hover:underline">User Management (TODO)</a>
        <a href="/admin/materials" className="text-indigo-300 hover:underline">Material Management (TODO)</a>
      </div>
    </div>
  )
}
