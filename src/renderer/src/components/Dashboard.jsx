import React, { useState } from 'react'

import { Sidebar } from '../components/Sidebar'

import { SuperAdminDashboard } from '../components/dashboard/SuperAdminDashboard'
import { LabAdminDashboard } from '../components/dashboard/LabAdminDashboard'
import { SekretarisDashboard } from '../components/dashboard/SekretarisDashboard'
import MasterPeminjam from '../components/MasterPeminjam'

export function Dashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('Surat Peminjaman')

  const isSuperAdmin = user.role_name === 'SuperAdmin'
  const isSekretaris = user.role_name === 'Sekretaris'
  const isAdminLab =
    user.role_name.includes('Admin') &&
    user.role_name !== 'SuperAdmin'

  return (
    <div className="flex bg-[#F5F7FB] min-h-screen">
      <Sidebar
        user={user}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={onLogout}
      />

      <div className="flex-1 overflow-y-auto">
        {/* SUPER ADMIN */}
        {isSuperAdmin && (
          <SuperAdminDashboard
            user={user}
            activeMenu={activeMenu}
          />
        )}

        {/* ADMIN LAB */}
        {isAdminLab && (
          <LabAdminDashboard
            user={user}
            activeMenu={activeMenu}
          />
        )}

        {/* SEKRETARIS */}
        {isSekretaris && (
          <>
            {activeMenu === 'Surat Peminjaman' && (
              <SekretarisDashboard
                user={user}
                activeMenu={activeMenu}
              />
            )}

            {activeMenu === 'Master Peminjam' && (
              <MasterPeminjam />
            )}
          </>
        )}
      </div>
    </div>
  )
}