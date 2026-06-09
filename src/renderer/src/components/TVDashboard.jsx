import React, { useState, useEffect } from 'react';
import ComputerIcon from '@mui/icons-material/Computer';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function TvDashboard({ user, onBack, onLogout }) {
  const [pcData, setPcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [maintenanceFeed, setMaintenanceFeed] = useState([]);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Data
  useEffect(() => {
    const fetchAllData = async () => {
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

    fetchAllData();
    const interval = setInterval(fetchAllData, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  // Static Lab Layout Definition
  const parsedLabs = (() => {
    const codes = { 'E4': [], 'L2': [], 'L3': [], 'L4': [] };
    
    // Lab E4: 40 PCs
    for(let i=1; i<=15; i++) codes['E4'].push(`A5${String(i).padStart(2, '0')}`);
    for(let i=1; i<=10; i++) codes['E4'].push(`B5${String(i).padStart(2, '0')}`);
    for(let i=1; i<=15; i++) codes['E4'].push(`C5${String(i).padStart(2, '0')}`);

    // Lab L2: 40 PCs
    ['A','B','C','D','E'].forEach(block => {
      for(let i=1; i<=8; i++) codes['L2'].push(`${block}20${i}`);
    });

    // Lab L3: 40 PCs
    ['A','B','C','D','E'].forEach(block => {
      for(let i=1; i<=8; i++) codes['L3'].push(`${block}30${i}`);
    });

    // Lab L4: 40 PCs
    for(let i=1; i<=12; i++) codes['L4'].push(`A4${String(i).padStart(2, '0')}`);
    for(let i=1; i<=14; i++) codes['L4'].push(`B4${String(i).padStart(2, '0')}`);
    for(let i=1; i<=14; i++) codes['L4'].push(`C4${String(i).padStart(2, '0')}`);

    return codes;
  })();

  const isSuperAdmin = user?.role_name === 'SuperAdmin';
  const myLabName = user?.role_name?.includes('Admin') && !isSuperAdmin 
    ? user.role_name.replace('Admin ', '') 
    : null;

  const labsToShow = isSuperAdmin ? Object.keys(parsedLabs) : (myLabName ? [myLabName] : []);

  // Compute Stats
  const relevantCodes = labsToShow.flatMap(lab => parsedLabs[lab] || []);
  let active = 0, maintenanceCount = 0, broken = 0;
  
  const matchedPcs = pcData.filter(pc => relevantCodes.some(code => pc.pc_code.includes(code)));
  
  matchedPcs.forEach(pc => {
    const s = pc.STATUS || pc.status;
    if (s === 'Usable') active++;
    else if (s === 'Maintenance') maintenanceCount++;
    else if (s === 'Broken') broken++;
  });
  
  const totalPc = relevantCodes.length;

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
            const codes = parsedLabs[labName] || [];
            if (codes.length === 0) return null;

            return (
              <div key={labName} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Lab {labName}</h3>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">
                    {codes.length} units
                  </span>
                </div>
                
                <div className="grid grid-rows-4 grid-cols-10 grid-flow-col gap-3">
                  {codes.map((code, index) => {
                    const pc = pcData.find(p => p.pc_code.includes(code));
                    const status = pc ? (pc.STATUS || pc.status) : 'Missing';
                    const boxLabel = code;
                    const colorClass = getStatusColor(status);

                    return (
                      <div 
                        key={code} 
                        title={`Code: ${code}\nStatus: ${status}\nDB Match: ${pc ? pc.pc_code : 'None'}`}
                        className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer transition-transform hover:-translate-y-1 ${colorClass}`}
                      >
                        {boxLabel}
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
    </div>
  );
}
