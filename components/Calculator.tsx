import React, { useState } from 'react'
import GlassCard from './GlassCard'

type Result = {
  e_kg: number
  e_ton: number
  credits_eu: number
  credits_vcc: number
  cbamRisk: 'Low'|'Medium'|'High'
}

export default function Calculator(){
  const [activity,setActivity] = useState('100')
  const [unit,setUnit] = useState('ton')
  const [country,setCountry] = useState('Pakistan')
  const [gwp,setGwp] = useState('1')
  const [result,setResult] = useState<Result| null>(null)
  const [loading,setLoading] = useState(false)

  async function onCalc(e:React.FormEvent){
    e.preventDefault()
    setLoading(true)
    const payload = { activity: Number(activity), unit, country, gwp: Number(gwp) }
    const res = await fetch('/api/mock/green-credits', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)})
    const json = await res.json()
    setResult(json)
    setLoading(false)
  }

  return (
    <div>
      <div className="header">
        <div>
          <div className="title">AuraCarbon — Quick Calculator</div>
          <div className="subtitle">Cradle-to-Gate · Demo UI</div>
        </div>
      </div>

      <GlassCard>
        <form onSubmit={onCalc}>
          <div className="input-row">
            <input value={activity} onChange={e=>setActivity(e.target.value)} aria-label="activity" />
            <select value={unit} onChange={e=>setUnit(e.target.value)}>
              <option value="ton">ton</option>
              <option value="kg">kg</option>
              <option value="m3">m3</option>
              <option value="liter">liter</option>
            </select>
          </div>

          <div className="input-row">
            <select value={country} onChange={e=>setCountry(e.target.value)}>
              <option>Pakistan</option>
              <option>Germany</option>
              <option>Other</option>
            </select>
            <input value={gwp} onChange={e=>setGwp(e.target.value)} aria-label="gwp" />
          </div>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div className="small-muted">Market: EU ETS ≈ $90/ton · VCC ≈ $5/ton</div>
            <button className="btn-primary" disabled={loading}>{loading? 'Calculating...':'Calculate'}</button>
          </div>
        </form>
      </GlassCard>

      <div style={{height:16}} />

      <GlassCard>
        {result ? (
          <div>
            <div className="result-value">{result.e_ton.toFixed(3)} tCO₂</div>
            <div className="small-muted">{result.e_kg.toFixed(1)} kgCO₂</div>
            <div style={{height:12}} />
            <div>Estimated Credits:</div>
            <div style={{display:'flex',gap:12,marginTop:8}}>
              <div style={{flex:1}} className="glass-card">
                <div className="small-muted">EU ETS</div>
                <div className="result-value">${result.credits_eu.toFixed(2)}</div>
              </div>
              <div style={{flex:1}} className="glass-card">
                <div className="small-muted">Voluntary</div>
                <div className="result-value">${result.credits_vcc.toFixed(2)}</div>
              </div>
            </div>
            <div style={{height:12}} />
            <div>CBAM Risk: <strong>{result.cbamRisk}</strong></div>
          </div>
        ) : (
          <div className="small-muted">Enter values and press Calculate to see results.</div>
        )}
      </GlassCard>
    </div>
  )
}
