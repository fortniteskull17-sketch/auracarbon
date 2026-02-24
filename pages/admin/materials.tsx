import React, { useEffect, useState } from 'react'

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<any[]>([])

  useEffect(() => { fetchMaterials() }, [])

  async function fetchMaterials() {
    try {
      const res = await fetch('/api/materials')
      const json = await res.json()
      setMaterials(json || [])
    } catch (err) { console.error(err) }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Material Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {materials.map(m => (
          <div key={m.id} className="p-4 bg-white/6 rounded">
            <div className="font-medium">{m.name}</div>
            <div className="text-sm">EF: {m.ef ?? '—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
