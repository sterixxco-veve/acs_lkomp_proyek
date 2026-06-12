import React, { useState, useEffect } from 'react';
import ComputerIcon from '@mui/icons-material/Computer';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function TvDashboard({ user, onBack, onLogout, isPublic = false }) {
  const [pcData, setPcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [maintenanceFeed, setMaintenanceFeed] = useState([]);
  const [publicLab, setPublicLab] = useState('E4');

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // NEW STATES
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedPc, setSelectedPc] = useState(null);
  const [tempStatus, setTempStatus] = useState('');

  const loadData = async () => {
    try {
      const pcs = await window.api.getPCs();
      setPcData(pcs);
      
      const activities = pcs
        .filter(p => (p.STATUS || p.status) !== 'Usable')
        .slice(0, 5)
        .map(p => ({
          id: p.pc_id,
          code: p.pc_code,
          status: p.STATUS || p.status,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }));
      
      setMaintenanceFeed(activities);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  const handleBoxClick = (pc) => {
    if (isPublic) return; // Prevent status change in public mode
    if (!pc) return; // Only open modal if PC exists in DB
    setSelectedPc(pc);
    setTempStatus(pc.STATUS || pc.status);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async () => {
    try {
      await window.api.updatePcStatusOnly(selectedPc.pc_id, tempStatus);
      setIsStatusModalOpen(false);
      loadData(); // Refresh data immediately
    } catch (err) {
      console.error(err);
      alert('Gagal mengubah status');
    }
  };

  const allLabNames = ['E4', 'L2', 'L3', 'L4'];

  const isSuperAdmin = user?.role_name === 'SuperAdmin';
  const myLabName = user?.lab_code || null;

  const labsToShow = isPublic 
    ? [publicLab] 
    : (isSuperAdmin ? allLabNames : (myLabName ? [myLabName] : []));

  // Compute Stats
  let active = 0, maintenanceCount = 0, broken = 0;
  
  // Filter pcData by lab string matching (e.g., lab_name 'Laboratorium L2' includes 'L2' or pc_code includes 'L2')
  const matchedPcs = pcData.filter(pc => 
    labsToShow.some(labName => 
      (pc.lab_name && pc.lab_name.includes(labName)) || 
      (pc.lab_code && pc.lab_code === labName) ||
      (pc.pc_code && pc.pc_code.includes(labName))
    )
  );
  
  matchedPcs.forEach(pc => {
    const s = pc.STATUS || pc.status;
    if (s === 'Usable') active++;
    else if (s === 'Maintenance') maintenanceCount++;
    else if (s === 'Broken') broken++;
  });
  
  const totalPc = matchedPcs.length;

  const getStatusColor = (status) => {
    if (status === 'Usable') return 'bg-[#22c55e] text-white border-[#16a34a] shadow-[0_4px_0_0_#16a34a]'; // Green
    if (status === 'Maintenance') return 'bg-[#f97316] text-white border-[#ea580c] shadow-[0_4px_0_0_#ea580c]'; // Orange
    if (status === 'Broken') return 'bg-[#ef4444] text-white border-[#dc2626] shadow-[0_4px_0_0_#dc2626]'; // Red
    return 'bg-[#e2e8f0] text-slate-500 border-[#cbd5e1] shadow-[0_4px_0_0_#cbd5e1]'; // Unknown
  };

  const getFeedColor = (status) => {
    if (status === 'Usable') return 'text-green-500';
    if (status === 'Maintenance') return 'text-orange-500';
    if (status === 'Broken') return 'text-red-500';
    return 'text-slate-500';
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] font-sans flex flex-col">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white px-8 py-5 shadow-lg flex justify-between items-center rounded-b-3xl mx-4 mt-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <ComputerIcon sx={{ fontSize: 32 }} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Lkomp Hardware Overview</h1>
            <p className="text-blue-100 text-sm">Real-Time Monitoring Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xl font-bold font-mono tracking-widest">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-blue-100 text-sm">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div className="h-10 w-px bg-white/20"></div>
          
          {isPublic ? (
            <div className="flex gap-3 items-center">
              <div className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 shadow-inner cursor-pointer">
                <select 
                  value={publicLab}
                  onChange={(e) => setPublicLab(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  {allLabNames.map(lab => (
                    <option key={lab} value={lab} className="text-slate-800">Lab {lab}</option>
                  ))}
                </select>
                <span className="text-blue-100 font-semibold text-sm pointer-events-none">Pilih Lab:</span>
                <span className="text-white font-bold text-lg pointer-events-none">Lab {publicLab}</span>
                <svg className="w-4 h-4 text-white pointer-events-none ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              <button 
                onClick={onBack}
                className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} /> Kembali
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={onBack}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} /> Kembali ke Dashboard
              </button>
              <button 
                onClick={onLogout}
                className="px-4 py-2 bg-white text-red-600 hover:bg-red-50 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <LogoutIcon sx={{ fontSize: 18 }} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-4 gap-6 px-8 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
            <ComputerIcon sx={{ fontSize: 28 }} />
          </div>
          <div>
            <p className="text-slate-500 font-medium">Total PC</p>
            <h2 className="text-3xl font-black text-slate-800">{totalPc}</h2>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="p-4 bg-green-50 rounded-xl text-green-600">
            <ShowChartIcon sx={{ fontSize: 28 }} />
          </div>
          <div>
            <p className="text-slate-500 font-medium">Active</p>
            <h2 className="text-3xl font-black text-green-600">{active}</h2>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="p-4 bg-red-50 rounded-xl text-red-600">
            <WarningIcon sx={{ fontSize: 28 }} />
          </div>
          <div>
            <p className="text-slate-500 font-medium">Broken</p>
            <h2 className="text-3xl font-black text-red-600">{broken}</h2>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="p-4 bg-orange-50 rounded-xl text-orange-600">
            <BuildIcon sx={{ fontSize: 28 }} />
          </div>
          <div>
            <p className="text-slate-500 font-medium">Maintenance</p>
            <h2 className="text-3xl font-black text-orange-600">{maintenanceCount}</h2>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex gap-8 px-8 mt-8 pb-12 flex-1">
        
        {/* GRIDS */}
        <div className="flex-1 space-y-10">
          {labsToShow.map(labName => {
            // Filter pcs for this specific lab and sort them alphabetically
            const labPcs = pcData.filter(pc => 
              (pc.lab_name && pc.lab_name.includes(labName)) || 
              (pc.lab_code && pc.lab_code === labName) ||
              (pc.pc_code && pc.pc_code.includes(labName))
            ).sort((a, b) => a.pc_code.localeCompare(b.pc_code));

            if (labPcs.length === 0) return (
              <div key={labName} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center text-slate-500 font-medium">
                Belum ada PC yang terdaftar di Lab {labName}.
              </div>
            );

            return (
              <div key={labName} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Lab {labName}</h3>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">
                    {labPcs.length} units
                  </span>
                </div>
                
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {labPcs.map((pc) => {
                    const status = pc.STATUS || pc.status;
                    const boxLabel = pc.pc_code;
                    const colorClass = getStatusColor(status);

                    return (
                      <div 
                        key={pc.pc_id} 
                        onClick={() => handleBoxClick(pc)}
                        title={`Code: ${boxLabel}\nStatus: ${status}`}
                        className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-transform cursor-pointer hover:-translate-y-1 shadow-sm ${colorClass}`}
                      >
                        {boxLabel.length > 5 ? boxLabel.slice(-4) : boxLabel}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* SIDEBAR: Live Activity Feed */}
        <div className="w-[350px] shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ShowChartIcon sx={{ fontSize: 20 }} className="text-blue-600" /> Live Activity Feed
            </h3>
            
            <div className="space-y-4">
              {maintenanceFeed.length > 0 ? (
                maintenanceFeed.map((activity, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full bg-current ${getFeedColor(activity.status)}`}></div>
                      <span className="font-semibold text-slate-800 text-sm">
                        {activity.status === 'Broken' ? 'PC marked as broken' : 'Maintenance in progress'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 ml-4 font-mono">{activity.code}</div>
                    <div className="text-xs text-slate-400 ml-4 mt-1">{activity.time}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Belum ada aktivitas terbaru.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* STATUS MODAL */}
      {isStatusModalOpen && selectedPc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 w-[400px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Update Status PC</h2>
            <p className="text-slate-500 mb-6">
              Ubah status untuk PC <span className="font-bold text-blue-600">{selectedPc.pc_code}</span> secara langsung.
            </p>

            <div className="space-y-4 mb-8">
              <label className="block text-sm font-semibold text-slate-700">Pilih Status Baru</label>
              <select
                value={tempStatus}
                onChange={(e) => setTempStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-semibold appearance-none"
              >
                <option value="Usable">✅ Usable </option>
                <option value="Broken">❌ Broken </option>
                <option value="Maintenance">🔧 Maintenance </option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStatus}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-200"
              >
                Simpan Status
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
