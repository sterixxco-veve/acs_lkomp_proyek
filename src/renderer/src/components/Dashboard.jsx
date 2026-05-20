import React from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

const stats = [
  {
    title: 'Total PC',
    value: '225',
    icon: '🖥️',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Usable PC',
    value: '198',
    icon: '📈',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    percentage: '88%'
  },
  {
    title: 'Broken PC',
    value: '18',
    icon: '⚠️',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    percentage: '8%'
  },
  {
    title: 'Maintenance Active',
    value: '9',
    icon: '🔧',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Low Stock Components',
    value: '12',
    icon: '📦',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  }
]

const labHealthData = [
  { lab: 'Lab E4', usable: 72 },
  { lab: 'Lab L4', usable: 68 },
  { lab: 'Lab L3', usable: 58 }
]

const maintenanceTrend = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 15 },
  { month: 'Mar', count: 18 },
  { month: 'Apr', count: 14 },
  { month: 'May', count: 22 },
  { month: 'Jun', count: 19 }
]

const mostReplacedComponents = [
  { name: 'RAM DDR4 8GB', count: 45, color: '#5D7CEB' },
  { name: 'HDD 500GB', count: 38, color: '#22C55E' },
  { name: 'PSU 500W', count: 32, color: '#EF4444' },
  { name: 'Motherboard', count: 28, color: '#F59E0B' },
  { name: 'CPU Fan', count: 24, color: '#3B82F6' }
]

const recentMaintenance = [
  {
    id: 'MNT-2026-0147',
    pc: 'E4-PC-042',
    issue: 'RAM rusak, tidak detect',
    component: 'RAM DDR4 8GB (1 unit)',
    status: 'Completed'
  },
  {
    id: 'MNT-2026-0146',
    pc: 'L4-PC-015',
    issue: 'HDD bad sector',
    component: 'SSD 256GB (1 unit)',
    status: 'In Progress'
  },
  {
    id: 'MNT-2026-0145',
    pc: 'L3-PC-028',
    issue: 'PSU mati total',
    component: 'PSU 600W (1 unit)',
    status: 'Completed'
  },
  {
    id: 'MNT-2026-0144',
    pc: 'E4-PC-067',
    issue: 'Motherboard tidak booting',
    component: 'Motherboard H510 (1 unit)',
    status: 'Completed'
  }
]

const activityTimeline = [
  {
    time: '10:30',
    action: 'Maintenance completed',
    detail: 'E4-PC-042 - RAM replacement',
    user: 'Admin E4'
  },
  {
    time: '09:15',
    action: 'Maintenance started',
    detail: 'L4-PC-015 - HDD diagnostics',
    user: 'Admin L4'
  },
  {
    time: '08:45',
    action: 'New PC registered',
    detail: 'E4-PC-080 added to inventory',
    user: 'SuperAdmin'
  },
  {
    time: '08:20',
    action: 'Stock updated',
    detail: 'RAM DDR4 8GB - 15 units added',
    user: 'Admin E4'
  }
]

export function Dashboard({ userRole, userLab }) {
  return (
    <div className="p-6 bg-[#F5F7FB] min-h-screen">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[34px] font-bold text-[#000]">Dashboard Overview</h1>

          <p className="text-[#64748B] mt-1 text-[15px]">
            Real-time monitoring laboratorium komputer kampus
          </p>
        </div>

        <div className="flex items-center gap-2 text-[#64748B] text-sm">
          <span>🕒</span>
          <span>Last updated: {new Date().toLocaleTimeString('id-ID')}</span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center text-xl`}
              >
                {stat.icon}
              </div>

              {stat.percentage && (
                <span className={`text-sm font-semibold ${stat.textColor}`}>{stat.percentage}</span>
              )}
            </div>

            <p className="text-[#64748B] text-[15px] mb-1">{stat.title}</p>

            <h2 className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="space-y-6">
        {/* LAB HEALTH */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-[28px] font-bold text-[#1E293B] mb-6">Health Status per Lab</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={labHealthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="lab" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="usable" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* MAINTENANCE TREND */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-[28px] font-bold text-[#1E293B] mb-6">
            Maintenance Trend (6 Months)
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={maintenanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line type="monotone" dataKey="count" stroke="#5D7CEB" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* MOST REPLACED */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-[28px] font-bold text-[#1E293B] mb-6">Most Replaced Components</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={mostReplacedComponents} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />

              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />

              <Tooltip />

              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {mostReplacedComponents.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-[28px] font-bold text-[#1E293B] mb-6">Recent Maintenance</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left py-4 text-[#64748B]">ID</th>
                  <th className="text-left py-4 text-[#64748B]">PC Code</th>
                  <th className="text-left py-4 text-[#64748B]">Issue</th>
                  <th className="text-left py-4 text-[#64748B]">Component</th>
                  <th className="text-left py-4 text-[#64748B]">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentMaintenance.map((item) => (
                  <tr key={item.id} className="border-b border-[#F1F5F9]">
                    <td className="py-4">{item.id}</td>

                    <td className="py-4">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
                        {item.pc}
                      </span>
                    </td>

                    <td className="py-4 text-[#64748B]">{item.issue}</td>

                    <td className="py-4">{item.component}</td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          item.status === 'Completed'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-orange-50 text-orange-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-[28px] font-bold text-[#1E293B] mb-6">Activity Timeline</h2>

          <div className="space-y-5">
            {activityTimeline.map((activity, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  🔵
                </div>

                <div>
                  <p className="font-semibold text-[#1E293B]">{activity.action}</p>

                  <p className="text-[#64748B] text-sm">{activity.detail}</p>

                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <span className="text-[#64748B]">{activity.time}</span>

                    <span className="text-[#CBD5E1]">•</span>

                    <span className="text-[#5D7CEB]">{activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
