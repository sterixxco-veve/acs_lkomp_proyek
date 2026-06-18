import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
// import { Settings } from '../Settings'
// import { MasterPC } from '../MasterPC'
// import { MasterComponents } from '../MasterComponents'
// import { MasterSoftware } from '../MasterSoftware'

export const LabAdminDashboard = () => {
  const {user} = useOutletContext()

  const [summary, setSummary] = useState({
    total_pc: 0,
    active_pc: 0,
    broken_pc: 0,
    maintenance_pc: 0
  })

  const [activities, setActivities] = useState([])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const dashboardData = await window.api.getDashboardSummary(user.lab_id)
      const activityData = await window.api.getLiveActivity()

      if (dashboardData) {
        setSummary(dashboardData)
      }

      setActivities(activityData || [])
    } catch (err) {
      console.error('Dashboard Error:', err)
    }
  }

  return (
    <div className="p-8 w-full">

      {/* DASHBOARD */}
      {/* {activeMenu === 'Dashboard' && ( */}
        <div className="animate-in fade-in duration-300">

          <h2 className="text-4xl font-bold text-[#1E293B] mb-2">
            Dashboard Lab {user?.lab_code}
          </h2>

          <p className="text-[#64748B] mb-8">
            Monitoring dan manajemen khusus untuk ruangan Anda
          </p>

          {/* CARD SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
              <p className="text-slate-500 text-sm">Total PC</p>
              <h3 className="text-4xl font-bold text-slate-800 mt-2">
                {summary.total_pc}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
              <p className="text-slate-500 text-sm">Active PC</p>
              <h3 className="text-4xl font-bold text-green-600 mt-2">
                {summary.active_pc}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
              <p className="text-slate-500 text-sm">Broken PC</p>
              <h3 className="text-4xl font-bold text-red-600 mt-2">
                {summary.broken_pc}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
              <p className="text-slate-500 text-sm">Maintenance PC</p>
              <h3 className="text-4xl font-bold text-yellow-600 mt-2">
                {summary.maintenance_pc}
              </h3>
            </div>

          </div>

          {/* STATUS SISTEM */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm mb-8">

            <h3 className="font-bold text-xl text-[#1E293B] mb-4">
              Status Sistem
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>PC Aktif</span>
                <span className="text-green-600 font-semibold">
                  {summary.active_pc}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Maintenance</span>
                <span className="text-yellow-600 font-semibold">
                  {summary.maintenance_pc}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Bermasalah</span>
                <span className="text-red-600 font-semibold">
                  {summary.broken_pc}
                </span>
              </div>

            </div>

          </div>

          {/* RECENT ACTIVITY */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">

            <h3 className="font-bold text-xl text-[#1E293B] mb-4">
              Recent Activity
            </h3>

            {activities.length === 0 ? (
              <div className="text-slate-500">
                Belum ada aktivitas maintenance.
              </div>
            ) : (
              <div className="space-y-3">

                {activities.map((item) => (
                  <div
                    key={item.maintenance_id}
                    className="border rounded-xl p-3"
                  >
                    <div className="font-semibold">
                      {item.pc_code}
                    </div>

                    <div className="text-sm text-slate-500">
                      Status : {item.maintenance_status}
                    </div>

                    <div className="text-xs text-slate-400">
                      {new Date(item.maintenance_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>

        </div>
      {/* )} */}

      

    </div>
  )
}