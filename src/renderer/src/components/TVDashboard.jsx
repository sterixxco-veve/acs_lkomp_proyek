import React, { useState, useEffect } from 'react'
import { Icons } from '../lib/Icons'

export const TVDashboard = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      label: 'Total PC',
      value: '225',
      icon: <Icons.Monitor />,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      label: 'Active',
      value: '195',
      icon: <Icons.TrendingUp />,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    { label: 'Broken', value: '11', icon: <Icons.Alert />, color: 'text-red-500', bg: 'bg-red-50' },
    {
      label: 'Maintenance',
      value: '19',
      icon: <Icons.Build />,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    }
  ]

  // Helper to generate PCs with specific statuses
  const generatePCs = (count, manualStatuses = {}) => {
    return Array.from({ length: count }, (_, i) => {
      const id = String(i + 1).padStart(3, '0')
      const status = manualStatuses[id] || 'active'
      return { id, status }
    })
  }

  const labE4Statuses = {
    '005': 'maintenance',
    '022': 'maintenance',
    '025': 'maintenance',
    '078': 'maintenance',
    '079': 'maintenance',
    '027': 'broken'
  }

  const labL4Statuses = {
    '004': 'maintenance',
    '015': 'broken',
    '026': 'maintenance',
    '031': 'maintenance',
    '043': 'maintenance',
    '044': 'maintenance',
    '045': 'maintenance',
    '007': 'broken',
    '048': 'broken',
    '072': 'broken',
    '074': 'broken',
    '077': 'broken',
    '079': 'maintenance',
    '080': 'maintenance'
  }

  const labL3Statuses = {
    '002': 'broken',
    '003': 'maintenance',
    '007': 'broken',
    '009': 'maintenance',
    '015': 'maintenance',
    '031': 'maintenance',
    '032': 'broken',
    '041': 'maintenance',
    '053': 'broken',
    '056': 'maintenance'
  }

  const labs = [
    { name: 'Lab E4', units: 80, pcs: generatePCs(80, labE4Statuses) },
    { name: 'Lab L4', units: 80, pcs: generatePCs(80, labL4Statuses) },
    { name: 'Lab L3', units: 65, pcs: generatePCs(65, labL3Statuses) }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-[#10b981] text-white' // green
      case 'broken':
        return 'bg-[#ef4444] text-white' // red
      case 'maintenance':
        return 'bg-[#f97316] text-white' // orange
      default:
        return 'bg-gray-200 text-gray-500'
    }
  }

  return (
    <div className="bg-[#f8fafc] text-slate-800 font-sans pb-10">
      {/* Header */}
      <div className="bg-[#5c7cfa] rounded-2xl p-6 mb-6 text-white shadow-sm flex justify-between items-center relative overflow-hidden">
        {/* subtle background graphic */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-0.5">Lkomp Hardware Overview</h1>
            <p className="text-blue-100 text-sm font-medium">Real-Time Monitoring Dashboard</p>
          </div>
        </div>

        <div className="text-right relative z-10">
          <div className="flex items-center gap-2 text-2xl font-bold justify-end mb-0.5">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {time
              .toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })
              .replace(/\./g, ':')}
          </div>
          <p className="text-blue-100 text-sm font-medium">
            {time.toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content (Grid ~75%) */}
        <div className="flex-1 min-w-0">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800 leading-none">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Labs Grids */}
          <div className="space-y-6">
            {labs.map((lab) => (
              <div
                key={lab.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-bold text-[#5c7cfa]">{lab.name}</h2>
                  <span className="text-xs font-medium text-slate-500">({lab.units} units)</span>
                </div>
                <div className="grid grid-cols-10 gap-2">
                  {lab.pcs.map((pc) => (
                    <div
                      key={pc.id}
                      className={`aspect-[4/3] rounded flex items-center justify-center text-[10px] font-bold ${getStatusColor(pc.status)}`}
                    >
                      {pc.id}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl py-4 mt-6 shadow-sm border border-slate-200 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#10b981]"></div>
              <span className="text-sm font-semibold text-slate-700">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#ef4444]"></div>
              <span className="text-sm font-semibold text-slate-700">Broken</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#f97316]"></div>
              <span className="text-sm font-semibold text-slate-700">Maintenance</span>
            </div>
          </div>
        </div>

        {/* Sidebar (Live Activity Feed ~25%) */}
        <div className="w-[300px] shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-4">
            <div className="flex items-center gap-3 mb-6">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-800"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <h2 className="text-lg font-bold text-slate-800">Live Activity Feed</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10b981]"></div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                  <p className="text-[13px] font-bold text-slate-700">Maintenance completed</p>
                </div>
                <p className="text-xs text-slate-500 mb-1 ml-3.5">E4-PC-042</p>
                <p className="text-[10px] font-medium text-slate-400 ml-3.5">10:30:15</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ef4444]"></div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></div>
                  <p className="text-[13px] font-bold text-slate-700">PC marked as broken</p>
                </div>
                <p className="text-xs text-slate-500 mb-1 ml-3.5">L4-PC-015</p>
                <p className="text-[10px] font-medium text-slate-400 ml-3.5">10:25:42</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
