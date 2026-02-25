'use client';

import React, { useEffect, useState } from 'react';

export default function CalculatorPage() {
  const [materialId, setMaterialId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState('kg');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const materials = [
    { id: '1', name: 'Steel', category: 'Metals', emissionFactor: 2.13 },
    { id: '2', name: 'Aluminum', category: 'Metals', emissionFactor: 12.42 },
    { id: '3', name: 'Cement', category: 'Building', emissionFactor: 0.923 },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate calculation
    await new Promise(r => setTimeout(r, 500));
    const emissions = amount * 2.5; // Simple calc
    setResult({ emissions, scope: 'Scope 3', cbamRisk: 'Medium' });
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] via-[#0d131d] to-[#0f1724]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">🧮 Emissions</span>
            <br />
            <span className="text-gray-100">Calculator</span>
          </h1>
          <p className="text-gray-400 text-lg">Calculate carbon footprint from raw materials</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-8 bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-8">Enter Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">📦 Material</label>
                  <select
                    value={materialId}
                    onChange={(e) => setMaterialId(e.target.value)}
                    className="w-full rounded-lg bg-white/10 border border-white/20 hover:border-white/40 focus:border-indigo-400 focus:bg-white/15 px-4 py-3 text-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                  >
                    <option value="">Choose a material...</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name} - {m.category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">📏 Quantity</label>
                  <input
                    type="number"
                    step="0.001"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="w-full rounded-lg bg-white/10 border border-white/20 hover:border-white/40 focus:border-indigo-400 focus:bg-white/15 px-4 py-3 text-gray-100 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">⚖️ Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full rounded-lg bg-white/10 border border-white/20 hover:border-white/40 focus:border-indigo-400 focus:bg-white/15 px-4 py-3 text-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="ton">Metric Ton (t)</option>
                    <option value="m3">Cubic Meter (m³)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading || !materialId}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2">⚡</span>
                      Calculating...
                    </span>
                  ) : (
                    <>📊 Calculate Emissions</>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {result ? (
              <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">📊 Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Total Emissions</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      {result.emissions?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">kg CO₂e</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">CBAM Risk</p>
                    <p className="text-2xl font-bold text-orange-300">{result.cbamRisk}</p>
                    <p className="text-xs text-gray-500 mt-1">Risk Level</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 border-dashed flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-400 text-lg">Fill in the form and calculate to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
