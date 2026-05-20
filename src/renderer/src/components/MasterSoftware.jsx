import React, { useState } from 'react'

export const MasterSoftware = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('All Course')

  const softwareData = [
    {
      id: 1,
      name: 'Visual Studio Code',
      version: 'Version 1.85.0',
      category: 'Pemrograman Dasar',
      requiredLabs: ['E4', 'L4', 'L3'],
      licenseType: 'Free',
      licenseExpiry: '31 Desember 2027',
      status: 'Installed',
      icon: '💻'
    },
    {
      id: 2,
      name: 'Microsoft Office 2021',
      version: 'Version 2021',
      category: 'All Courses',
      requiredLabs: ['E4', 'L4'],
      licenseType: 'Licensed',
      licenseExpiry: '15 Agustus 2026',
      status: 'Installed',
      icon: '📄'
    },
    {
      id: 3,
      name: 'Adobe Photoshop',
      version: 'Version 2024',
      category: 'Multimedia',
      requiredLabs: ['E4'],
      licenseType: 'Licensed',
      licenseExpiry: '30 Juni 2026',
      status: 'Installed',
      icon: '🎨'
    },
    {
      id: 4,
      name: 'MySQL Workbench',
      version: 'Version 8.0',
      category: 'Database',
      requiredLabs: ['E4', 'L4', 'L3'],
      licenseType: 'Free',
      licenseExpiry: '31 Desember 2028',
      status: 'Installed',
      icon: '🗄️'
    },
    {
      id: 5,
      name: 'Cisco Packet Tracer',
      version: 'Version 8.2',
      category: 'Jaringan Komputer',
      requiredLabs: ['L4'],
      licenseType: 'Free',
      licenseExpiry: '20 Maret 2027',
      status: 'Pending',
      icon: '🌐'
    },
    {
      id: 6,
      name: 'Android Studio',
      version: 'Version 2023.1',
      category: 'Mobile Development',
      requiredLabs: ['E4'],
      licenseType: 'Free',
      licenseExpiry: '31 Desember 2028',
      status: 'Installed',
      icon: '📱'
    }
  ]

  const courses = [
    'All Course',
    'Pemrograman Dasar',
    'Multimedia',
    'Database',
    'Jaringan Komputer',
    'Mobile Development'
  ]

  const getStatusIcon = (status) => (status === 'Installed' ? '✓' : '⚠️')

  const getStatusColor = (status) => (status === 'Installed' ? 'bg-green-50' : 'bg-orange-50')

  const getLicenseColor = (type) => (type === 'Free' ? 'text-green-600' : 'text-purple-600')

  const isLicenseExpiringSoon = (expiryDate) => expiryDate.includes('2026')

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Master Software</h2>
          <p className="text-slate-500 text-sm mt-1">Manajemen software dan lisensi laboratorium</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md">
          <span className="text-lg">+</span> Tambah Software
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari nama software atau versi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="relative min-w-max">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none pr-10 cursor-pointer transition-all"
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {softwareData.map((software) => (
          <div
            key={software.id}
            className={`${getStatusColor(software.status)} p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{software.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{software.name}</h3>
                  <p className="text-xs text-slate-600">{software.version}</p>
                </div>
              </div>
              <div className="text-xl">{getStatusIcon(software.status)}</div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">Mata Kuliah</p>
                <p className="text-sm text-slate-800">{software.category}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Required Lab</p>
                <div className="flex gap-2">
                  {software.requiredLabs.map((lab) => (
                    <span
                      key={lab}
                      className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded"
                    >
                      {lab}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">License Type</p>
                  <p className={`text-sm font-bold ${getLicenseColor(software.licenseType)}`}>
                    {software.licenseType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">License Expiry</p>
                  <p
                    className={`text-sm font-bold ${isLicenseExpiringSoon(software.licenseExpiry) ? 'text-orange-600' : 'text-green-600'}`}
                  >
                    {software.licenseExpiry}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-lg ${
                    software.status === 'Installed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {software.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
