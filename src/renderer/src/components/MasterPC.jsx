import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export const MasterPC = () => {
  const { user } = useOutletContext()

  const [pcData, setPcData] = useState([])
  const [labs, setLabs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLab, setSelectedLab] = useState('Semua Lab')
  const [componentsMaster, setComponentsMaster] = useState([])

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedPC, setSelectedPC] = useState(null)

  const [isSoftwareModalOpen, setIsSoftwareModalOpen] = useState(false)
  const [selectedPcForSoftware, setSelectedPcForSoftware] = useState(null)
  const [availableSoftware, setAvailableSoftware] = useState([])
  const [installedSoftwareIds, setInstalledSoftwareIds] = useState([])

  const initialForm = {
    pc_id: '',
    pc_code: '',
    lab_id: '',
    processor: '',
    ram: '',
    storage: '',
    motherboard: '',
    cooling: '',
    psu:'',
    gpu: '',
    status: 'Usable'
  }

  const [editForm, setEditForm] = useState(initialForm)
  const [addForm, setAddForm] = useState(initialForm)
  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const labIdFilter = user?.role_id === 5 ? null : user?.lab_id
    const rawPcs = await window.api.getPCs(labIdFilter)

    const formattedPcs = rawPcs.map((pc) => ({
      ...pc,
      storage: pc.STORAGE || pc.storage,
      motherboard: pc.MOTHERBOARD || pc.motherboard,
      cooling: pc.COOLING || pc.cooling,
      psu: pc.PSU || pc.psu,
      status: pc.STATUS || pc.status
    }))
    setPcData(formattedPcs)

    const labsFromDB = await window.api.getLabs()
    setLabs(labsFromDB.map((l) => ({ id: l.lab_id, name: l.lab_name })))

    const compsFromDB = await window.api.getComponents()
    const formattedComps = compsFromDB.map((c) => ({
      ...c,
      type: c.TYPE || c.type,
      brand: c.BRAND || c.brand,
      stock: c.STOCK || c.stock
    }))
    setComponentsMaster(formattedComps)
  }

  const handleOpenAdd = () => {
    setAddForm({
      ...initialForm,
      lab_id: user?.role_id === 5 ? labs[0]?.id : user?.lab_id
    })
    setIsAddOpen(true)
  }

  const handleAdd = async () => {
    // VALIDASI KOSONG
    if (
      !addForm.pc_code ||
      !addForm.processor ||
      !addForm.ram ||
      !addForm.storage ||
      !addForm.motherboard ||
      !addForm.psu ||
      !addForm.cooling
    ) {
      alert('Harap isi semua kolom yang bertanda bintang merah (*)!')
      return
    }

    // VALIDASI PREFIX LAB
    const selectedLabName = labs.find((l) => l.id == addForm.lab_id)?.name || ''
    const expectedPrefix = selectedLabName
      .replace(/lab\s*/i, '')
      .trim()
      .toUpperCase()

    if (!addForm.pc_code.toUpperCase().startsWith(expectedPrefix)) {
      alert(
        `Kode PC harus diawali dengan kode lab (${expectedPrefix}). Contoh: ${expectedPrefix}-PC-001`
      )
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

  const handleOpenEdit = (pc) => {
    setSelectedPC(pc)
    setEditForm({
      pc_id: pc.pc_id,
      pc_code: pc.pc_code,
      lab_id: pc.lab_id,
      processor: pc.processor,
      ram: pc.ram,
      storage: pc.storage,
      motherboard: pc.motherboard,
      cooling: pc.cooling,
      psu: pc.psu,
      gpu: pc.gpu,
      status: pc.status
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    // VALIDASI KOSONG
    if (
      !editForm.pc_code ||
      !editForm.processor ||
      !editForm.ram ||
      !editForm.storage ||
      !editForm.motherboard ||
      !editForm.psu ||
      !editForm.cooling
    ) {
      alert('Harap isi semua kolom yang bertanda bintang merah (*)!')
      return
    }

    // VALIDASI PREFIX LAB
    const selectedLabName = labs.find((l) => l.id == editForm.lab_id)?.name || ''
    const expectedPrefix = selectedLabName
      .replace(/lab\s*/i, '')
      .trim()
      .toUpperCase()

    if (!editForm.pc_code.toUpperCase().startsWith(expectedPrefix)) {
      alert(
        `Kode PC harus diawali dengan kode lab (${expectedPrefix}). Contoh: ${expectedPrefix}-PC-001`
      )
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

  const handleOpenDelete = (pc) => {
    setSelectedPC(pc)
    setIsDeleteOpen(true)
  }

  const handleDelete = async () => {
    try {
      const res = await window.api.deletePC(selectedPC.pc_id)
      if (res.success) {
        setIsDeleteOpen(false)
        loadData()
      } else {
        alert('Gagal hapus: ' + res.message)
      } 
    } catch (err) {
      console.error(err)
      alert('⚠️ Terjadi error di sistem saat menghapus PC + ' + err.message)
    }
  }

  const handleOpenSoftware = async (pc) => {
    setSelectedPcForSoftware(pc)

    const targetLabId = pc.lab_id || pc.LAB_ID;
    const targetPcId = pc.pc_id || pc.PC_ID;

    try {
      // Panggil API dengan benar pakai targetLabId
      const rawSoftware = await window.api.getSoftware(targetLabId);

      const formattedSoftware = (rawSoftware || []).map((s) => ({
        ...s,
        software_id: s.SOFTWARE_ID || s.software_id,
        software_name: s.SOFTWARE_NAME || s.software_name,
        version: s.VERSION || s.version,
        mata_kuliah: s.MATA_KULIAH || s.mata_kuliah
      }))

      setAvailableSoftware(formattedSoftware)

      const installedIds = await window.api.getPcInstalledSoftware(targetPcId)
      setInstalledSoftwareIds(installedIds || [])

      setIsSoftwareModalOpen(true)
    } catch (err) {
      console.error("Error modal software:", err)
    }
  }

  const handleToggleSoftware = (softwareId) => {
    setInstalledSoftwareIds((prev) =>
      prev.includes(softwareId) ? prev.filter((id) => id !== softwareId) : [...prev, softwareId]
    )
  }

  const handleSaveSoftware = async () => {
    const payload = { pcId: selectedPcForSoftware.pc_id, softwareIds: installedSoftwareIds }
    const res = await window.api.updatePcSoftware(payload)
    if (res.success) {
      setIsSoftwareModalOpen(false)
      alert('Instalasi software berhasil diperbarui!')
    } else {
      alert('Gagal memperbarui software: ' + res.message)
    }
  }

  const filteredPCs = pcData.filter((pc) => {
    const matchSearch =
      pc.pc_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pc.processor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchLab =
      selectedLab === 'Semua Lab' || pc.lab_name.includes(selectedLab.replace('Lab ', ''))
    return matchSearch && matchLab
  })

  const getStatusBadgeStyle = (status) => {
    if (status === 'Usable') return 'bg-green-100 text-green-700 border-green-200'
    if (status === 'Maintenance') return 'bg-orange-100 text-orange-700 border-orange-200'
    if (status === 'Broken') return 'bg-red-100 text-red-700 border-red-200'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  return (
    <div className="p-8 w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER & FILTER (Sama seperti sebelumnya) */}
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
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600">
            <tr>
              <th className="py-4 px-6 font-semibold">PC Code</th>
              <th className="py-4 px-6 font-semibold">Lab</th>
              <th className="py-4 px-6 font-semibold">Processor</th>
              <th className="py-4 px-6 font-semibold">RAM</th>
              <th className="py-4 px-6 font-semibold">Storage</th>
              <th className="py-4 px-6 font-semibold">Motherboard</th>
              <th className="py-4 px-6 font-semibold">Cooling</th>
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
                  <td className="py-4 px-6 text-slate-600">{pc.motherboard || '-'}</td>
                  <td className="py-4 px-6 text-slate-600">{pc.cooling || '-'}</td>
                  <td className="py-4 px-6 text-slate-600">{pc.gpu || '-'}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 border rounded-full text-xs font-bold ${getStatusBadgeStyle(pc.status)}`}
                    >
                      {pc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex justify-center gap-3">
                    <button
                      onClick={() => handleOpenEdit(pc)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit PC"
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
                    <button
                      onClick={() => handleOpenDelete(pc)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete PC"
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
                <td colSpan="10" className="py-16 px-4 text-center bg-slate-50/50">
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

      {/* ================= MODAL TAMBAH & EDIT PC ================= */}
      {(isAddOpen || isEditOpen) &&
        (() => {
          const formData = isEditOpen ? editForm : addForm
          const setForm = isEditOpen ? setEditForm : setAddForm
          const handleSubmit = isEditOpen ? handleUpdate : handleAdd
          const title = isEditOpen ? 'Edit PC' : 'Tambah PC Baru'

          return (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#F8FAFC] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
                  <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                  <button
                    onClick={() => (isEditOpen ? setIsEditOpen(false) : setIsAddOpen(false))}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6 space-y-5 bg-white max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        PC Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pc_code}
                        onChange={(e) => setForm({ ...formData, pc_code: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 uppercase placeholder-slate-400"
                        placeholder="Misal: E4-PC-005"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Lab <span className="text-red-500">*</span>
                      </label>
                      {user?.role_id !== 5 ? (
                        <div className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-medium">
                          {labs.find((l) => l.id == formData.lab_id)?.name || '-'}
                        </div>
                      ) : (
                        <select
                          value={formData.lab_id}
                          onChange={(e) => setForm({ ...formData, lab_id: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                        >
                          {labs.map((lab) => (
                            <option key={lab.id} value={lab.id}>
                              {lab.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Processor <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.processor}
                        onChange={(e) => setForm({ ...formData, processor: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
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
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        RAM <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.ram}
                        onChange={(e) => setForm({ ...formData, ram: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
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
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Storage <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.storage}
                        onChange={(e) => setForm({ ...formData, storage: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900  focus:outline-none focus:border-blue-500 bg-white"
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
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Motherboard <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.motherboard}
                        onChange={(e) => setForm({ ...formData, motherboard: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="">Pilih Motherboard...</option>
                        {componentsMaster
                          .filter((c) => c.type === 'Motherboard')
                          .map((comp) => (
                            <option key={comp.component_id} value={comp.component_name}>
                              {comp.component_name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Cooling <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.cooling}
                        onChange={(e) => setForm({ ...formData, cooling: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="">Pilih Cooling...</option>
                        {componentsMaster
                          .filter((c) => c.type === 'Cooling' || c.type === 'CPU Fan')
                          .map((comp) => (
                            <option key={comp.component_id} value={comp.component_name}>
                              {comp.component_name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        PSU <span className="text-red-500">*</span>
                      </label>

                      <select
                        value={formData.psu}
                        onChange={(e) => setForm({ ...formData, psu: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="">Pilih PSU...</option>

                        {componentsMaster
                          .filter((c) => c.type === 'PSU')
                          .map((comp) => (
                            <option
                              key={comp.component_id}
                              value={comp.component_name}
                            >
                              {comp.component_name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        GPU <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
                      </label>
                      <select
                        value={formData.gpu}
                        onChange={(e) => setForm({ ...formData, gpu: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900  focus:outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="">Pilih GPU...</option>
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
                        value={formData.status}
                        onChange={(e) => setForm({ ...formData, status: e.target.value })}
                        disabled={!isEditOpen}
                        className={`w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none ${!isEditOpen ? 'bg-slate-50 text-slate-500' : 'bg-white'}`}
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
                    onClick={() => (isEditOpen ? setIsEditOpen(false) : setIsAddOpen(false))}
                    className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg font-semibold shadow-sm"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )
        })()}

      {/* ================= MODAL HAPUS PC (Sama seperti sebelumnya) ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F8FAFC] w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-200">
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

      {/* ================= MODAL KELOLA SOFTWARE (Sama seperti sebelumnya) ================= */}
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
    </div>
  )
}
