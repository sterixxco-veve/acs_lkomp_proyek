// import React, { useState } from 'react'

// export const MasterSoftware = () => {
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedCourse, setSelectedCourse] = useState('All Course')

//   const softwareData = [
//     {
//       id: 1,
//       name: 'Visual Studio Code',
//       version: 'Version 1.85.0',
//       category: 'Pemrograman Dasar',
//       requiredLabs: ['E4', 'L4', 'L3'],
//       licenseType: 'Free',
//       licenseExpiry: '31 Desember 2027',
//       status: 'Installed',
//       icon: '💻'
//     },
//     {
//       id: 2,
//       name: 'Microsoft Office 2021',
//       version: 'Version 2021',
//       category: 'All Courses',
//       requiredLabs: ['E4', 'L4'],
//       licenseType: 'Licensed',
//       licenseExpiry: '15 Agustus 2026',
//       status: 'Installed',
//       icon: '📄'
//     },
//     {
//       id: 3,
//       name: 'Adobe Photoshop',
//       version: 'Version 2024',
//       category: 'Multimedia',
//       requiredLabs: ['E4'],
//       licenseType: 'Licensed',
//       licenseExpiry: '30 Juni 2026',
//       status: 'Installed',
//       icon: '🎨'
//     },
//     {
//       id: 4,
//       name: 'MySQL Workbench',
//       version: 'Version 8.0',
//       category: 'Database',
//       requiredLabs: ['E4', 'L4', 'L3'],
//       licenseType: 'Free',
//       licenseExpiry: '31 Desember 2028',
//       status: 'Installed',
//       icon: '🗄️'
//     },
//     {
//       id: 5,
//       name: 'Cisco Packet Tracer',
//       version: 'Version 8.2',
//       category: 'Jaringan Komputer',
//       requiredLabs: ['L4'],
//       licenseType: 'Free',
//       licenseExpiry: '20 Maret 2027',
//       status: 'Pending',
//       icon: '🌐'
//     },
//     {
//       id: 6,
//       name: 'Android Studio',
//       version: 'Version 2023.1',
//       category: 'Mobile Development',
//       requiredLabs: ['E4'],
//       licenseType: 'Free',
//       licenseExpiry: '31 Desember 2028',
//       status: 'Installed',
//       icon: '📱'
//     }
//   ]

//   const courses = [
//     'All Course',
//     'Pemrograman Dasar',
//     'Multimedia',
//     'Database',
//     'Jaringan Komputer',
//     'Mobile Development'
//   ]

//   const getStatusIcon = (status) => (status === 'Installed' ? '✓' : '⚠️')

//   const getStatusColor = (status) => (status === 'Installed' ? 'bg-green-50' : 'bg-orange-50')

//   const getLicenseColor = (type) => (type === 'Free' ? 'text-green-600' : 'text-purple-600')

//   const isLicenseExpiringSoon = (expiryDate) => expiryDate.includes('2026')

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-start">
//         <div>
//           <h2 className="text-3xl font-bold text-slate-900">Master Software</h2>
//           <p className="text-slate-500 text-sm mt-1">Manajemen software dan lisensi laboratorium</p>
//         </div>
//         <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md">
//           <span className="text-lg">+</span> Tambah Software
//         </button>
//       </div>

//       <div className="flex gap-4 items-center">
//         <div className="flex-1 relative">
//           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
//             <svg
//               viewBox="0 0 24 24"
//               width="18"
//               height="18"
//               stroke="currentColor"
//               strokeWidth="2"
//               fill="none"
//             >
//               <circle cx="11" cy="11" r="8"></circle>
//               <path d="m21 21-4.35-4.35"></path>
//             </svg>
//           </div>
//           <input
//             type="text"
//             placeholder="Cari nama software atau versi..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
//           />
//         </div>
//         <div className="relative min-w-max">
//           <select
//             value={selectedCourse}
//             onChange={(e) => setSelectedCourse(e.target.value)}
//             className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none pr-10 cursor-pointer transition-all"
//           >
//             {courses.map((course) => (
//               <option key={course} value={course}>
//                 {course}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {softwareData.map((software) => (
//           <div
//             key={software.id}
//             className={`${getStatusColor(software.status)} p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all`}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-start gap-3">
//                 <div className="text-3xl">{software.icon}</div>
//                 <div>
//                   <h3 className="font-bold text-slate-900 text-lg">{software.name}</h3>
//                   <p className="text-xs text-slate-600">{software.version}</p>
//                 </div>
//               </div>
//               <div className="text-xl">{getStatusIcon(software.status)}</div>
//             </div>

//             <div className="space-y-3">
//               <div>
//                 <p className="text-xs font-semibold text-slate-600 mb-1">Mata Kuliah</p>
//                 <p className="text-sm text-slate-800">{software.category}</p>
//               </div>

