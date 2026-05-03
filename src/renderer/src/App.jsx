import React, { useState, useEffect, useMemo } from 'react'

/**
 * MOCK API (Electron IPC Handlers - Proposal v2.0)
 * Menangani query ke MySQL (Simulasi)
 */
const electronAPI = {
  login: async (creds) => {
    await new Promise((r) => setTimeout(r, 600))
    if (creds.username === 'admin_asisten') {
      return {
        success: true,
        user: { user_id: 1, full_name: 'Asisten Lab Utama', role: 'admin', lab_id: 'L2' }
      }
    }
    if (creds.username === 'kiosk_l2') {
      return {
        success: true,
        user: { user_id: 2, full_name: 'Kiosk Lab L2', role: 'kiosk', lab_id: 'L2' }
      }
    }
    return { success: false, message: 'Kombinasi login tidak valid.' }
  },

  getPCs: async (labId) => {
    const sections = ['A', 'B', 'C', 'D', 'E']
    let pcs = []
    sections.forEach((sec) => {
      for (let r = 1; r <= 4; r++) {
        for (let c = 1; c <= 2; c++) {
          const pcCode = `${sec}${r}0${c}`
          const rand = Math.random()
          const status = rand > 0.9 ? 'broken' : rand > 0.8 ? 'maintenance' : 'active'
          pcs.push({
            pc_id: Math.floor(Math.random() * 1000),
            lab_id: labId,
            pc_code: pcCode,
            grid_section: sec,
            grid_row: r,
            grid_column: c,
            status: status,
            specs: {
              cpu: rand > 0.5 ? 'Intel Core i7-12700' : 'AMD Ryzen 5 5600X',
              ram: rand > 0.5 ? '16GB DDR4 3200MHz' : '32GB DDR4 3600MHz',
              gpu: rand > 0.5 ? 'NVIDIA RTX 3060 12GB' : 'AMD RX 6600 XT 8GB',
              storage: 'SSD 512GB NVMe',
              motherboard: 'ASUS Prime B660M'
            }
          })
        }
      }
    })
    return pcs
  },

  getLabHealth: async () => [
    { lab_id: 'L2', lab_name: 'Lab L2', total_pc: 40, pc_aktif: 36, pc_rusak: 2, tiket_open: 2 },
    { lab_id: 'L3', lab_name: 'Lab L3', total_pc: 40, pc_aktif: 39, pc_rusak: 0, tiket_open: 0 },
    { lab_id: 'L4', lab_name: 'Lab L4', total_pc: 40, pc_aktif: 35, pc_rusak: 3, tiket_open: 5 },
    { lab_id: 'E4', lab_name: 'Lab E4', total_pc: 30, pc_aktif: 28, pc_rusak: 1, tiket_open: 1 }
  ],

  getInventory: async () => [
    {
      item_id: 1,
      item_name: 'RAM 8GB DDR4',
      category: 'RAM',
      brand: 'Samsung',
      stock_count: 19,
      status: 'new'
    },
    {
      item_id: 2,
      item_name: 'Mouse Logitech M100',
      category: 'Peripherals',
      brand: 'Logitech',
      stock_count: 15,
      status: 'new'
    },
    {
      item_id: 3,
      item_name: 'SSD 512GB NVMe',
      category: 'Storage',
      brand: 'WD Blue',
      stock_count: 5,
      status: 'new'
    }
  ],

  getLoans: async () => [
    {
      lending_id: 1,
      borrower_name: 'Dr. Johannes',
      borrower_role: 'Dosen',
      item_name: 'RAM 8GB DDR4',
      borrow_date: '2026-03-26',
      expected_return_date: '2026-04-09',
      status: 'borrowed'
    },
    {
      lending_id: 2,
      borrower_name: 'Prof. Siti',
      borrower_role: 'Dosen',
      item_name: 'NVIDIA RTX 3060',
      borrow_date: '2026-04-01',
      expected_return_date: '2026-04-15',
      status: 'returned'
    }
  ],

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

// --- Icons Library ---
const Icons = {
  Monitor: () => (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  Dashboard: () => (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  Box: () => (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  ),
  FileText: () => (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),
  Alert: () => (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Exit: () => (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  Printer: () => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9"></polyline>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
      <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
  ),
  Close: () => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}

const Badge = ({ status }) => {
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

// --- PDF Templates (Hidden by default, used for print) ---
const PDFTemplate = ({ type, data }) => {
  if (!data) return null
  return (
    <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-16 font-serif text-black leading-relaxed">
      {/* Kop Surat */}
      <div className="text-center border-b-4 border-double border-black pb-4 mb-8">
        <h1 className="text-2xl font-bold uppercase">Laboratorium Komputer Engineering</h1>
        <p className="text-sm">Gedung Teknik Lt. 4 - Universitas Teknologi XYZ</p>
        <p className="text-sm italic">Sistem Informasi Inventaris Lkomp Hardware Overview</p>
      </div>

      {type === 'loan' ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-center underline mb-8">
            SURAT PEMINJAMAN HARDWARE
          </h2>
          <div className="space-y-2">
            <p>
              ID Transaksi: <strong>#{data.lending_id}</strong>
            </p>
            <p>Telah dilakukan peminjaman asset laboratorium kepada:</p>
          </div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="w-40 py-1">Nama Peminjam</td>
                <td>: {data.borrower_name}</td>
              </tr>
              <tr>
                <td className="py-1">Jabatan/Role</td>
                <td>: {data.borrower_role}</td>
              </tr>
              <tr>
                <td className="py-1">Nama Item</td>
                <td>: {data.item_name}</td>
              </tr>
              <tr>
                <td className="py-1">Tanggal Pinjam</td>
                <td>: {data.borrow_date}</td>
              </tr>
              <tr>
                <td className="py-1">Batas Kembali</td>
                <td>: {data.expected_return_date}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-12 grid grid-cols-2 text-center">
            <div>
              <p>Peminjam,</p>
              <div className="h-24"></div>
              <p className="font-bold underline">{data.borrower_name}</p>
            </div>
            <div>
              <p>Admin Lab,</p>
              <div className="h-24"></div>
              <p className="font-bold underline">Asisten Lab</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-center underline mb-8">
            LAPORAN REKAP PEMINJAMAN PERIODIK
          </h2>
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2">No</th>
                <th className="border border-black p-2">Peminjam</th>
                <th className="border border-black p-2">Item</th>
                <th className="border border-black p-2">Pinjam</th>
                <th className="border border-black p-2">Kembali</th>
                <th className="border border-black p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-black p-2 text-center">{idx + 1}</td>
                  <td className="border border-black p-2">{item.borrower_name}</td>
                  <td className="border border-black p-2">{item.item_name}</td>
                  <td className="border border-black p-2">{item.borrow_date}</td>
                  <td className="border border-black p-2">{item.expected_return_date}</td>
                  <td className="border border-black p-2 uppercase">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// --- Main Components ---

const LabHealthDashboard = ({ data }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <div>
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Multi-Lab Comparison</h2>
      <p className="text-slate-400 text-sm font-bold mt-2">
        Dashboard perbandingan kondisi hardware 4 lab secara real-time
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {data.map((lab) => (
        <div
          key={lab.lab_id}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 font-black text-slate-50 text-5xl opacity-0 group-hover:opacity-100 transition-all">
            {lab.lab_id}
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-6">{lab.lab_name}</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Health Score
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(lab.pc_aktif / lab.total_pc) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-2xl font-black text-slate-800 leading-none">{lab.pc_aktif}</p>
                <p className="text-[9px] font-bold text-emerald-600 uppercase mt-2">Ready</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center">
                <p className="text-2xl font-black text-rose-600 leading-none">{lab.pc_rusak}</p>
                <p className="text-[9px] font-bold text-rose-400 uppercase mt-2">Broken</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const MasterPC = ({ labId }) => {
  const [pcs, setPcs] = useState([])
  const [selectedPC, setSelectedPC] = useState(null)

  useEffect(() => {
    electronAPI.getPCs(labId).then(setPcs)
  }, [labId])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">
            Master PC & Specs
          </h2>
          <p className="text-slate-400 text-sm font-bold mt-1">
            Daftar unit dan rincian spesifikasi hardware Lab {labId}
          </p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
          Add New PC
        </button>
      </div>

      {/* Grid Layout Kotak-Kotak */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {pcs.map((pc) => (
          <div
            key={pc.pc_id}
            onClick={() => setSelectedPC(pc)}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col items-center gap-4 text-center"
          >
            <div
              className={`p-4 rounded-3xl transition-colors ${
                pc.status === 'active'
                  ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white'
                  : pc.status === 'broken'
                    ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'
                    : 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white'
              }`}
            >
              <Icons.Monitor />
            </div>
            <div>
              <p className="font-black text-slate-800 text-lg tracking-tight leading-none mb-2">
                {pc.pc_code}
              </p>
              <Badge status={pc.status} />
            </div>
          </div>
        ))}
      </div>

      {/* PC Detail Modal Overlay */}
      {selectedPC && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          onClick={() => setSelectedPC(null)}
        >
          <div
            className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#2D3E5F] p-10 text-white flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 italic">
                  Unit Specification
                </p>
                <h3 className="text-4xl font-black italic tracking-tighter mt-2">
                  {selectedPC.pc_code}
                </h3>
                <div className="mt-4">
                  <Badge status={selectedPC.status} />
                </div>
              </div>
              <button
                onClick={() => setSelectedPC(null)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
              >
                <Icons.Close />
              </button>
            </div>
            <div className="p-12 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Processor (CPU)
                  </p>
                  <p className="font-bold text-slate-800 text-lg">{selectedPC.specs.cpu}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Memory (RAM)
                  </p>
                  <p className="font-bold text-slate-800 text-lg">{selectedPC.specs.ram}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Graphics (GPU)
                  </p>
                  <p className="font-bold text-slate-800 text-lg">{selectedPC.specs.gpu}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Storage Drive
                  </p>
                  <p className="font-bold text-slate-800 text-lg">{selectedPC.specs.storage}</p>
                </div>
                <div className="col-span-full space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Motherboard Model
                  </p>
                  <p className="font-bold text-slate-800 text-lg">{selectedPC.specs.motherboard}</p>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-100 flex gap-4">
                <button className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                  Update Specification
                </button>
                <button className="flex-1 border-2 border-slate-100 text-slate-400 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all">
                  View Damage Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Logistics = () => {
  const [items, setItems] = useState([])
  useEffect(() => {
    electronAPI.getInventory().then(setItems)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">
            Stok Komponen
          </h2>
          <p className="text-slate-400 text-sm font-bold mt-1">
            Manajemen gudang dan pergerakan barang masuk
          </p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg">
          Tambah Stok
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.item_id}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all"
          >
            <div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
                {item.category}
              </div>
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2">
                {item.item_name}
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {item.brand}
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center">
              <div className="text-3xl font-black text-slate-900">
                {item.stock_count} <span className="text-xs font-bold text-slate-300">Unit</span>
              </div>
              <button className="text-blue-500 font-bold text-[10px] uppercase tracking-widest border border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-50">
                Log History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Tickets = () => {
  const [tickets, setTickets] = useState([])
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

const Loans = ({ onPrintLoan, onPrintReport, loans }) => (
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

// --- Login Screen ---
const LoginScreen = ({ onLogin }) => {
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await electronAPI.login(creds)
    if (res.success) onLogin(res.user)
    else setError(res.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1a253a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md text-center relative z-10 border border-white/20">
        <div className="w-16 h-16 bg-[#2D3E5F] rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold italic shadow-xl">
          Lk
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-8 uppercase italic underline decoration-blue-500 decoration-4 underline-offset-8">
          Lkomp Overview
        </h1>
        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 text-[10px] font-black uppercase tracking-widest border border-rose-100">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Access Username"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-blue-500"
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Security Token"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-blue-500 tracking-[0.3em]"
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D3E5F] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg active:scale-95"
          >
            Authorize Access
          </button>
        </form>
      </div>
    </div>
  )
}

// --- Main Application Controller ---
export default function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('health')
  const [selectedLab, setSelectedLab] = useState('L2')
  const [view, setView] = useState('main') // 'main' or 'tv'

  const [healthData, setHealthData] = useState([])
  const [loans, setLoans] = useState([])
  const [printData, setPrintData] = useState({ type: null, data: null })

  useEffect(() => {
    if (window.location.hash === '#/tv') setView('tv')
    electronAPI.getLabHealth().then(setHealthData)
    electronAPI.getLoans().then(setLoans)
  }, [])

  const handlePrintLoan = (loan) => {
    setPrintData({ type: 'loan', data: loan })
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handlePrintRekap = () => {
    setPrintData({ type: 'rekap', data: loans })
    setTimeout(() => {
      window.print()
    }, 100)
  }

  if (view === 'tv') return <TVDashboard labId="L2" />
  if (!user) return <LoginScreen onLogin={setUser} />

  const labs = ['L2', 'L3', 'L4', 'E4']

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100">
      {/* PDF Templates for printing */}
      <PDFTemplate type={printData.type} data={printData.data} />

      {/* Sidebar */}
      <aside className="w-72 bg-[#2D3E5F] text-white flex flex-col shadow-2xl relative z-20 print:hidden">
        <div className="p-8 border-b border-white/5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
              Lk
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">Control</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'health', label: 'Lab Health', icon: <Icons.Dashboard /> },
            { id: 'master', label: 'Master PC', icon: <Icons.Monitor /> },
            { id: 'logistics', label: 'Logistics', icon: <Icons.Box /> },
            { id: 'loans', label: 'Loans', icon: <Icons.FileText /> },
            { id: 'tickets', label: 'Tickets', icon: <Icons.Alert /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-bold transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5 bg-black/10">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 italic">
            Active Session
          </p>
          <p className="text-xs font-bold truncate leading-none">{user.full_name}</p>
          <button
            onClick={() => setUser(null)}
            className="mt-4 text-rose-400 text-[10px] font-bold uppercase tracking-widest hover:text-rose-300 transition-colors"
          >
            Sign Out Connection
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto print:hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10 select-none">
          <div className="flex items-center gap-8">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            </div>
            {/* Lab Selector */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              {labs.map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLab(l)}
                  className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${selectedLab === l ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Lab {l}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} System
            Overview
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto pb-32">
          {activeTab === 'health' && <LabHealthDashboard data={healthData} />}
          {activeTab === 'master' && <MasterPC labId={selectedLab} />}
          {activeTab === 'logistics' && <Logistics />}
          {activeTab === 'loans' && (
            <Loans loans={loans} onPrintLoan={handlePrintLoan} onPrintReport={handlePrintRekap} />
          )}
          {activeTab === 'tickets' && <Tickets />}
        </div>
      </main>

      {/* Global Floating Help */}
      <button className="fixed bottom-10 right-10 w-14 h-14 bg-[#2D3E5F] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform font-bold text-xl print:hidden">
        ?
      </button>
    </div>
  )
}

// --- TV Dashboard View (Grid) ---
const TVDashboard = ({ labId }) => {
  const [pcs, setPcs] = useState([])
  const sections = ['A', 'B', 'C', 'D', 'E']

  useEffect(() => {
    electronAPI.getPCs(labId).then(setPcs)
  }, [labId])

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-12 flex flex-col font-sans overflow-hidden">
      <header className="flex justify-between items-end mb-12 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-6xl font-black italic text-blue-500 uppercase tracking-tighter leading-none">
            LAB {labId} LIVE GRID
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em] mt-4 italic opacity-50">
            Node Health Real-time Monitoring
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Time Server
          </p>
          <p className="text-3xl font-mono font-bold text-blue-100">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-5 gap-8 flex-1">
        {sections.map((sec) => (
          <div key={sec} className="flex flex-col gap-6">
            <div className="bg-slate-800/50 py-3 rounded-2xl border border-white/5 text-center shadow-lg">
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Blok {sec}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {pcs
                .filter((p) => p.grid_section === sec)
                .map((pc) => (
                  <div
                    key={pc.pc_code}
                    className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-700 ${
                      pc.status === 'active'
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
                        : pc.status === 'maintenance'
                          ? 'border-amber-500/30 bg-amber-500/5 text-amber-400'
                          : 'border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse'
                    }`}
                  >
                    <Icons.Monitor />
                    <span className="text-[10px] font-black mt-3 tracking-tighter opacity-80">
                      {pc.pc_code}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-12 flex justify-center gap-16 pt-10 border-t border-white/5">
        {[
          { label: 'Unit Ready', color: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
          { label: 'Maintenance', color: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
          { label: 'Down / Damage', color: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' }
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${l.color}`}></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              {l.label}
            </span>
          </div>
        ))}
      </footer>
    </div>
  )
}
