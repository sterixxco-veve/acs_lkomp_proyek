import React, { useState, useEffect } from 'react'
import { electronAPI } from './lib/electronAPI'
import { Icons } from './lib/Icons'
import { PDFTemplate } from './components/PDFTemplate'
import { LoginScreen } from './components/LoginScreen'
import { LabHealthDashboard } from './components/LabHealthDashboard'
import { MasterPC } from './components/MasterPC'
import { MasterComponents } from './components/MasterComponents'
import { MasterSoftware } from './components/MasterSoftware'
import { Maintenance } from './components/Maintenance'
import { Loans } from './components/Loans'
import { Tickets } from './components/Tickets'
import Reports from './components/Reports'
import { TVDashboard } from './components/TVDashboard'
import { Settings } from './components/Settings'

export default function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('health')
  const [selectedLab, setSelectedLab] = useState('L2')
  const [view, setView] = useState('main')

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
      <PDFTemplate type={printData.type} data={printData.data} />

      {/* Sidebar */}
      <aside className="w-72 bg-[#2D3E5F] text-white flex flex-col shadow-2xl relative z-20 print:hidden">
        <div className="p-8 border-b border-white/5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
              <Icons.Monitor />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight capitalize">Lkomp</h1>
              <span className="text-[10px] text-white/50 font-medium">Hardware Overview</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {[
            { id: 'health', label: 'Dashboard', icon: <Icons.Dashboard /> },
            { id: 'master', label: 'Master PC', icon: <Icons.Monitor /> },
            { id: 'logistics', label: 'Master Components', icon: <Icons.Box /> },
            { id: 'software', label: 'Master Software', icon: <Icons.Code /> },
            { id: 'maintenance', label: 'Maintenance', icon: <Icons.Alert /> },
            { id: 'reports', label: 'Reports', icon: <Icons.FileText /> },
            { id: 'tv', label: 'TV Dashboard', icon: <Icons.Tv /> },
            { id: 'settings', label: 'Settings', icon: <Icons.Settings /> }
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
        <div className="p-6 border-t border-white/5 bg-black/10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Icons.User />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold truncate leading-none">
                {user.full_name || 'SuperAdmin'}
              </p>
              <p className="text-[10px] text-white/50 font-medium">Full Access</p>
            </div>
          </div>
          <button
            onClick={() => setUser(null)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors text-xs font-bold"
          >
            <Icons.Exit className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto print:hidden">
        <div className="p-12 max-w-7xl mx-auto pb-32">
          {activeTab === 'health' && <LabHealthDashboard data={healthData} />}
          {activeTab === 'master' && <MasterPC labId={selectedLab} />}
          {activeTab === 'logistics' && <MasterComponents />}
          {activeTab === 'software' && <MasterSoftware />}
          {activeTab === 'maintenance' && <Maintenance />}
          {activeTab === 'loans' && (
            <Loans loans={loans} onPrintLoan={handlePrintLoan} onPrintReport={handlePrintRekap} />
          )}
          {activeTab === 'tickets' && <Tickets />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'tv' && <TVDashboard labId={selectedLab} />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>

      {/* Global Floating Help */}
      <button className="fixed bottom-10 right-10 w-14 h-14 bg-[#2D3E5F] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform font-bold text-xl print:hidden">
        ?
      </button>
    </div>
  )
}
