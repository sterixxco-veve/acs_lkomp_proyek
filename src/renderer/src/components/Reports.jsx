import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Icons } from '../lib/Icons'

export default function Reports() {
  const healthData = [
    { name: 'Lab E4', usable: 0, broken: 0, maintenance: 70 },
    { name: 'Lab L4', usable: 0, broken: 0, maintenance: 65 },
    { name: 'Lab L3', usable: 0, broken: 0, maintenance: 55 }
  ]

  const trendData = [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 15 },
    { month: 'Mar', value: 18 },
    { month: 'Apr', value: 14 },
    { month: 'May', value: 23 },
    { month: 'Jun', value: 19 }
  ]

  const pieData = [
    { name: 'RAM DDR4 8GB', value: 28, color: '#3b82f6' },
    { name: 'HDD 500GB', value: 24, color: '#22c55e' },
    { name: 'PSU 500W', value: 20, color: '#ef4444' },
    { name: 'Motherboard', value: 17, color: '#f5b026' },
    { name: 'CPU Fan', value: 11, color: '#0ea5e9' }
  ]

  const stockAlerts = [
    { component: 'RAM DDR4 8GB', current: 8, min: 15, status: 'Critical' },
    { component: 'HDD 500GB', current: 5, min: 10, status: 'Critical' },
    { component: 'CPU Fan', current: 4, min: 8, status: 'Warning' }
  ]

  const reliabilityLog = Array.from({ length: 16 }, (_, i) => ({
    week: `W${i + 1}`,
    e4: [6, 9].includes(i) ? false : true,
    l4: [10, 11].includes(i) ? false : true,
    l3: [0, 2, 4, 5, 7, 9, 10, 11, 12, 15].includes(i) ? false : true
  }))

  const ExportButton = ({ label = 'Export' }) => (
    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
      <Icons.Download className="w-3 h-3" />
      {label}
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Analytics, reporting, dan reliability tracking
          </p>
        </div>
        <div className="flex gap-4">
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>2026-</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>All Labs</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
        {/* Health Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-900">Health Status per Lab</h2>
            <ExportButton />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  dx={-10}
                  domain={[0, 80]}
                  ticks={[0, 20, 40, 60, 80]}
                />
                <RechartsTooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar
                  dataKey="usable"
                  stackId="a"
                  fill="#22c55e"
                  barSize={32}
                  radius={[0, 0, 0, 0]}
                />
                <Bar dataKey="broken" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="maintenance" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#22c55e] rounded-sm"></div>
              <span className="text-xs text-[#22c55e] font-semibold">Usable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#ef4444] rounded-sm"></div>
              <span className="text-xs text-[#ef4444] font-semibold">Broken</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#f59e0b] rounded-sm"></div>
              <span className="text-xs text-[#f59e0b] font-semibold">Maintenance</span>
            </div>
          </div>
        </div>

        {/* Maintenance Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-900">Maintenance Trend (6 Months)</h2>
            <ExportButton />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  dx={-10}
                  domain={[0, 24]}
                  ticks={[0, 6, 12, 18, 24]}
                />
                <RechartsTooltip
                  cursor={false}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line
                  type="linear"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: '#3b82f6', stroke: 'white' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Replaced Components */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-900">Most Replaced Components</h2>
            <ExportButton />
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  paddingAngle={1}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Labels overlay to try match the non-recharts exact positioning */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[10%] right-[15%] text-[10px] font-bold text-[#3b82f6]">
                RAM DDR4 8GB (28%)
              </div>
              <div className="absolute top-[25%] left-[20%] text-[10px] font-bold text-[#22c55e]">
                HDD 500GB (24%)
              </div>
              <div className="absolute bottom-[20%] left-[25%] text-[10px] font-bold text-[#ef4444]">
                PSU 500W (20%)
              </div>
              <div className="absolute bottom-[10%] right-[25%] text-[10px] font-bold text-[#f59e0b]">
                Motherboard (17%)
              </div>
              <div className="absolute top-[45%] right-[10%] text-[10px] font-bold text-[#0ea5e9]">
                CPU Fan (11%)
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-900">Low Stock Alert</h2>
            <ExportButton />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 font-semibold text-gray-500">Component</th>
                  <th className="pb-3 font-semibold text-gray-500 text-center">Current Stock</th>
                  <th className="pb-3 font-semibold text-gray-500 text-center">Minimum Required</th>
                  <th className="pb-3 font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stockAlerts.map((item, i) => (
                  <tr key={i}>
                    <td className="py-4 text-gray-900 font-medium">{item.component}</td>
                    <td className="py-4 text-gray-700 text-center">{item.current}</td>
                    <td className="py-4 text-gray-700 text-center">{item.min}</td>
                    <td className="py-4">
                      {item.status === 'Critical' ? (
                        <span className="inline-flex px-2 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                          Critical
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-md text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100">
                          Warning
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reliability Log */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-gray-900">Reliability Log Semester (16 Weeks)</h2>
          <ExportButton label="Export PDF" />
        </div>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-500 border-r border-gray-100">
                  Week
                </th>
                <th className="py-3 px-4 font-semibold text-gray-500 text-center border-r border-gray-100">
                  Lab E4
                </th>
                <th className="py-3 px-4 font-semibold text-gray-500 text-center border-r border-gray-100">
                  Lab L4
                </th>
                <th className="py-3 px-4 font-semibold text-gray-500 text-center">Lab L3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reliabilityLog.map((log) => (
                <tr key={log.week}>
                  <td className="py-3 px-4 text-gray-900 font-medium border-r border-gray-100">
                    {log.week}
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-100">
                    <div className="flex justify-center">
                      {log.e4 ? (
                        <Icons.CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Icons.XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-100">
                    <div className="flex justify-center">
                      {log.l4 ? (
                        <Icons.CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Icons.XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      {log.l3 ? (
                        <Icons.CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Icons.XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-6 pt-4 border-t border-gray-100 bg-gray-50/50 p-4 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <Icons.CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500 font-medium">= Available (V)</span>
          </div>
          <div className="flex items-center gap-2">
            <Icons.XCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500 font-medium">= Not Available (X)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
