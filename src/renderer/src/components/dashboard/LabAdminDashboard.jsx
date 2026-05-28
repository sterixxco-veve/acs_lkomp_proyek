import React from 'react'

export function LabAdminDashboard({ user }) {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-2">{user.role_name} Dashboard</h1>

      <p className="text-slate-500 mb-6">Monitoring khusus lab</p>

      <div className="bg-white rounded-2xl p-6">LAB DASHBOARD CONTENT</div>
    </div>
  )
}
