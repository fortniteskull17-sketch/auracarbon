import React from 'react'

export default function TrendChart({ series }: { series: any[] }) {
  if (!series || series.length === 0) return <div className="p-4">No data</div>

  // Simple textual fallback chart
  return (
    <div className="p-2">
      <ul className="text-sm">
        {series.map((s: any, i: number) => (
          <li key={i}>{s.month}: {s.value}</li>
        ))}
      </ul>
    </div>
  )
}
