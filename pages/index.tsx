import React from 'react'
import Calculator from '../components/Calculator'

export default function Home(){
  return (
    <div className="app-container">
      <div className="page-grid">
        <div>
          <Calculator />
        </div>
        <div>
          <div className="glass-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:800}}>Credit Wallet</div>
                <div className="small-muted">Total: $12,450 (mock)</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:18,fontWeight:800}}>1,382 tCO₂</div>
                <div className="small-muted">Accumulated</div>
              </div>
            </div>
          </div>

          <div style={{height:16}} />
          <div className="glass-card">
            <div style={{fontWeight:800}}>Carbon Velocity</div>
            <div className="small-muted">Emissions per minute (mock)</div>
            <div style={{height:12}} />
            <div style={{fontSize:28,fontWeight:800}}>4.2 kg/min</div>
          </div>
        </div>
      </div>
    </div>
  )
}
