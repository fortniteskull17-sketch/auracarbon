import React, { useEffect } from 'react'
import useCalculations from '../../hooks/useCalculations'

export default function MaterialsPage() {
  const { materials, fetchMaterials } = useCalculations()
  useEffect(() => { fetchMaterials() }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Material Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {materials.map((m: any) => (
          <div key={m.id} className="p-4 bg-white/6 rounded">
            <div className="font-medium">{m.name}</div>
            <div className="text-sm text-gray-300">EF: {m.ef ?? '—'} kg CO2e/unit</div>
            <div className="mt-2">
              <button className="px-3 py-1 bg-indigo-600 text-white rounded">Use</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
