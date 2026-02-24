import { useState } from 'react'

export default function useCalculations() {
  const [materials, setMaterials] = useState<any[]>([])

  async function fetchMaterials() {
    try {
      const res = await fetch('/api/materials')
      const json = await res.json()
      setMaterials(json || [])
    } catch (err) {
      console.error('fetchMaterials', err)
    }
  }

  async function createCalculation(payload: any) {
    const res = await fetch('/api/calculations/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Calculation failed')
    return res.json()
  }

  async function fetchRecords() {
    const res = await fetch('/api/calculations/records')
    if (!res.ok) return []
    return res.json()
  }

  return { materials, fetchMaterials, createCalculation, fetchRecords }
}
