import React from 'react'
import { Icons } from '../lib/Icons'
import { Badge } from './Badge'

export const Loans = ({ onPrintLoan, onPrintReport, loans }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">
          Peminjaman Asset
        </h2>
        <p className="text-slate-400 text-sm font-bold mt-1">
          Pusat kendali distribusi barang keluar
        </p>
      </div>
      <button
        onClick={onPrintReport}
        className="flex items-center gap-3 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 shadow-sm"
      >
        <Icons.Printer /> Cetak Rekap Periodik
      </button>
    </div>
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
          <tr>
            <th className="px-8 py-5">Peminjam</th>
            <th className="px-8 py-5">Asset</th>
            <th className="px-8 py-5">Deadline</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5 text-right">PDF</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-sm font-medium">
          {loans.map((loan) => (
            <tr key={loan.lending_id} className="hover:bg-slate-50 transition-colors">
              <td className="px-8 py-5">
                <div className="font-bold text-slate-900 leading-none">{loan.borrower_name}</div>
                <div className="text-[10px] text-slate-400 mt-1 uppercase font-black">
                  {loan.borrower_role}
                </div>
              </td>
              <td className="px-8 py-5 text-slate-600">{loan.item_name}</td>
              <td className="px-8 py-5 text-slate-500">{loan.expected_return_date}</td>
              <td className="px-8 py-5">
                <Badge status={loan.status} />
              </td>
              <td className="px-8 py-5 text-right">
                <button
                  onClick={() => onPrintLoan(loan)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Icons.Printer />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)
