import React from 'react'

import { MasterPC } from '../MasterPC'
import { MasterComponents } from '../MasterComponents'
import { MasterSoftware } from '../MasterSoftware'

export const LabAdminDashboard = ({ user, activeMenu }) => {
  return (
    <div className="p-8 w-full">
      {/* JIKA MENU DASHBOARD DIKLIK */}
      {activeMenu === 'Dashboard' && (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-4xl font-bold text-[#1E293B] mb-2">
            Dashboard Lab {user?.lab_name || user?.lab_id}
          </h2>
          <p className="text-[#64748B] mb-8">Monitoring dan manajemen khusus untuk ruangan Anda</p>
          <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm text-slate-400 flex items-center justify-center h-64 font-medium tracking-widest uppercase">
            Lab Admin Content Area
          </div>
        </div>
      )}

      {/* JIKA MENU MASTER PC DIKLIK */}
      {activeMenu === 'Master PC' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* SANGAT PENTING: Lempar data 'user' ke dalam MasterPC */}
          <MasterPC user={user} />
        </div>
      )}

      {/* JIKA MENU COMPONENTS DIKLIK */}
      {activeMenu === 'Components' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MasterComponents user={user} />
        </div>
      )}

      {/* JIKA MENU SOFTWARE DIKLIK */}
      {activeMenu === 'Software' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MasterSoftware user={user} />
        </div>
      )}

      {/* MENU LAINNYA */}
      {activeMenu === 'Maintenance' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Halaman Maintenance (Coming Soon)</h2>
        </div>
      )}
    </div>
  )
}
