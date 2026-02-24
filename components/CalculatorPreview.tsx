import React from 'react'

export default function CalculatorPreview({ result }: { result: any }) {
  if (!result) return <div className="p-4 bg-white/4 rounded">No calculation yet</div>

  return (
    <div className="p-4 bg-white/6 rounded">
      <h3 className="text-lg font-medium">Result</h3>
      <div className="mt-2">
        <div>Emissions: <strong>{result.totalEmissionsKg ?? result.totalKg ?? '—'}</strong> kg CO2e</div>
        <div>Scope breakdown:</div>
        <pre className="mt-2 text-sm bg-white/3 p-2 rounded">{JSON.stringify(result.scopeBreakdown || {}, null, 2)}</pre>
      </div>
    </div>
  )
}
