import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from "recharts";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useOutletContext } from "react-router-dom";

export function Reports() {
  const {user} = useOutletContext()

  const [healthStatus, setHealthStatus] = useState([]);
  const [maintenanceTrend, setMaintenanceTrend] = useState([]);
  const [mostReplaced, setMostReplaced] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [labPCs, setLabPCs] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = user?.role_name === 'SuperAdmin';
  const labName = user?.role_name?.includes('Admin') && !isSuperAdmin ? user.role_name.replace('Admin ', '') : 'All Labs';

  const COLORS = ["#4caf50", "#2196f3", "#f44336", "#ff9800", "#9c27b0"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data concurrently
        const [healthData, trendData, replacedData, stockData] = await Promise.all([
          window.api.getHealth(),
          window.api.getMaintenanceTrend(),
          window.api.getMostReplacedComponents(),
          window.api.getLowStock()
        ]);

        if (!isSuperAdmin && user?.lab_id) {
          const pcs = await window.api.getPCs(user.lab_id);
          setLabPCs(pcs);
        }

        // Process Health Data
        const processedHealth = healthData.map(item => ({
          lab: item.lab_name,
          Usable: parseInt(item.usable_pc) || 0,
          Broken: parseInt(item.broken_pc) || 0,
          Maintenance: parseInt(item.maintenance_pc) || 0
        }));
        setHealthStatus(processedHealth);

        // Process Trend Data (convert month_num to month name)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // Ensure we have at least 6 months to display properly, even if empty
        const processedTrend = trendData.map(item => ({
          month: monthNames[item.month_num - 1],
          total: parseInt(item.total_maintenance) || 0
        }));
        setMaintenanceTrend(processedTrend);

        // Process Most Replaced
        const processedReplaced = replacedData.map(item => ({
          name: item.component_name,
          value: parseInt(item.total_replaced) || 0
        }));
        setMostReplaced(processedReplaced);

        // Process Low Stock
        setLowStock(stockData);

      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180) * 1.5;
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180) * 1.5;
  
    return (
      <text x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50 text-gray-800 font-sans">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Analytics, reporting, dan reliability tracking</p>
        </div>
      </div>

      {/* Row 1: Health Status per Lab */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Health Status per Lab</h2>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-700 transition-colors">
            <DownloadIcon style={{ fontSize: 16 }} /> Export
          </button>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={healthStatus} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="lab" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
              <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
              <Bar dataKey="Usable" fill="#4caf50" radius={[4, 4, 0, 0]} barSize={80} />
              <Bar dataKey="Broken" fill="#f44336" radius={[4, 4, 0, 0]} barSize={80} />
              <Bar dataKey="Maintenance" fill="#ff9800" radius={[4, 4, 0, 0]} barSize={80} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Maintenance Trend & Most Replaced Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Maintenance Trend */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Maintenance Trend (6 Months)</h2>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-700 transition-colors">
              <DownloadIcon style={{ fontSize: 16 }} /> Export
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={maintenanceTrend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Replaced Components */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Most Replaced Components</h2>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-700 transition-colors">
              <DownloadIcon style={{ fontSize: 16 }} /> Export
            </button>
          </div>
          <div className="h-64 w-full flex justify-center items-center">
            {mostReplaced.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mostReplaced}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mostReplaced.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-sm italic">Belum ada data komponen diganti.</div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Low Stock Alert */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Low Stock Alert</h2>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-700 transition-colors">
            <DownloadIcon style={{ fontSize: 16 }} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Component</th>
                <th scope="col" className="px-6 py-3 font-medium text-center">Current Stock</th>
                <th scope="col" className="px-6 py-3 font-medium text-center">Minimum Required</th>
                <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length > 0 ? (
                lowStock.map((item, index) => {
                  const stock = parseInt(item.stock);
                  const minStock = parseInt(item.min_stock);
                  
                  // Tentukan Status secara dinamis jika view bawaan hanya 'Critical' dan 'Safe'
                  let statusLabel = item.STATUS || 'Safe';
                  let statusColor = "text-green-600 bg-green-50 border-green-200"; // Good
                  
                  if (stock <= minStock) {
                    statusLabel = 'Critical';
                    statusColor = "text-red-600 bg-red-50 border-red-200";
                  } else if (stock <= minStock + 3) {
                    // Jika stok hampir menyentuh min_stock
                    statusLabel = 'Warning';
                    statusColor = "text-orange-600 bg-orange-50 border-orange-200";
                  }

                  return (
                    <tr key={index} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {item.component_name}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-700">
                        {stock}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500">
                        {minStock}
                      </td>
                      <td className="px-6 py-4 flex justify-center">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">
                    Semua komponen dalam stok aman.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Reliability Log Semester */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Reliability Log Semester (16 Weeks) {isSuperAdmin ? '' : `- Lab ${labName}`}
          </h2>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-700 transition-colors">
            <DownloadIcon style={{ fontSize: 16 }} /> Export PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
              {isSuperAdmin ? (
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Week</th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">Lab E4</th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">Lab L4</th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">Lab L3</th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">Lab L2</th>
                </tr>
              ) : (
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">PC Code</th>
                  {Array.from({ length: 16 }, (_, i) => (
                    <th key={i} scope="col" className="px-3 py-3 font-medium text-center">W{i + 1}</th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {isSuperAdmin ? (
                // SUPER ADMIN VIEW
                Array.from({ length: 16 }, (_, i) => {
                  const week = i + 1;
                  return (
                    <tr key={week} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">W{week}</td>
                      {['E4', 'L4', 'L3', 'L2'].map((lab, index) => {
                        // Dummy deterministic logic for "Not Available"
                        const isNotAvailable = (week * (index + 2)) % 11 === 0 || (week === 2 && lab === 'E4');
                        return (
                          <td key={lab} className="px-6 py-4 text-center">
                            {isNotAvailable ? (
                              <CancelIcon style={{ color: '#ef4444', fontSize: 18 }} />
                            ) : (
                              <CheckCircleIcon style={{ color: '#22c55e', fontSize: 18 }} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                // ADMIN LAB VIEW
                labPCs.length > 0 ? (
                  labPCs.map((pc, pcIndex) => (
                    <tr key={pc.pc_id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{pc.pc_code}</td>
                      {Array.from({ length: 16 }, (_, i) => {
                        const week = i + 1;
                        // Dummy deterministic logic for PC
                        const isNotAvailable = (pc.pc_id * week) % 19 === 0 || (week === 3 && pcIndex === 2);
                        return (
                          <td key={week} className="px-3 py-4 text-center">
                            {isNotAvailable ? (
                              <CancelIcon style={{ color: '#ef4444', fontSize: 18 }} />
                            ) : (
                              <CheckCircleIcon style={{ color: '#22c55e', fontSize: 18 }} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="17" className="px-6 py-8 text-center text-gray-400 italic">
                      Memuat data PC...
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          <div className="mt-4 px-4 flex gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircleIcon style={{ color: '#22c55e', fontSize: 16 }} /> = Available (V)
            </div>
            <div className="flex items-center gap-1">
              <CancelIcon style={{ color: '#ef4444', fontSize: 16 }} /> = Not Available (X)
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
