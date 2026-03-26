import React, { useState, useEffect } from 'react'

/**
 * KOMPONEN: TV Dashboard (Grid 40 PC)
 * Menampilkan peta unit PC secara visual untuk monitoring
 */
const TVDashboard = ({ labId, onLogout }) => {
  const [pcs, setPcs] = useState([])

  const fetchData = async () => {
    try {
      const data = await window.api.getPCs(labId)
      setPcs(data || [])
    } catch (err) {
      console.error('Gagal mengambil data PC:', err)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [labId])

  const sections = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 font-sans">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black italic text-blue-500 uppercase tracking-tighter">LAB {labId || 'OVERVIEW'} LIVE</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Grid Monitoring System</p>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-slate-500">{new Date().toLocaleTimeString()}</div>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse mt-1">● Live Connection</p>
          </div>
          {onLogout && (
            <button onClick={onLogout} className="bg-slate-800 hover:bg-rose-600 p-3 rounded-xl transition-all group">
              <span className="text-xs font-black uppercase tracking-widest group-hover:text-white text-slate-500">Exit</span>
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-5 gap-8">
        {sections.map(sec => (
          <div key={sec} className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 shadow-2xl backdrop-blur-sm">
            <h2 className="text-center font-black text-slate-600 mb-6 tracking-widest uppercase">Blok {sec}</h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => {
                const pc = pcs.find(p => p.grid_section === sec && (p.grid_column + (p.grid_row - 1) * 2) === i)
                return (
                  <div 
                    key={i} 
                    className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-black transition-all duration-500 ${
                      !pc ? 'border-slate-800 opacity-10 bg-slate-800/10' : 
                      pc.status === 'active' ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 
                      'border-rose-500 bg-rose-500/10 text-rose-400 animate-pulse'
                    }`}
                  >
                    <span className="text-[8px] opacity-30 mb-1">{sec}{Math.ceil(i/2)}0{(i%2)||2}</span>
                    <span className="text-sm">{pc ? 'UNIT' : '-'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * KOMPONEN: Kiosk Mode (Reporting)
 * Digunakan oleh Staff atau Mahasiswa untuk lapor kerusakan
 */
const KioskMode = ({ user, onLogout }) => {
  const [pcs, setPcs] = useState([])
  const [selectedPc, setSelectedPc] = useState('')
  const [desc, setDesc] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    window.api.getPCs(user.lab_id).then(data => setPcs(data || []))
  }, [user.lab_id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await window.api.reportDamage({
      pcId: selectedPc,
      reporterId: user.user_id,
      desc: desc,
      severity: 'medium'
    })
    if (res.success) {
      setMsg('Laporan terkirim! Asisten segera mengecek.')
      setDesc(''); setSelectedPc('');
      setTimeout(() => setMsg(''), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans selection:bg-blue-200">
      <div className="bg-white p-16 rounded-[4rem] shadow-2xl w-full max-w-xl border border-slate-100">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">Lapor<br/><span className="text-blue-600">Isu Unit</span></h2>
            <p className="text-slate-400 mt-4 font-bold uppercase text-[11px] tracking-[0.2em] bg-slate-50 inline-block px-3 py-1 rounded-lg truncate max-w-[200px]">User: {user.full_name}</p>
          </div>
          <button onClick={onLogout} className="bg-rose-50 text-rose-500 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all">Logout</button>
        </div>
        
        {msg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-5 rounded-3xl mb-8 font-bold text-center shadow-lg shadow-emerald-200 animate-in fade-in zoom-in">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Laboratorium Terpilih</label>
            <div className="w-full p-6 bg-slate-100 border-2 border-slate-100 rounded-3xl font-black text-slate-500">
               LABORATORIUM {user.lab_id || 'GENERAL'}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Unit Bermasalah</label>
            <select 
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
              value={selectedPc} onChange={e => setSelectedPc(e.target.value)} required
            >
              <option value="">Pilih Kode PC...</option>
              {pcs.map(pc => <option key={pc.pc_id} value={pc.pc_id}>{pc.pc_code} ({pc.status.toUpperCase()})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Deskripsi Kerusakan</label>
            <textarea 
              className="w-full p-7 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white h-44 resize-none transition-all placeholder:text-slate-300"
              placeholder="Jelaskan kendala hardware yang anda temukan..."
              value={desc} onChange={e => setDesc(e.target.value)} required
            ></textarea>
          </div>
          <button className="w-full bg-slate-950 text-white font-black py-7 rounded-3xl shadow-2xl hover:bg-blue-600 transition-all uppercase tracking-[0.3em] text-xs active:scale-95">
            Submit Tiket Perbaikan
          </button>
        </form>
      </div>
    </div>
  )
}

/**
 * KOMPONEN: Admin Workspace
 */
const AdminWorkspace = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [healthData, setHealthData] = useState([])
  const [rekap, setRekap] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const health = await window.api.getHealth()
      const logs = await window.api.getRekap()
      setHealthData(health || [])
      setRekap(logs || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    window.print();
  }

  useEffect(() => { loadData() }, [activeTab])

  return (
    <div className="flex min-h-screen bg-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-slate-950 text-white p-12 flex flex-col border-r border-slate-900 shadow-2xl relative z-20 print:hidden">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-2">
             <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black italic text-2xl shadow-xl shadow-blue-600/20">Lk</div>
             <h1 className="text-2xl font-black tracking-tighter leading-none">OVERVIEW</h1>
          </div>
          <span className="text-blue-500 font-black text-[9px] tracking-[0.4em] uppercase ml-1 opacity-70">Management Hub</span>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 mb-10">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Authenticated As</p>
           <p className="text-sm font-black text-white truncate">{user?.full_name}</p>
           <div className="flex items-center gap-2 mt-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{user?.role} Mode</span>
           </div>
        </div>
        
        <nav className="flex-1 space-y-4">
          {[
            { id: 'dashboard', label: 'Lab Health', icon: '📊' },
            { id: 'rekap', label: 'Audit Logs', icon: '📑' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-8 py-5 rounded-[2rem] font-black capitalize transition-all duration-300 flex items-center justify-between group ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 translate-x-3' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-lg opacity-50 group-hover:opacity-100">{tab.icon}</span>
                <span className="tracking-tight">{tab.label}</span>
              </div>
              {activeTab === tab.id && <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="mt-auto py-5 text-rose-500 font-black uppercase text-[11px] tracking-[0.4em] hover:bg-rose-500/10 rounded-2xl transition-all active:scale-95 text-center border border-rose-500/20">Sign Out Session</button>
      </div>

      {/* CSS Khusus untuk Print Formal Portrait */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 15mm; }
          body { background: white !important; color: black !important; font-family: "Times New Roman", serif !important; }
          .print-header { display: flex !important; flex-direction: column; align-items: center; text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 15px; }
          .print-header h1 { font-size: 20pt; font-weight: bold; margin: 0; text-transform: uppercase; }
          .print-header h2 { font-size: 14pt; margin: 5px 0; }
          .print-header p { font-size: 10pt; margin: 2px 0; }
          .report-info { display: block !important; margin-bottom: 20px; font-size: 11pt; }
          .report-info div { margin-bottom: 5px; }
          .flex-1 { padding: 0 !important; margin: 0 !important; overflow: visible !important; display: block !important; }
          .max-w-6xl { max-width: 100% !important; margin: 0 !important; }
          .bg-slate-50 { background: white !important; }
          table { width: 100% !important; border-collapse: collapse !important; margin-top: 10px; }
          th { background: #eee !important; border: 1pt solid black !important; padding: 8px !important; font-size: 10pt; text-transform: uppercase; }
          td { border: 1pt solid black !important; padding: 8px !important; font-size: 10pt; }
          .print-footer { display: flex !important; justify-content: space-between; margin-top: 50px; page-break-inside: avoid; }
          .signature-box { text-align: center; width: 200px; }
          .signature-space { height: 70px; }
          .signature-name { font-weight: bold; text-decoration: underline; }
          .no-print { display: none !important; }
          .shadow-xl, .shadow-2xl, .shadow-sm, .rounded-[4rem], .border { border: none !important; shadow: none !important; }
        }
      `}</style>

      <div className="flex-1 bg-slate-50 p-20 overflow-y-auto relative print:bg-white print:p-0">
        <div className="hidden print-header">
          <h1>Laboratorium Komputer Engineering</h1>
          <h2>Laporan Rekapitulasi Peminjaman Asset</h2>
          <p>Gedung Teknik Lt. 4 - Universitas Teknologi</p>
        </div>

        <div className="hidden report-info">
          <div><strong>Organisasi:</strong> Unit Laboratorium Komputer (LKOMP)</div>
          <div><strong>Periode Laporan:</strong> {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
          <div><strong>Waktu Ekspor:</strong> {new Date().toLocaleString('id-ID')}</div>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <header className="mb-16 flex justify-between items-end no-print">
                 <div>
                    <h2 className="text-6xl font-black text-slate-950 tracking-tighter leading-none">Lab Health.</h2>
                    <p className="text-slate-400 font-bold mt-4 text-lg">Statistik real-time kondisi unit PC di seluruh laboratorium.</p>
                 </div>
                 <button onClick={loadData} className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center hover:border-blue-500 transition-all shadow-sm active:rotate-180 duration-500">🔄</button>
              </header>

              {loading ? (
                <div className="grid grid-cols-2 gap-10 opacity-50 pointer-events-none">
                  {[1, 2].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-[3rem]"></div>)}
                </div>
              ) : healthData.length > 0 ? (
                <div className="grid grid-cols-2 gap-10">
                  {healthData.map(lab => (
                    <div key={lab.lab_id} className="bg-white p-12 rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-700 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] flex items-center justify-center font-black text-slate-200 text-4xl group-hover:text-blue-50 group-hover:scale-110 transition-all">
                        {lab.lab_id}
                      </div>
                      
                      <div className="relative z-10">
                        <div className="mb-10">
                          <h3 className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors leading-none">{lab.lab_name}</h3>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{lab.total_pc} Total PC Managed</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6">
                          <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100/50 group-hover:scale-105 transition-all duration-500 text-center">
                            <p className="text-5xl font-black text-emerald-600 tracking-tighter leading-none">{lab.pc_aktif || 0}</p>
                            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mt-3 opacity-60">Ready</p>
                          </div>
                          <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100/50 group-hover:scale-105 transition-all duration-500 delay-75 text-center">
                            <p className="text-5xl font-black text-rose-600 tracking-tighter leading-none">{lab.pc_rusak || 0}</p>
                            <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest mt-3 opacity-60">Down</p>
                          </div>
                          <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100/50 group-hover:scale-105 transition-all duration-500 delay-150 text-center">
                            <p className="text-5xl font-black text-amber-600 tracking-tighter leading-none">{lab.tiket_belum_selesai || 0}</p>
                            <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mt-3 opacity-60">Tickets</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-32 rounded-[5rem] text-center border-4 border-dashed border-slate-100">
                  <div className="text-8xl mb-6 grayscale opacity-20">🗄️</div>
                  <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[0.4em]">Database Kosong</h3>
                  <p className="text-slate-400 font-bold mt-2">Pastikan tabel 'labs' dan 'pc_units' sudah terisi data.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in duration-700">
              <header className="mb-16 flex justify-between items-end no-print">
                 <div>
                    <h2 className="text-6xl font-black text-slate-950 tracking-tighter leading-none">Audit Logs.</h2>
                    <p className="text-slate-400 font-bold mt-4 text-lg">Log riwayat peminjaman barang dan aset laboratorium.</p>
                 </div>
                 <button onClick={handleExportPDF} className="bg-slate-950 hover:bg-blue-600 text-white px-12 py-6 rounded-2xl text-[10px] font-black transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.3em] active:scale-95 flex items-center gap-3">
                   <span>🖨️</span> Ekspor Laporan PDF
                 </button>
              </header>

              <div className="bg-white rounded-[4rem] shadow-xl border border-slate-100 overflow-hidden print:shadow-none print:rounded-none">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                      <tr>
                        <th className="px-12 py-10 print:px-3 print:py-2">No</th>
                        <th className="px-12 py-10 print:px-3 print:py-2">Identity / Role</th>
                        <th className="px-12 py-10 print:px-3 print:py-2">Asset Item</th>
                        <th className="px-12 py-10 print:px-3 print:py-2">Status</th>
                        <th className="px-12 py-10 print:px-3 print:py-2 text-right">Goal Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                      {rekap.length > 0 ? rekap.map((row, index) => (
                        <tr key={row.lending_id} className="hover:bg-blue-50/30 transition-all cursor-default group print:hover:bg-transparent">
                          <td className="px-12 py-10 print:px-3 print:py-2 text-slate-400">{index + 1}</td>
                          <td className="px-12 py-10 print:px-3 print:py-2">
                            <div className="font-black text-slate-900 text-2xl tracking-tighter leading-none print:text-[11pt]">{row.borrower_name}</div>
                            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2 print:text-slate-500 print:text-[8pt]">{row.borrower_role}</div>
                          </td>
                          <td className="px-12 py-10 print:px-3 print:py-2">
                            <p className="text-lg print:text-[11pt]">{row.item_name}</p>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 print:hidden">ID: #{row.lending_id}</p>
                          </td>
                          <td className="px-12 py-10 print:px-3 print:py-2">
                            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                              row.status === 'returned' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                            } print:border-none print:bg-transparent print:p-0 print:text-[9pt]`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-12 py-10 print:px-3 print:py-2 text-right font-mono text-xl tracking-tighter text-slate-400 print:text-[10pt] print:font-sans print:text-black">
                            {row.expected_return_date ? new Date(row.expected_return_date).toLocaleDateString('id-ID') : '-'}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="px-12 py-32 text-center text-slate-300 uppercase font-black tracking-[0.5em] text-sm italic">No Transaction Found</td>
                        </tr>
                      )}
                    </tbody>
                 </table>
              </div>

              <div className="hidden print-footer">
                <div className="signature-box">
                  <p>Mengajukan,</p>
                  <div className="signature-space"></div>
                  <p className="signature-name">{user?.full_name}</p>
                  <p>Admin Laboratorium</p>
                </div>
                <div className="signature-box">
                  <p>Mengetahui,</p>
                  <div className="signature-space"></div>
                  <p className="signature-name">Kepala Lab Komputer</p>
                  <p>NIP. 198001012005011001</p>
                </div>
                <div className="signature-box">
                  <p>Disahkan,</p>
                  <div className="signature-space"></div>
                  <p className="signature-name">Dekan Fak. Teknik</p>
                  <p>Tanggal: ....................</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * MAIN APP COMPONENT
 */
export default function App() {
  const [view, setView] = useState('login')
  const [user, setUser] = useState(null)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await window.api.login(credentials)
      if (res.success) {
        setUser(res.user)
        // LOGIKA DIBUAT DINAMIS: Redirect berdasarkan ROLE dari database
        if (res.user.role === 'admin') {
          setView('admin')
        } else if (res.user.role === 'tv') {
          setView('tv')
        } else {
          // Selain Admin & TV (misal: 'staff', 'student', 'lecturer') masuk ke Kiosk Mode
          setView('kiosk')
        }
      } else {
        setError(res.message || 'Identitas tidak dikenal oleh sistem.')
      }
    } catch (err) {
      setError('Sistem tidak merespon. Cek MySQL Server Anda.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (window.location.hash === '#/tv') setView('tv')
  }, [])

  const handleLogout = () => {
    setView('login');
    setUser(null);
    setCredentials({ username: '', password: '' });
  }

  if (view === 'tv') return <TVDashboard labId={user?.lab_id || 'L2'} onLogout={handleLogout} />
  if (view === 'admin') return <AdminWorkspace user={user} onLogout={handleLogout} />
  if (view === 'kiosk') return <KioskMode user={user} onLogout={handleLogout} />

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-15%] w-[40rem] h-[40rem] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-lg text-center relative z-10 border border-white/20 backdrop-blur-sm">
        <div className="mb-12">
          <div className="w-20 h-20 bg-slate-950 rounded-3xl mx-auto mb-8 flex items-center justify-center text-white text-5xl font-black italic shadow-2xl transform hover:rotate-12 transition-all">Lk</div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none uppercase">Lkomp Overview</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3 italic">Unified Connection Hub</p>
        </div>

        {error && <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 p-5 rounded-3xl mb-8 text-[10px] font-black animate-shake uppercase tracking-widest">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5 text-left ml-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Access Username</label>
            <input 
              type="text" placeholder="System ID" 
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm"
              onChange={e => setCredentials({...credentials, username: e.target.value})}
              required
            />
          </div>
          <div className="space-y-1.5 text-left ml-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Security Token</label>
            <input 
              type="password" placeholder="••••••••" 
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-all tracking-[0.5em] shadow-sm"
              onChange={e => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className={`w-full bg-slate-950 text-white font-black py-7 rounded-3xl shadow-xl uppercase tracking-[0.2em] text-[11px] mt-4 active:scale-95 transition-all ${loading ? 'opacity-50 cursor-wait' : 'hover:bg-blue-600'}`}
          >
            {loading ? 'Authenticating...' : 'Authorize Connection'}
          </button>
        </form>
      </div>
    </div>
  )
}