//               <div>
//                 <p className="text-xs font-semibold text-slate-600 mb-2">Required Lab</p>
//                 <div className="flex gap-2">
//                   {software.requiredLabs.map((lab) => (
//                     <span
//                       key={lab}
//                       className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded"
//                     >
//                       {lab}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-xs font-semibold text-slate-600 mb-1">License Type</p>
//                   <p className={`text-sm font-bold ${getLicenseColor(software.licenseType)}`}>
//                     {software.licenseType}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs font-semibold text-slate-600 mb-1">License Expiry</p>
//                   <p
//                     className={`text-sm font-bold ${isLicenseExpiringSoon(software.licenseExpiry) ? 'text-orange-600' : 'text-green-600'}`}
//                   >
//                     {software.licenseExpiry}
//                   </p>
//                 </div>
//               </div>

//               <div className="pt-3 border-t border-slate-200">
//                 <span
//                   className={`inline-block text-xs font-semibold px-3 py-1 rounded-lg ${
//                     software.status === 'Installed'
//                       ? 'bg-green-100 text-green-700'
//                       : 'bg-orange-100 text-orange-700'
//                   }`}
//                 >
//                   {software.status}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

import React, { useState, useEffect } from 'react'

export const MasterSoftware = ({ user }) => {
  const [softwareData, setSoftwareData] = useState([])
  const [labsMaster, setLabsMaster] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('Semua Mata Kuliah')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const initialForm = {
    software_name: '',
    version: '',
    mata_kuliah: 'Pemrograman Dasar',
    license_type: 'Free',
    license_expiry: '',
    lab_ids: []
  }
  const [formData, setFormData] = useState(initialForm)

  // dibuat dari db harusnya
  const courses = [
    'Semua Mata Kuliah',
    'Pemrograman Dasar',
    'Multimedia',
    'Database',
    'Jaringan Komputer',
    'Mobile Development'
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // 1. Tarik & Mapping Lab
    const labsFromDB = await window.api.getLabs()
    setLabsMaster(labsFromDB.map((l) => ({ id: l.lab_id, name: l.lab_name })))

    // 2. Tarik & Mapping Software (Filter Lab Otomatis)
    const labIdFilter = user?.role_id === 5 ? null : user?.lab_id
    const res = await window.api.getSoftware(labIdFilter)

    // Mapping Anti-Huruf Kapital dari DB
    const formattedData = res.map((s) => ({
      ...s,
      software_id: s.SOFTWARE_ID || s.software_id,
      software_name: s.SOFTWARE_NAME || s.software_name,
      version: s.VERSION || s.version,
      mata_kuliah: s.MATA_KULIAH || s.mata_kuliah,
      license_type: s.LICENSE_TYPE || s.license_type,
      license_expiry: s.LICENSE_EXPIRY || s.license_expiry,
      lab_ids: s.LAB_IDS || s.lab_ids,
      lab_names: s.LAB_NAMES || s.lab_names,
      installed_count: s.INSTALLED_COUNT || s.installed_count || 0
    }))

    setSoftwareData(formattedData)
  }

  const handleLabToggle = (labId) => {
    setFormData((prev) => {
      const currentLabs = prev.lab_ids
      if (currentLabs.includes(labId)) {
        return { ...prev, lab_ids: currentLabs.filter((id) => id !== labId) }
      } else {
        return { ...prev, lab_ids: [...currentLabs, labId] }
      }
    })
  }

  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      // Kalau Admin Lab, otomatis array diisi lab-nya sendiri
      lab_ids: user?.role_id !== 5 ? [user?.lab_id] : []
    })
    setIsAddOpen(true)
  }

  const handleOpenEdit = (sw) => {
    setSelectedItem(sw)
    const formattedDate = sw.license_expiry
      ? new Date(sw.license_expiry).toISOString().split('T')[0]
      : ''
    // String "1,2,3" jadi array [1,2,3]
    const labIdsArray = sw.lab_ids ? String(sw.lab_ids).split(',').map(Number) : []

    setFormData({
      ...sw,
      license_expiry: formattedDate,
      lab_ids: labIdsArray
    })
    setIsEditOpen(true)
  }

  const handleOpenDelete = (sw) => {
    setSelectedItem(sw)
    setIsDeleteOpen(true)
  }

  const handleSave = async (isEdit = false) => {
    if (!formData.software_name || !formData.version) {
      alert('Nama Software dan Versi wajib diisi!')
      return
    }

    const payload = {
      ...formData,
      license_expiry: formData.license_expiry || null
    }

    const res = isEdit
      ? await window.api.updateSoftware(payload)
      : await window.api.addSoftware(payload)

    if (res.success) {
      isEdit ? setIsEditOpen(false) : setIsAddOpen(false)
      loadData()
    } else {
      alert('Gagal menyimpan data: ' + res.message)
    }
  }

  const handleDelete = async () => {
    const res = await window.api.deleteSoftware(selectedItem.software_id)
    if (res.success) {
      setIsDeleteOpen(false)
      loadData()
    } else {
      alert(res.message)
    }
  }

  const getIcon = (course) => {
    const icons = {
      'Pemrograman Dasar': '💻',
      Multimedia: '🎨',
      Database: '🗄️',
      'Jaringan Komputer': '🌐',
      'Mobile Development': '📱'
    }
    return icons[course] || '📄'
  }

  const formatDateUI = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const filteredData = softwareData.filter((s) => {
    const matchSearch =
      s.software_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.version.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCourse = selectedCourse === 'Semua Mata Kuliah' || s.mata_kuliah === selectedCourse
    return matchSearch && matchCourse
  })

  return (
    <div className="p-8 w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Master Software</h2>
          <p className="text-slate-500 text-sm mt-1">Manajemen software dan akses lab</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all shadow-md"
        >
          <span className="text-lg">+</span> Tambah Software
        </button>
      </div>

      {/* FILTER */}
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
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibol focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.map((software) => {
          const labsArray = software.lab_names ? String(software.lab_names).split(', ') : []
          return (
            <div
              key={software.software_id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => handleOpenEdit(software)}
                  className="p-2 bg-slate-100 rounded-lg text-blue-600 hover:bg-blue-100 shadow-sm"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => handleOpenDelete(software)}
                  className="p-2 bg-slate-100 rounded-lg text-red-600 hover:bg-red-100 shadow-sm"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="text-4xl">{getIcon(software.mata_kuliah)}</div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{software.software_name}</h3>
                  <p className="text-sm font-medium text-slate-600">{software.version}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Mata Kuliah
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{software.mata_kuliah}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Access Labs
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {labsArray.map((lab, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md"
                      >
                        {lab}
                      </span>
                    ))}
                    {labsArray.length === 0 && (
                      <span className="text-sm text-slate-400 font-medium">Belum ada lab</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      License
                    </p>
                    <p
                      className={`text-sm font-bold ${software.license_type === 'Free' ? 'text-green-600' : 'text-purple-600'}`}
                    >
                      {software.license_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Expiry Date
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {formatDateUI(software.license_expiry)}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status Instalasi
                  </p>
                  <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                    🖥️ Terinstal di {software.installed_count} PC
                  </span>
                </div>
              </div>
            </div>
          )
        })}
        {/* EMPTY STATE SOFTWARE */}
        {filteredData.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Belum Ada Data Software</h3>
            <p className="text-slate-500 text-center">
              Data yang Anda cari tidak ditemukan atau laboratorium belum memiliki software.
            </p>
          </div>
        )}
      </div>

      {/* ================= MODAL FORM ================= */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F8FAFC] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
              <h3 className="text-xl font-bold text-slate-800">
                {isEditOpen ? 'Edit Software' : 'Tambah Software Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false)
                  setIsEditOpen(false)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5 bg-white max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Nama Software
                  </label>
                  <input
                    type="text"
                    value={formData.software_name}
                    onChange={(e) => setFormData({ ...formData, software_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="Misal: Visual Studio Code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Versi</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="v1.85.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mata Kuliah</label>
                  <select
                    value={formData.mata_kuliah}
                    onChange={(e) => setFormData({ ...formData, mata_kuliah: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {courses
                      .filter((c) => c !== 'Semua Mata Kuliah')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Akses Lab</label>
                  <div className="flex flex-wrap gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    {user?.role_id === 5 ? (
                      labsMaster.map((lab) => (
                        <label key={lab.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.lab_ids.includes(lab.id)}
                            onChange={() => handleLabToggle(lab.id)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700">{lab.name}</span>
                        </label>
                      ))
                    ) : (
                      <label className="flex items-center gap-2 cursor-not-allowed opacity-75">
                        <input
                          type="checkbox"
                          checked={true}
                          readOnly
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 bg-blue-100"
                        />
                        <span className="text-sm text-slate-700">
                          {labsMaster.find((l) => l.id == user?.lab_id)?.name || 'Lab Anda'}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">(Auto-locked)</span>
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Tipe Lisensi
                  </label>
                  <select
                    value={formData.license_type}
                    onChange={(e) => setFormData({ ...formData, license_type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Free">Free</option>
                    <option value="Licensed">Licensed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Tanggal Expired
                  </label>
                  <input
                    type="date"
                    value={formData.license_expiry}
                    onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#F8FAFC] border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAddOpen(false)
                  setIsEditOpen(false)
                }}
                className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => handleSave(isEditOpen)}
                className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg font-semibold shadow-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL HAPUS ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F8FAFC] w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Konfirmasi Hapus</h3>
              <p className="text-slate-600">
                Apakah Anda yakin ingin menghapus software{' '}
                <span className="font-bold text-slate-900">{selectedItem?.software_name}</span>?
              </p>
            </div>
            <div className="p-4 bg-[#F8FAFC] border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-5 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
