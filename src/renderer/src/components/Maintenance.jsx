import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Badge } from './Badge'

export const Maintenance = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedPC, setSelectedPC] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    pcCode: '',
    issue: '',
    component: '',
    priority: 'High',
    technician: '',
    expectedEnd: ''
  })
  const { user } = useOutletContext()
  const [brokenPCs, setBrokenPCs] = useState([])

  useEffect(() => {
    const fetchBrokenPCs = async () => {
      try {
        const labId = user?.role_name === 'SuperAdmin' ? null : user?.lab_id
        const pcs = await window.api.getPCs(labId)
        const filtered = pcs.filter(pc => pc.STATUS === 'Broken')
        setBrokenPCs(filtered)
      } catch (error) {
        console.error("Error fetching broken PCs:", error)
      }
    }
    fetchBrokenPCs()
  }, [user])

  const maintenanceData = [
    {
      id: 1,
      mntId: 'MNT-2026-0147',
      pcCode: 'E4-PC-042',
      issue: 'RAM rusak, tidak detect',
      component: 'RAM DDR4 8GB',
      priority: 'High',
      reportedBy: 'Admin E4',
      reportDate: '15/5/2026',
      startDate: '16/5/2026',
      expectedEnd: '17/5/2026',
      status: 'Completed',
      technician: 'Budi Santoso'
    },
    {
      id: 2,
      mntId: 'MNT-2026-0146',
      pcCode: 'L4-PC-015',
      issue: 'HDD bad sector, sistem lambat',
      component: 'SSD 256GB',
      priority: 'High',
      reportedBy: 'Admin L4',
      reportDate: '14/5/2026',
      startDate: '15/5/2026',
      expectedEnd: '18/5/2026',
      status: 'In Progress',
      technician: 'Ahmad Rifai'
    },
    {
      id: 3,
      mntId: 'MNT-2026-0145',
      pcCode: 'L3-PC-028',
      issue: 'PSU mati total, tidak power on',
      component: 'PSU 600W',
      priority: 'Critical',
      reportedBy: 'Admin L3',
      reportDate: '14/5/2026',
      startDate: '14/5/2026',
      expectedEnd: '15/5/2026',
      status: 'Completed',
      technician: 'Siti Rahmah'
    },
    {
      id: 4,
      mntId: 'MNT-2026-0144',
      pcCode: 'E4-PC-067',
      issue: 'Motherboard tidak booting',
      component: 'Motherboard H510',
      priority: 'Critical',
      reportedBy: 'Admin E4',
      reportDate: '13/5/2026',
      startDate: '13/5/2026',
      expectedEnd: '14/5/2026',
      status: 'Completed',
      technician: 'Budi Santoso'
    },
    {
      id: 5,
      mntId: 'MNT-2026-0143',
      pcCode: 'L4-PC-032',
      issue: 'Fan CPU bersuara aneh',
      component: 'CPU Fan',
      priority: 'Medium',
      reportedBy: 'Admin L4',
      reportDate: '12/5/2026',
      startDate: '18/5/2026',
      expectedEnd: '19/5/2026',
      status: 'Scheduled',
      technician: 'Ahmad Rifai'
    },
    {
      id: 6,
      mntId: 'MNT-2026-0142',
      pcCode: 'L3-PC-015',
      issue: 'Monitor tidak menampilkan',
      component: 'Monitor ASUS',
      priority: 'High',
      reportedBy: 'Admin L3',
      reportDate: '11/5/2026',
      startDate: '19/5/2026',
      expectedEnd: '20/5/2026',
      status: 'Scheduled',
      technician: 'Pending'
    }
  ]

  const statuses = ['All Status', 'Completed', 'In Progress', 'Scheduled', 'On Hold']

  const getStatusColor = (status) => {
    const colors = {
      Completed: 'bg-green-100 text-green-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      Scheduled: 'bg-yellow-100 text-yellow-700',
      'On Hold': 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-slate-100 text-slate-700'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      Critical: 'text-red-600 font-bold',
      High: 'text-orange-600 font-bold',
      Medium: 'text-yellow-600',
      Low: 'text-green-600'
    }
    return colors[priority] || 'text-slate-600'
  }

  const getPriorityBg = (priority) => {
    const colors = {
      Critical: 'bg-red-50',
      High: 'bg-orange-50',
      Medium: 'bg-yellow-50',
      Low: 'bg-green-50'
    }
    return colors[priority] || 'bg-slate-50'
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Maintenance</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manajemen pemeliharaan dan perbaikan hardware laboratorium
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md"
        >
          <span className="text-lg">+</span> Buat Maintenance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Maintenance',
            value: maintenanceData.length,
            icon: '🔧',
            color: 'from-blue-50 to-blue-100'
          },
          {
            label: 'Completed',
            value: maintenanceData.filter((m) => m.status === 'Completed').length,
            icon: '✓',
            color: 'from-green-50 to-green-100'
          },
          {
            label: 'In Progress',
            value: maintenanceData.filter((m) => m.status === 'In Progress').length,
            icon: '⚙️',
            color: 'from-yellow-50 to-yellow-100'
          },
          {
            label: 'Critical',
            value: maintenanceData.filter((m) => m.priority === 'Critical').length,
            icon: '⚠️',
            color: 'from-red-50 to-red-100'
          }
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl border border-white/50 shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-slate-800 mt-2">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

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
            placeholder="Cari PC code, issue, atau technician..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="relative min-w-max">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none pr-10 cursor-pointer transition-all"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-4 px-6 font-semibold text-slate-700">ID</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">PC Code</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Issue</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Priority</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Technician</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Start Date</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceData.map((mnt) => (
                <tr
                  key={mnt.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${getPriorityBg(mnt.priority)}`}
                  onClick={() => setSelectedPC(mnt)}
                >
                  <td className="py-4 px-6 font-semibold text-slate-900">{mnt.mntId}</td>
                  <td className="py-4 px-6 font-semibold text-blue-600">{mnt.pcCode}</td>
                  <td className="py-4 px-6 text-slate-700">{mnt.issue}</td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold ${getPriorityColor(mnt.priority)}`}>
                      {mnt.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mnt.status)}`}
                    >
                      {mnt.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{mnt.technician}</td>
                  <td className="py-4 px-6 text-slate-700">{mnt.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
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
                <p className="text-sm font-semibold text-blue-100">MAINTENANCE DETAIL</p>
                <h3 className="text-3xl font-bold mt-2">{selectedPC.mntId}</h3>
                <p className="text-blue-100 text-sm mt-2">PC: {selectedPC.pcCode}</p>
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
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Issue
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{selectedPC.issue}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Component
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{selectedPC.component}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Priority
                  </p>
                  <p className={`text-lg font-semibold ${getPriorityColor(selectedPC.priority)}`}>
                    {selectedPC.priority}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Status
                  </p>
                  <span
                    className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(selectedPC.status)}`}
                  >
                    {selectedPC.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Technician
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{selectedPC.technician}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Reported By
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{selectedPC.reportedBy}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Report Date</p>
                  <p className="font-bold text-slate-900">{selectedPC.reportDate}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Start Date</p>
                  <p className="font-bold text-slate-900">{selectedPC.startDate}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Expected End</p>
                  <p className="font-bold text-slate-900">{selectedPC.expectedEnd}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md active:scale-95">
                  Update Status
                </button>
                <button className="flex-1 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-3 rounded-lg transition-all">
                  View Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Maintenance Modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-blue-100">BUAT MAINTENANCE BARU</p>
                <h3 className="text-3xl font-bold mt-2">Form Laporan</h3>
                <p className="text-blue-100 text-sm mt-2">Isi informasi pemeliharaan hardware</p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
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

            <div className="p-8 space-y-6 max-h-[600px] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">PC Code</label>
                <select
                  value={formData.pcCode}
                  onChange={(e) => setFormData({ ...formData, pcCode: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
                >
                  <option value="">Pilih PC (Hanya Status Broken)</option>
                  {brokenPCs.map(pc => (
                    <option key={pc.pc_id} value={pc.pc_code}>{pc.pc_code} - Lab {pc.lab_code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Issue / Masalah
                </label>
                <textarea
                  placeholder="Deskripsikan masalah yang terjadi..."
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Component</label>
                  <select
                    value={formData.component}
                    onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
                  >
                    <option value="">Pilih Komponen</option>
                    <option value="RAM">RAM</option>
                    <option value="SSD">SSD</option>
                    <option value="HDD">HDD</option>
                    <option value="PSU">PSU</option>
                    <option value="Motherboard">Motherboard</option>
                    <option value="CPU Fan">CPU Fan</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Keyboard">Keyboard</option>
                    <option value="Mouse">Mouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Technician</label>
                  <select
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
                  >
                    <option value="">Pilih Teknisi</option>
                    <option value="Budi Santoso">Budi Santoso</option>
                    <option value="Ahmad Rifai">Ahmad Rifai</option>
                    <option value="Siti Rahmah">Siti Rahmah</option>
                    <option value="Roni Hermawan">Roni Hermawan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Expected End Date
                  </label>
                  <input
                    type="date"
                    value={formData.expectedEnd}
                    onChange={(e) => setFormData({ ...formData, expectedEnd: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex gap-4">
                <button
                  onClick={() => {
                    setFormData({
                      pcCode: '',
                      issue: '',
                      component: '',
                      priority: 'High',
                      technician: '',
                      expectedEnd: ''
                    })
                    setShowAddForm(false)
                    alert('✓ Maintenance berhasil dibuat!')
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md active:scale-95"
                >
                  Buat Maintenance
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-3 rounded-lg transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
