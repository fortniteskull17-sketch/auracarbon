import React, { useEffect, useState } from 'react'
import useCalculations from '../../hooks/useCalculations'
import { exportCsv } from '../../lib/export'
import { printPdf } from '../../lib/exportPdf'

export default function RecordsPage() {
  const { fetchRecords } = useCalculations()
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => { (async () => setRecords(await fetchRecords()))() }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Records</h2>
      <div className="mb-4 flex gap-2">
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => exportCsv(records, 'records.csv')}>Export CSV</button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => printPdf(records)}>Print / Save PDF</button>
      </div>

      <div className="space-y-2">
        {records.map((r: any) => (
          <div key={r.id} className="p-3 bg-white/6 rounded">
            <div className="text-sm">{new Date(r.createdAt).toLocaleString()}</div>
            <div className="font-medium">Total: {r.totalKg ?? r.totalEmissionsKg} kg CO2e</div>
          </div>
        ))}
      </div>
    </div>
  )
}
