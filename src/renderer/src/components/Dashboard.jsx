import React, { useState } from 'react'

import { Sidebar } from '../components/Sidebar'

import { SuperAdminDashboard } from '../components/dashboard/SuperAdminDashboard'

import { LabAdminDashboard } from '../components/dashboard/LabAdminDashboard'

import { SekretarisDashboard } from '../components/dashboard/SekretarisDashboard'

export function Dashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const isSuperAdmin = user.role_name === 'SuperAdmin'

  const isSekretaris = user.role_name === 'Sekretaris'

  const isAdminLab = user.role_name.includes('Admin')

  return (
    <div className="flex bg-[#F5F7FB] min-h-screen">
      <Sidebar
        user={user}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={onLogout}
      />

      <div className="flex-1 overflow-y-auto">
        {isSuperAdmin && <SuperAdminDashboard user={user} activeMenu={activeMenu} />}

        {isAdminLab && !isSuperAdmin && <LabAdminDashboard user={user} activeMenu={activeMenu} />}

        {isSekretaris && <SekretarisDashboard user={user} activeMenu={activeMenu} />}
      </div>
    </div>
  )
}
