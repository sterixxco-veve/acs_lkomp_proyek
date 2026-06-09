import React, { useState, useEffect } from 'react'

export const MasterPC = ({ user }) => {
  const [pcData, setPcData] = useState([])
  const [labs, setLabs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLab, setSelectedLab] = useState('Semua Lab')

  // State Components
  const [componentsMaster, setComponentsMaster] = useState([])

  // State Modal
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedPC, setSelectedPC] = useState(null)

  // State untuk Kelola Software
  const [isSoftwareModalOpen, setIsSoftwareModalOpen] = useState(false)
  const [selectedPcForSoftware, setSelectedPcForSoftware] = useState(null)
  const [availableSoftware, setAvailableSoftware] = useState([])
  const [installedSoftwareIds, setInstalledSoftwareIds] = useState([])

  // State Form Edit
  const [editForm, setEditForm] = useState({
    pc_id: '',
    pc_code: '',
    lab_id: '',
    processor: '',
    ram: '',
    storage: '',
    gpu: '',
    status: ''
  })

  // State Form Add
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    pc_code: '',
    lab_id: '',
    processor: '',
    ram: '',
    storage: '',
    gpu: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const labIdFilter = user?.role_id === 5 ? null : user?.lab_id
    const rawPcs = await window.api.getPCs(labIdFilter)

    const formattedPcs = rawPcs.map((pc) => ({
      ...pc,
      storage: pc.STORAGE || pc.storage,
      status: pc.STATUS || pc.status
    }))
    setPcData(formattedPcs)

    const labsFromDB = await window.api.getLabs()
    const formattedLabs = labsFromDB.map((l) => ({ id: l.lab_id, name: l.lab_name }))
    setLabs(formattedLabs)

    const compsFromDB = await window.api.getComponents()
    const formattedComps = compsFromDB.map((c) => ({
      ...c,
      type: c.TYPE || c.type,
      brand: c.BRAND || c.brand,
      stock: c.STOCK || c.stock,
      min_stock: c.MIN_STOCK || c.min_stock
    }))

    setComponentsMaster(formattedComps)
  }

  // buka mode add
  const handleOpenAdd = () => {
    setAddForm({
      pc_code: '',
      lab_id: user?.role_id === 5 ? labs[0]?.id : user?.lab_id,
      processor: '',
      ram: '',
      storage: '',
      gpu: ''
    })
    setIsAddOpen(true)
  }

  const handleAdd = async () => {
    // 1. Cek isi kosong
    if (!addForm.pc_code || !addForm.processor) {
      alert('PC Code dan Processor wajib diisi!')
      return
    }

    // 2. VALIDASI KODE PC VS LAB
    const selectedLabName = labs.find((l) => l.id == addForm.lab_id)?.name // misal "E4"
    if (!addForm.pc_code.toUpperCase().startsWith(selectedLabName)) {
      alert(`Kode PC harus diawali dengan nama lab (${selectedLabName}).`)
      return
    }

    const res = await window.api.addPC({ ...addForm, pc_code: addForm.pc_code.toUpperCase() })
    if (res.success) {
      setIsAddOpen(false)
      loadData()
    } else {
      alert('Gagal tambah PC: ' + res.message)
    }
  }

  // handle model open software
  const handleOpenSoftware = async (pc) => {
    setSelectedPcForSoftware(pc)

    const labSoftware = await window.api.getSoftware(pc.lab_id)
    setAvailableSoftware(labSoftware)

    const installedIds = await window.api.getPcInstalledSoftware(pc.pc_id)
    setInstalledSoftwareIds(installedIds)

    setIsSoftwareModalOpen(true)
  }

  const handleToggleSoftware = (softwareId) => {
    setInstalledSoftwareIds((prev) =>
      prev.includes(softwareId) ? prev.filter((id) => id !== softwareId) : [...prev, softwareId]
    )
  }

  const handleSaveSoftware = async () => {
    const payload = {
      pcId: selectedPcForSoftware.pc_id,
      softwareIds: installedSoftwareIds
    }
    const res = await window.api.updatePcSoftware(payload)

    if (res.success) {
      setIsSoftwareModalOpen(false)
      alert('Instalasi software berhasil diperbarui!')
    } else {
      alert('Gagal memperbarui software: ' + res.message)
    }
  }

  // buka mode edit
  const handleOpenEdit = (pc) => {
    setSelectedPC(pc)
    setEditForm({
      pc_id: pc.pc_id,
      pc_code: pc.pc_code,
      lab_id: pc.lab_id,
      processor: pc.processor,
      ram: pc.ram,
      storage: pc.storage,
      gpu: pc.gpu,
      status: pc.status
    })
    setIsEditOpen(true)
  }

  // update ke DB
  const handleUpdate = async () => {
    const selectedLabName = labs.find((l) => l.id == editForm.lab_id)?.name
    if (!editForm.pc_code.toUpperCase().startsWith(selectedLabName)) {
      alert(`Kode PC harus diawali dengan nama lab (${selectedLabName}).`)
      return
    }

    const res = await window.api.updatePC({ ...editForm, pc_code: editForm.pc_code.toUpperCase() })
    if (res.success) {
      setIsEditOpen(false)
      loadData()
    } else {
      alert('Gagal update: ' + res.message)
    }
  }

  // buka mode delete
  const handleOpenDelete = (pc) => {
    setSelectedPC(pc)
    setIsDeleteOpen(true)
  }

  // soft delete execution
  const handleDelete = async () => {
    const res = await window.api.deletePC(selectedPC.pc_id)
    if (res.success) {
      setIsDeleteOpen(false)
      loadData()
    } else {
      alert('Gagal hapus: ' + res.message)
    }
  }

  // Filtering System
  const filteredPCs = pcData.filter((pc) => {
    const matchSearch =
      pc.pc_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pc.processor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchLab = selectedLab === 'Semua Lab' || pc.lab_name === `Lab ${selectedLab}`
    return matchSearch && matchLab
  })

  const getStatusBadgeStyle = (status) => {
    if (status === 'Usable') return 'bg-green-100 text-green-700 border-green-200'
    if (status === 'Maintenance') return 'bg-orange-100 text-orange-700 border-orange-200'
    if (status === 'Broken') return 'bg-red-100 text-red-700 border-red-200'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Master PC</h2>
          <p className="text-slate-500 text-sm mt-1">Manajemen data PC laboratorium komputer</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-[#2563EB] text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all shadow-sm"
        >
          <span className="text-lg">+</span> Tambah PC
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Cari PC code atau processor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            🔍
          </div>
        </div>
        {user?.role_id === 5 ? (
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="px-4 py-3 w-48 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="Semua Lab">Semua Lab</option>
            {labs.map((lab) => (
              <option key={lab.id} value={lab.name}>
                {lab.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="px-4 py-3 w-48 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-medium flex items-center justify-between cursor-not-allowed">
            <span>{labs.find((l) => l.id == user?.lab_id)?.name || 'Lab'}</span>
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600">
            <tr>
              <th className="py-4 px-6 font-semibold">PC Code</th>
              <th className="py-4 px-6 font-semibold">Lab</th>
              <th className="py-4 px-6 font-semibold">Processor</th>
              <th className="py-4 px-6 font-semibold">RAM</th>
              <th className="py-4 px-6 font-semibold">Storage</th>
              <th className="py-4 px-6 font-semibold">GPU</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPCs.length > 0 ? (
              filteredPCs.map((pc) => (
                <tr key={pc.pc_id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6 font-bold text-slate-800">{pc.pc_code}</td>
                  <td className="py-4 px-6 font-semibold text-blue-600">
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">
                      {pc.lab_name.replace('Lab ', '')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{pc.processor}</td>
                  <td className="py-4 px-6 text-slate-600">{pc.ram}</td>
                  <td className="py-4 px-6 text-slate-600">{pc.storage}</td>
                  <td className="py-4 px-6 text-slate-600">{pc.gpu || '-'}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 border rounded-full text-xs font-bold ${getStatusBadgeStyle(pc.status)}`}
                    >
                      {pc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex justify-center gap-3">
                    {/* ICON EDIT (Default Biru) */}
                    <button
                      onClick={() => handleOpenEdit(pc)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    {/* ICON DELETE (Default Merah) */}
                    <button
                      onClick={() => handleOpenDelete(pc)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                    {/* TOMBOL KELOLA SOFTWARE */}
                    <button
                      onClick={() => handleOpenSoftware(pc)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      title="Kelola Software"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-16 px-4 text-center bg-slate-50/50">
                  <div className="text-5xl mb-4">🖥️</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">PC Tidak Ditemukan</h3>
                  <p className="text-slate-500">
                    Belum ada data PC di laboratorium ini atau pencarian tidak cocok.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL EDIT PC ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F8FAFC] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
              <h3 className="text-xl font-bold text-slate-800">Edit PC</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5 bg-white">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">PC Code</label>
                  <input
                    type="text"
                    value={editForm.pc_code}
                    onChange={(e) => setEditForm({ ...editForm, pc_code: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-blue-400 rounded-lg bg-blue-50 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Lab</label>
                  <select
                    value={editForm.lab_id}
                    onChange={(e) => setEditForm({ ...editForm, lab_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {labs.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* --- PROCESSOR --- */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Processor</label>
                  <select
                    value={addForm.processor}
                    onChange={(e) => setAddForm({ ...addForm, processor: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Pilih Processor...</option>
                    {componentsMaster
                      .filter((c) => c.type === 'Processor')
                      .map((comp) => (
                        <option key={comp.component_id} value={comp.component_name}>
                          {comp.component_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* --- RAM --- */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">RAM</label>
                  <select
                    value={addForm.ram}
                    onChange={(e) => setAddForm({ ...addForm, ram: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Pilih RAM...</option>
                    {componentsMaster
                      .filter((c) => c.type === 'RAM')
                      .map((comp) => (
                        <option key={comp.component_id} value={comp.component_name}>
                          {comp.component_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* --- STORAGE --- */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Storage</label>
                  <select
                    value={addForm.storage}
                    onChange={(e) => setAddForm({ ...addForm, storage: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Pilih Storage...</option>
                    {/* Gabung filter SSD dan HDD karena Storage bisa pakai keduanya */}
                    {componentsMaster
                      .filter((c) => c.type === 'SSD' || c.type === 'HDD')
                      .map((comp) => (
                        <option key={comp.component_id} value={comp.component_name}>
                          {comp.component_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* --- GPU --- */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    GPU (Opsional)
                  </label>
                  <select
                    value={addForm.gpu}
                    onChange={(e) => setAddForm({ ...addForm, gpu: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Pilih GPU (Atau Kosongi)...</option>
                    {componentsMaster
                      .filter((c) => c.type === 'GPU')
                      .map((comp) => (
                        <option key={comp.component_id} value={comp.component_name}>
                          {comp.component_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Usable">Usable</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Broken">Broken</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#F8FAFC] border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg font-semibold"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL HAPUS PC ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F8FAFC] w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Konfirmasi Hapus</h3>
              <p className="text-slate-600">
                Apakah Anda yakin ingin menghapus PC{' '}
                <span className="font-bold text-slate-900">{selectedPC?.pc_code}</span>? Tindakan
                ini tidak dapat dibatalkan.
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

      {/* ================= MODAL KELOLA SOFTWARE ================= */}
      {isSoftwareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F8FAFC] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Instalasi Software</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  PC:{' '}
                  <span className="text-indigo-600 font-bold">
                    {selectedPcForSoftware?.pc_code}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setIsSoftwareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-white max-h-[60vh] overflow-y-auto">
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Software yang diizinkan untuk lab ini (Centang yang terinstal):
              </label>

              <div className="space-y-3">
                {availableSoftware.length === 0 ? (
                  <div className="p-4 bg-orange-50 rounded-lg text-orange-700 text-sm font-medium border border-orange-200">
                    ⚠️ Belum ada software yang diizinkan untuk Lab ini. Silakan atur di Master
                    Software.
                  </div>
                ) : (
                  availableSoftware.map((sw) => (
                    <label
                      key={sw.software_id}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={installedSoftwareIds.includes(sw.software_id)}
                          onChange={() => handleToggleSoftware(sw.software_id)}
                          className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{sw.software_name}</p>
                          <p className="text-xs text-slate-500">
                            {sw.mata_kuliah} • {sw.version}
                          </p>
                        </div>
                      </div>
                      {installedSoftwareIds.includes(sw.software_id) && (
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                          Installed
                        </span>
                      )}
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setIsSoftwareModalOpen(false)}
                className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleSaveSoftware}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm"
              >
                Simpan Instalasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH PC ================= */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F8FAFC] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
              <h3 className="text-xl font-bold text-slate-800">Tambah PC Baru</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5 bg-white">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">PC Code</label>
                  <input
                    type="text"
                    value={addForm.pc_code}
                    onChange={(e) => setAddForm({ ...addForm, pc_code: e.target.value })}
                    className="text-slate-900 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 transition-all"
                    placeholder="Misal: E4-PC-005"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Lab</label>
                  {user?.role_id !== 5 ? (
                    <div className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-medium">
                      {labs.find((l) => l.id == addForm.lab_id)?.name || '-'}
                    </div>
                  ) : (
                    <select
                      value={addForm.lab_id}
                      onChange={(e) => setAddForm({ ...addForm, lab_id: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all"
                    >
                      {labs.map((lab) => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {/* --- PROCESSOR --- */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Processor</label>
                  <select
                    value={addForm.processor}
                    onChange={(e) => setAddForm({ ...addForm, processor: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Pilih Processor...</option>
                    {componentsMaster
                      .filter((c) => c.type === 'Processor')
                      .map((comp) => (
                        <option key={comp.component_id} value={comp.component_name}>
                          {comp.component_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* --- RAM --- */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">RAM</label>
                  <select
                    value={addForm.ram}
                    onChange={(e) => setAddForm({ ...addForm, ram: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Pilih RAM...</option>
                    {componentsMaster
                      .filter((c) => c.type === 'RAM')
                      .map((comp) => (
                        <option key={comp.component_id} value={comp.component_name}>
                          {comp.component_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* --- STORAGE --- */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Storage</label>
                  <select
                    value={addForm.storage}
                    onChange={(e) => setAddForm({ ...addForm, storage: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Pilih Storage...</option>
                    {componentsMaster
                      .filter((c) => c.type === 'SSD' || c.type === 'HDD')
                      .map((comp) => (
                        <option key={comp.component_id} value={comp.component_name}>
                          {comp.component_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* --- GPU --- */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    GPU (Opsional)
                  </label>
                  <select
                    value={addForm.gpu}
                    onChange={(e) => setAddForm({ ...addForm, gpu: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Pilih GPU (Atau Kosongi)...</option>
                    {componentsMaster
                      .filter((c) => c.type === 'GPU')
                      .map((comp) => (
                        <option key={comp.component_id} value={comp.component_name}>
                          {comp.component_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Opsi Status (Disabled/Readonly) karena default-nya Usable untuk PC Baru */}
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select
                    disabled
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 focus:outline-none appearance-none"
                  >
                    <option>Usable</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#F8FAFC] border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setIsAddOpen(false)}
                className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg font-semibold transition-colors shadow-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
