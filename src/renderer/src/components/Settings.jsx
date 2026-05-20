import React, { useState } from 'react'
import { Icons } from '../lib/Icons'

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="p-8 h-full bg-[#f8fafc] text-slate-800 font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-500 font-medium">Pengaturan aplikasi dan manajemen pengguna</p>
      </div>

      <div className="flex items-center gap-6 mb-8 border-b border-slate-200/60 pb-4">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors ${
            activeTab === 'general'
              ? 'bg-slate-100 text-slate-800'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Icons.Palette />
          General
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors ${
            activeTab === 'users'
              ? 'bg-slate-100 text-slate-800'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Icons.User />
          User Management
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors ${
            activeTab === 'notifications'
              ? 'bg-slate-100 text-slate-800'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Icons.Bell />
          Notifications
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="max-w-4xl space-y-6">
          {/* Appearance Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Theme</h3>
                <p className="text-sm text-slate-500">Pilih tema tampilan aplikasi</p>
              </div>
              <div className="relative">
                <select className="appearance-none bg-slate-100 border border-slate-100 text-slate-800 py-2.5 pl-4 pr-10 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[140px]">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg
                    className="fill-current h-4 w-4 text-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Lab Access Settings Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Lab Access Settings</h2>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    Auto-refresh Dashboard
                  </h3>
                  <p className="text-sm text-slate-500">
                    Refresh otomatis dashboard setiap 30 detik
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5c7cfa]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">Show Lab Statistics</h3>
                  <p className="text-sm text-slate-500">Tampilkan statistik per lab di dashboard</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5c7cfa]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8 pb-10">
            <button className="flex items-center gap-2 bg-[#5c7cfa] hover:bg-[#4b6bf5] text-white px-5 py-2.5 rounded-[10px] font-semibold transition-colors shadow-sm text-sm">
              <Icons.Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Placeholders for other tabs */}
      {activeTab === 'users' && (
        <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <p className="text-slate-500 text-center">User Management content goes here.</p>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <p className="text-slate-500 text-center">Notifications settings go here.</p>
        </div>
      )}
    </div>
  )
}
