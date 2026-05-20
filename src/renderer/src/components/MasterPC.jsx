import React, { useState } from 'react'

export const MasterPC = ({ labId }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLab, setSelectedLab] = useState('Semua Lab')
  const [selectedPC, setSelectedPC] = useState(null)

  const pcData = [
    {
      id: 1,
      code: 'E4-PC-001',
      lab: 'E4',
      processor: 'Intel Core i5-10400',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      gpu: 'Intel UHD 630',
      status: 'Usable',
      lastMaintenance: '15/3/2026'
    },
    {
      id: 2,
      code: 'E4-PC-042',
      lab: 'E4',
      processor: 'Intel Core i5-10400',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      gpu: 'Intel UHD 630',
      status: 'Usable',
      lastMaintenance: '7/5/2026'
    },
    {
      id: 3,
      code: 'L4-PC-015',
      lab: 'L4',
      processor: 'Intel Core i3-10100',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      gpu: 'Intel UHD 630',
      status: 'Maintenance',
      lastMaintenance: '6/5/2026'
    },
    {
      id: 4,
      code: 'L4-PC-032',
      lab: 'L4',
      processor: 'Intel Core i5-9400',
      ram: '8GB DDR4',
      storage: '500GB HDD',
      gpu: 'Intel UHD 630',
      status: 'Broken',
      lastMaintenance: '20/4/2026'
    },
    {
      id: 5,
      code: 'L3-PC-028',
      lab: 'L3',
      processor: 'Intel Core i3-9100',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      gpu: 'Intel UHD 630',
      status: 'Usable',
      lastMaintenance: '6/5/2026'
    }
  ]

  const getStatusBadgeStyle = (status) => {
    const styles = {
      Usable: 'bg-green-100 text-green-700',
      Maintenance: 'bg-orange-100 text-orange-700',
      Broken: 'bg-red-100 text-red-700'
    }
    return styles[status] || 'bg-slate-100 text-slate-700'
  }

  const labs = ['Semua Lab', 'E4', 'L4', 'L3', 'L2']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Master PC</h2>
          <p className="text-slate-500 text-sm mt-1">Manajemen data PC laboratorium komputer</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md">
          <span className="text-lg">+</span> Tambah PC
        </button>
      </div>

      {/* Search & Filter */}
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
            placeholder="Cari PC code atau processor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="relative min-w-max">
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none pr-10 cursor-pointer transition-all"
          >
            {labs.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-4 px-6 font-semibold text-slate-700">PC Code</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Lab</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Processor</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">RAM</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Storage</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">GPU</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">
                  Last Maintenance
                </th>
              </tr>
            </thead>
            <tbody>
              {pcData.map((pc) => (
                <tr
                  key={pc.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedPC(pc)}
                >
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-900">{pc.code}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-blue-600">{pc.lab}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{pc.processor}</td>
                  <td className="py-4 px-6 text-slate-700">{pc.ram}</td>
                  <td className="py-4 px-6 text-slate-700">{pc.storage}</td>
                  <td className="py-4 px-6 text-slate-700">{pc.gpu}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(pc.status)}`}
                    >
                      {pc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{pc.lastMaintenance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PC Detail Modal */}
      {selectedPC && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          onClick={() => setSelectedPC(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-blue-100">PC DETAIL</p>
                <h3 className="text-3xl font-bold mt-2">{selectedPC.code}</h3>
                <p className="text-blue-100 text-sm mt-2">Lab {selectedPC.lab}</p>
              </div>
              <button
                onClick={() => setSelectedPC(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Processor (CPU)
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{selectedPC.processor}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Memory (RAM)
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{selectedPC.ram}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Storage
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{selectedPC.storage}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Graphics (GPU)
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{selectedPC.gpu}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusBadgeStyle(selectedPC.status)}`}
                    >
                      {selectedPC.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-8 flex gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md active:scale-95">
                  Update Specification
                </button>
                <button className="flex-1 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-3 rounded-lg transition-all">
                  View Damage Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
