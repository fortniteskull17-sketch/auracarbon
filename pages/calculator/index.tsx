import React, { useEffect, useState } from 'react'
import CalculatorPreview from '../../components/CalculatorPreview'
import useCalculations from '../../hooks/useCalculations'
import PieChart from '../../components/PieChart'
import ChartCard from '../../components/ChartCard'

export default function CalculatorPage() {
  const { materials, fetchMaterials, createCalculation } = useCalculations()
  const [materialId, setMaterialId] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [unit, setUnit] = useState<string>('kg')
  const [result, setResult] = useState<any>(null)

  useEffect(() => { fetchMaterials() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { items: [{ materialId, quantity: amount, unit }] }
    const res = await createCalculation(payload)
    setResult(res)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Calculator</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span>Material</span>
            <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} className="w-full p-2 rounded-md bg-white/5">
              <option value="">Select material</option>
              {materials.map((m: any) => (
                <option key={m.id} value={m.id}>{m.name} — {m.category}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span>Amount</span>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-2 rounded-md bg-white/5" />
          </label>

          <label className="block">
            <span>Unit</span>
            <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full p-2 rounded-md bg-white/5">
              <option value="kg">kg</option>
              <option value="ton">ton</option>
              <option value="m3">m3</option>
            </select>
          </label>

          <button className="px-4 py-2 bg-indigo-600 rounded text-white">Calculate</button>
        </form>

        <div>
          <CalculatorPreview result={result} />

          <div className="mt-4">
            <ChartCard title="Scope breakdown">
              {result?.scopeBreakdown ? (
                <PieChart
                  data={Object.entries(result.scopeBreakdown).map(([k, v]: any, i) => ({ label: k, value: Number(v), color: undefined }))}
                  size={160}
                />
              ) : (
                <div className="p-4 text-sm">No breakdown available</div>
              )}
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  )
}
