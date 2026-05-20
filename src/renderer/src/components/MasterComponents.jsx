import React, { useState } from 'react'

export const MasterComponents = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('Semua Tipe')

  const componentsData = [
    {
      id: 1,
      name: 'RAM DDR4 8GB',
      brand: 'Kingston',
      type: 'RAM',
      stock: 8,
      minStock: 15,
      condition: 'New',
      icon: '🖥️'
    },
    {
      id: 2,
      name: 'RAM DDR4 16GB',
      brand: 'Corsair',
      type: 'RAM',
      stock: 22,
      minStock: 10,
      condition: 'New',
      icon: '🖥️'
    },
    {
      id: 3,
      name: 'SSD 256GB SATA',
      brand: 'Samsung',
      type: 'SSD',
      stock: 18,
      minStock: 12,
      condition: 'New',
      icon: '💾'
    },
    {
      id: 4,
      name: 'HDD 500GB',
      brand: 'WD Blue',
      type: 'HDD',
      stock: 5,
      minStock: 10,
      condition: 'New',
      icon: '💿'
    },
    {
      id: 5,
      name: 'PSU 600W',
      brand: 'Corsair',
      type: 'PSU',
      stock: 12,
      minStock: 8,
      condition: 'New',
      icon: '⚡'
    },
    {
      id: 6,
      name: 'Motherboard H510',
      brand: 'Asus',
      type: 'Motherboard',
      stock: 6,
      minStock: 5,
      condition: 'New',
      icon: '🔌'
    },
    {
      id: 7,
      name: 'CPU Fan',
      brand: 'Cooler Master',
      type: 'Cooling',
      stock: 4,
      minStock: 8,
      condition: 'New',
      icon: '❄️'
    }
  ]

  const types = ['Semua Tipe', 'RAM', 'SSD', 'HDD', 'PSU', 'Motherboard', 'Cooling']

  const getLowStockItems = () => componentsData.filter((c) => c.stock < c.minStock)

  const getTypeColor = (type) => {
    const colors = {
      RAM: 'bg-blue-100 text-blue-600',
      SSD: 'bg-purple-100 text-purple-600',
      HDD: 'bg-orange-100 text-orange-600',
      PSU: 'bg-green-100 text-green-600',
      Motherboard: 'bg-indigo-100 text-indigo-600',
      Cooling: 'bg-cyan-100 text-cyan-600'
    }
    return colors[type] || 'bg-slate-100 text-slate-600'
  }

  const getStockStatus = (stock, minStock) => {
    if (stock < minStock) return { text: 'Low Stock', color: 'text-red-600' }
    return { text: 'In Stock', color: 'text-green-600' }
  }

  const lowStockItems = getLowStockItems()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Master Components</h2>
          <p className="text-slate-500 text-sm mt-1">Manajemen inventory komponen hardware</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md">
          <span className="text-lg">+</span> Tambah Komponen
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">⚠️</div>
          <div>
            <h3 className="font-semibold text-red-900">
              Low Stock Alert ({lowStockItems.length} items)
            </h3>
            <p className="text-red-700 text-sm mt-1">
              {lowStockItems.map((i) => i.name).join(', ')} memerlukan restocking segera.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari nama komponen atau brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="relative min-w-max">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none pr-10 cursor-pointer transition-all"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {componentsData.map((component) => {
          const status = getStockStatus(component.stock, component.minStock)
          const stockPercent = (component.stock / component.minStock) * 100
          return (
            <div
              key={component.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{component.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-900">{component.name}</h3>
                    <p className="text-xs text-slate-500">{component.brand}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span
                  className={`inline-block text-xs font-semibold px-2 py-1 rounded ${getTypeColor(component.type)}`}
                >
                  {component.type}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-slate-600">Stock Level</p>
                    <p className="text-sm font-bold text-slate-900">{component.stock} units</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${component.stock < component.minStock ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(stockPercent, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-xs text-slate-600">Min: {component.minStock}</p>
                  <p className={`text-xs font-semibold ${status.color}`}>{status.text}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Inventory Detail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Component Name</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Brand</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Stock</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Min Stock</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Condition</th>
              </tr>
            </thead>
            <tbody>
              {componentsData.map((component) => (
                <tr
                  key={component.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-6 font-semibold text-slate-900">{component.name}</td>
                  <td className="py-4 px-6 text-slate-700">{component.brand}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-1 rounded ${getTypeColor(component.type)}`}
                    >
                      {component.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-bold ${component.stock < component.minStock ? 'text-red-600' : 'text-green-600'}`}
                    >
                      {component.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{component.minStock}</td>
                  <td className="py-4 px-6 text-slate-700">{component.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
