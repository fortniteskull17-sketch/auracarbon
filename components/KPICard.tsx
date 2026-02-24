import React from 'react'

export default function KPICard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white/6 p-4 rounded">
      <div className="text-sm text-gray-300">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  )
}
