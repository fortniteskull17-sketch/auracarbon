import React from 'react'

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * Math.PI / 180.0
  return { x: cx + (r * Math.cos(rad)), y: cy + (r * Math.sin(rad)) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
}

export default function PieChart({ data, size = 180 }: { data: { label: string; value: number; color?: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0)
  let angle = 0
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 2

  return (
    <div style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const portion = total === 0 ? 0 : (d.value / total) * 360
          const start = angle
          const end = angle + portion
          angle += portion
          const path = describeArc(cx, cy, r, start, end)
          return <path key={i} d={path} fill={d.color || `hsl(${(i*60)%360} 70% 50%)`} />
        })}
      </svg>

      <div style={{ fontSize: 12, marginTop: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ width: 12, height: 12, background: d.color || `hsl(${(i*60)%360} 70% 50%)`, display: 'inline-block' }} />
            <span style={{ color: '#ddd' }}>{d.label}: {d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
