'use client';

import React, { useEffect, useState } from 'react';

interface Material {
  id: string;
  name: string;
  category: string;
  emissionFactor: number;
  unit: string;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: 'Steel', category: 'Metals', emissionFactor: 2.13, unit: 'kg/kg' },
    { id: '2', name: 'Aluminum', category: 'Metals', emissionFactor: 12.42, unit: 'kg/kg' },
    { id: '3', name: 'Cement', category: 'Building Materials', emissionFactor: 0.923, unit: 'kg/kg' },
    { id: '4', name: 'Concrete', category: 'Building Materials', emissionFactor: 0.098, unit: 'kg/kg' },
    { id: '5', name: 'Glass', category: 'Building Materials', emissionFactor: 1.14, unit: 'kg/kg' },
    { id: '6', name: 'Plastic (generic)', category: 'Plastics', emissionFactor: 6.28, unit: 'kg/kg' },
    { id: '7', name: 'Paper', category: 'Paper', emissionFactor: 1.36, unit: 'kg/kg' },
    { id: '8', name: 'Wood (softwood)', category: 'Wood', emissionFactor: 0.28, unit: 'kg/kg' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = Array.from(new Set(materials.map(m => m.category)));
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] via-[#0d131d] to-[#0f1724]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">⚙️ Materials</span>
            <br />
            <span className="text-gray-100">Library</span>
          </h1>
          <p className="text-gray-400 text-lg">Browse emission factors for 50+ materials across 150 countries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">🔍 Search Materials</label>
            <input
              type="text"
              placeholder="Filter by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/20 hover:border-white/40 focus:border-blue-400 focus:bg-white/15 px-4 py-3 text-gray-100 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">📦 Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/20 hover:border-white/40 focus:border-blue-400 focus:bg-white/15 px-4 py-3 text-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
            >
              <option value="">All categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="p-3 bg-white/8 rounded-lg border border-white/20 w-full text-center">
              <p className="text-2xl font-bold text-blue-300">{filteredMaterials.length}</p>
              <p className="text-xs text-gray-400">Materials found</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill(null).map((_, i) => (
              <div key={i} className="p-6 bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-3"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material, idx) => (
              <div
                key={material.id}
                className="group p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-blue-400 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors flex-1">{material.name}</h3>
                  <span className="text-2xl ml-2">⚙️</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Category</p>
                    <p className="text-sm text-gray-300 font-medium">{material.category}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Emission Factor</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      {material.emissionFactor.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">kg CO₂e per unit</p>
                  </div>

                  {material.unit && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Unit</p>
                      <p className="text-sm text-gray-300">{material.unit}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 border-dashed text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">No materials found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
