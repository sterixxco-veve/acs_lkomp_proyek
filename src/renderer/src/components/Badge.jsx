import React from 'react'

export const Badge = ({ status }) => {
  const styles = {
    active: 'bg-emerald-500 text-white',
    broken: 'bg-rose-500 text-white',
    maintenance: 'bg-amber-500 text-white',
    borrowed: 'bg-blue-600 text-white',
    returned: 'bg-slate-400 text-white',
    open: 'bg-amber-400 text-white',
    'in progress': 'bg-blue-400 text-white',
    high: 'bg-rose-600 text-white',
    low: 'bg-slate-400 text-white'
  }
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[status] || 'bg-slate-200'}`}
    >
      {status}
    </span>
  )
}
