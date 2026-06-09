import React from 'react'

import { MasterPC } from '../MasterPC'
import { MasterComponents } from '../MasterComponents'
import { MasterSoftware } from '../MasterSoftware'

export const SuperAdminDashboard = ({ user, activeMenu }) => {
  return (
    // Kita hapus w-full dan h-screen karena sudah di-handle oleh flex-1 di Dashboard.jsx
    <div className="p-8 w-full">
      {/* RENDER KOMPONEN BERDASARKAN MENU YANG DIKLIK DARI SIDEBAR */}

      {/* Jika value dari sidebar adalah 'Dashboard' */}
      {activeMenu === 'Dashboard' && (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-4xl font-bold text-[#1E293B] mb-2">SuperAdmin Dashboard</h2>
          <p className="text-[#64748B] mb-8">Full monitoring seluruh laboratorium</p>
          <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm text-slate-400 flex items-center justify-center h-64 font-medium tracking-widest uppercase">
            Global Dashboard Content
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

      {/* Tambahkan untuk menu lainnya nanti (Maintenance, Reports, dll) */}
      {activeMenu === 'Maintenance' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Halaman Maintenance (Coming Soon)</h2>
        </div>
      )}
    </div>
  )
}
