import type { NextApiRequest, NextApiResponse } from 'next'

type Req = {
  activity: number
  unit: string
  country?: string
  gwp?: number
}

function unitToBase(value:number, unit:string){
  // base: kg
  switch(unit){
    case 'ton': return value * 1000
    case 'kg': return value
    case 'm3': return value // assume m3 already compatible for demo
    case 'liter': return value * 0.001 * 1000 // approximate: liters -> m3 -> kg (water) -> kg
    default: return value
  }
}

export default function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const body:Req = req.body
  const activity = body.activity || 0
  const unit = body.unit || 'ton'
  const country = body.country || 'Other'
  const gwp = body.gwp ?? 1

  // Emission factor selection (kgCO2 per unit). For electricity these are per kWh; for demo we treat EF as kgCO2 per ton or per unit.
  let ef = 0.55 // default Pakistan like example
  if(country === 'Germany') ef = 0.38
  if(country === 'Other') ef = 0.45

  const activityKg = unitToBase(activity, unit)
  // E = A * EF * GWP ; EF is kgCO2 per activity unit (demo)
  const e_kg = activityKg * ef * gwp
  const e_ton = e_kg / 1000

  // Market prices (mock)
  const priceEu = 90
  const priceVcc = 5

  const credits_eu = e_ton * priceEu
  const credits_vcc = e_ton * priceVcc

  // CBAM risk simple rule (demo)
  const intensity = e_kg / Math.max(1, activityKg) // kgCO2 per unit-of-activity
  let cbamRisk:'Low'|'Medium'|'High' = 'Low'
  if(intensity > 200) cbamRisk = 'High'
  else if(intensity > 50) cbamRisk = 'Medium'

  return res.json({ e_kg, e_ton, credits_eu, credits_vcc, cbamRisk })
}
