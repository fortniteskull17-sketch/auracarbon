import React from 'react'

export default function TrendChart({ series }: { series: any[] }) {
  if (!series || series.length === 0) return <div className="p-4">No data</div>

  const width = 320
  const height = 120
  const max = Math.max(...series.map(s => s.value || 0), 1)

  const points = series.map((s: any, i: number) => {
    const x = (i / Math.max(1, series.length - 1)) * width
    const y = height - ((s.value || 0) / max) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" stroke="#60a5fa" strokeWidth={2} points={points} />
    </svg>
  )
}
