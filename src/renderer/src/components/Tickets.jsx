import React, { useState, useEffect } from 'react'
import { Badge } from './Badge'

export const Tickets = () => {
  const [tickets, setTickets] = useState([])

  const electronAPI = {
    getTickets: async () => [
      {
        ticket_id: 'TKT-001',
        pc_code: 'A102',
        reporter: 'Mahasiswa',
        desc: 'Keyboard Rusak',
        date: '2026-03-26',
        status: 'open',
        severity: 'low'
      },
      {
        ticket_id: 'TKT-002',
        pc_code: 'B201',
        reporter: 'Dosen',
        desc: 'Monitor No Signal',
        date: '2026-03-27',
        status: 'in progress',
        severity: 'high'
      }
    ]
  }

  useEffect(() => {
    electronAPI.getTickets().then(setTickets)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Tiket Kerusakan</h2>
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Ticket ID</th>
              <th className="px-8 py-5">Unit</th>
              <th className="px-8 py-5">Masalah</th>
              <th className="px-8 py-5">Priority</th>
              <th className="px-8 py-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-medium">
            {tickets.map((t) => (
              <tr key={t.ticket_id} className="hover:bg-slate-50">
                <td className="px-8 py-5 text-slate-400">#{t.ticket_id}</td>
                <td className="px-8 py-5 font-bold">{t.pc_code}</td>
                <td className="px-8 py-5 text-slate-700">{t.desc}</td>
                <td className="px-8 py-5">
                  <Badge status={t.severity} />
                </td>
                <td className="px-8 py-5">
                  <Badge status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
