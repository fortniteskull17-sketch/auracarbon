import React from 'react'

export default function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/6 p-4 rounded">
      <div className="text-sm text-gray-300">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}
