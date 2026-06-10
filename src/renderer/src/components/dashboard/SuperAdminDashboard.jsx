import React from 'react'
import { Settings } from '../Settings'
import { MasterPC } from '../MasterPC'
import { MasterComponents } from '../MasterComponents'
import { MasterSoftware } from '../MasterSoftware'
import { MaintenanceTransaction } from '../MaintenanceTransaction'
import { Reports } from '../Reports'

export const SuperAdminDashboard = ({ user, activeMenu }) => {
  return (
    // Kita hapus w-full dan h-screen karena sudah di-handle oleh flex-1 di Dashboard.jsx
    <div className="p-8 w-full">
      {/* RENDER KOMPONEN BERDASARKAN MENU YANG DIKLIK DARI SIDEBAR */}

      {/* Jika value dari sidebar adalah 'Dashboard' */}
      {activeMenu === 'Dashboard' && (
      <div className="animate-in fade-in duration-300">
        <h2 className="text-4xl font-bold text-[#1E293B] mb-2">
          SuperAdmin Dashboard
        </h2>

        <p className="text-[#64748B] mb-8">
          Monitoring seluruh laboratorium komputer
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm">Total PC</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">0</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm">Components</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">0</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm">Software</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">0</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm">Maintenance</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">0</h3>
          </div>
        </div>

        <div className="grid xl:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              System Status
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>PC Aktif</span>
                <span className="font-semibold text-green-600">0</span>
              </div>

              <div className="flex justify-between">
                <span>Maintenance</span>
                <span className="font-semibold text-yellow-600">0</span>
              </div>

              <div className="flex justify-between">
                <span>Bermasalah</span>
                <span className="font-semibold text-red-600">0</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Quick Access
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-2xl p-4">🖥️ Master PC</div>
              <div className="border rounded-2xl p-4">🔧 Components</div>
              <div className="border rounded-2xl p-4">💿 Software</div>
              <div className="border rounded-2xl p-4">🛠 Maintenance</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            Recent Activity
          </h3>

          <div className="text-slate-500">
            Belum ada aktivitas yang tercatat.
          </div>
        </div>
      </div>
    )}

      {/* Jika value dari sidebar adalah 'Master PC' */}
      {activeMenu === 'Master PC' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MasterPC user={user} />
        </div>
      )}

      {/* Jika value dari sidebar adalah 'Components' */}
      {activeMenu === 'Components' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MasterComponents user={user} />
        </div>
      )}

      {/* Jika value dari sidebar adalah 'Software' */}
      {activeMenu === 'Software' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MasterSoftware user={user} />
        </div>
      )}

      {activeMenu === 'Maintenance' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MaintenanceTransaction user={user} />
        </div>
      )}

      {activeMenu === 'Reports' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Reports user={user} />
        </div>
      )}

      {activeMenu === 'Settings' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Settings user={user} />
        </div>
      )}
    </div>
  )
}
