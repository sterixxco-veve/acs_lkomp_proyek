import React, { useEffect, useState } from 'react'
import { PDFTemplate } from '../PDFTemplate'
import { useOutletContext } from 'react-router-dom'

export function SekretarisDashboard() {
  const { user } = useOutletContext()

  const [pdfData, setPdfData] = useState(null)
  const [peminjams, setPeminjams] = useState([])
  const [selectedLab, setSelectedLab] = useState("")
  const [selectedPeminjam, setSelectedPeminjam] = useState('')
  const selectedBorrower =
    peminjams.find(
      (p) =>
        p.id_peminjam == selectedPeminjam
    )

  const isMahasiswa =
    selectedBorrower?.kategori === "Mahasiswa"
  const [selectedItems, setSelectedItems] = useState([])
  const [eventName, setEventName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [totalUser, setTotalUser] = useState(0)

  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')

  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [tipePeminjaman, setTipePeminjaman] = useState('lab')
  const [pcs, setPcs] = useState([])
  const [selectedPC, setSelectedPC] = useState('')
  const [selectedComponent, setSelectedComponent] = useState('')
  const [qty, setQty] = useState(1)
  const [components, setComponents] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const addItem = (item) => {
    setSelectedItems([
      ...selectedItems,
      item
    ])
  }
  const addPCToList = () => {
    if (!selectedPC) {
      alert('Pilih PC dulu')
      return
    }

    const pc = pcs.find(
      (p) => p.pc_id == selectedPC
    )

    if (!pc) return

    setSelectedItems([
      ...selectedItems,
      {
        item_type: 'PC',
        reference_id: pc.pc_id,
        item_name: pc.pc_code,
        quantity: 1
      }
    ])
  }

  const addComponentToList = () => {
    if (!selectedComponent) {
      alert('Pilih Component dulu')
      return
    }

    const component = components.find(
      (c) => c.component_id == selectedComponent
    )

    if (!component) return

    setSelectedItems([
      ...selectedItems,
      {
        item_type: 'COMPONENT',
        reference_id: component.component_id,
        item_name: component.component_name,
        quantity: qty
      }
    ])
  }

  const removeItem = (index) => {
    setSelectedItems(
      selectedItems.filter((_, i) => i !== index)
    )
  }
  const loadData = async () => {
    const peminjam = await window.api.getPeminjam()
    const pcsData = await window.api.getPCs()
    const componentsData = await window.api.getComponents()

    setPeminjams(peminjam)
    setPcs(pcsData)
    setComponents(componentsData)
  }

  const loadPeminjam = async () => {
    try {
      const result = await window.api.getPeminjam()
      setPeminjams(result)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadPeminjam()
  }, [])

  const startDateTime =
    `${startDate} ${startTime}:00`

  const endDateTime =
    `${endDate} ${endTime}:00`

  const handleSubmit = async () => {
    if (
      tipePeminjaman === "lab" &&
      !eventName
    ) {
      alert("Nama kegiatan wajib diisi")
      return
    }
    if (!selectedPeminjam) {
      alert('Pilih peminjam')
      return
    }

    if (
      tipePeminjaman === 'item' &&
      selectedItems.length === 0
    ) {
      alert('Tambahkan item terlebih dahulu')
      return
    }

    try {
      const now = new Date();

      const nomorSurat =
        `LKOMP/${String(now.getMonth() + 1).padStart(2, "0")
        }/${now.getFullYear()
        }/${Date.now().toString().slice(-4)
        }`;

      // 1. SIMPAN DATA INDUK (PEMINJAMAN)
      const peminjaman =
        await window.api.createPeminjaman({
          document_number: nomorSurat,
          id_peminjam: selectedPeminjam,
          event_name: eventName,
          purpose: purpose,
          total_user: totalUser,
          borrow_start: startDateTime,
          borrow_end: endDateTime
        })

      const peminjamanId = peminjaman.peminjaman_id

      // 2. STRATEGI DETAIL FIX: Memastikan tipe 'lab' memiliki baris detail dengan qty 1 ke database
      let itemsToInsert = [];
      if (tipePeminjaman === "lab") {
        itemsToInsert.push({
          item_type: 'LAB',
          reference_id: 0, // sesuaikan id relasi lab jika ada di database master
          item_name: selectedLab,
          quantity: 1 // Sesuai kesepakatan, jumlah lab dihitung 1
        });
      } else {
        itemsToInsert = selectedItems;
      }

      // 3. LOOPING INSERT DETAIL PEMINJAMAN
      for (const item of itemsToInsert) {
        await window.api.addDetailPeminjaman({
          peminjaman_id: peminjamanId,
          item_type: item.item_type,
          reference_id: item.reference_id,
          item_name: item.item_name,
          quantity: item.quantity
        })
      }

      // 4. PENYUSUNAN ARRAY DATA UNTUK DOKUMEN PDF TEMPLATE
      let pdfItems = []
      if (tipePeminjaman === "lab") {
        pdfItems.push({
          item_name: selectedLab,
          quantity: totalUser || "-"
        })
      } else {
        pdfItems = selectedItems
      }

      const selectedBorrower =
        peminjams.find(
          (p) =>
            p.id_peminjam == selectedPeminjam
        )

      console.log(selectedBorrower)
      console.log(selectedBorrower?.kategori)

      setPdfData({
        nomorSurat,
        created_date:
          new Date().toLocaleDateString("id-ID"),

        requester_name:
          selectedBorrower?.nama_peminjam || "-",

        kategori:
          selectedBorrower?.kategori,

        tipe_peminjaman:
          tipePeminjaman,

        event_name:
          eventName,

        purpose,
        total_user: totalUser,

        borrow_start:
          startDateTime,

        borrow_end:
          endDateTime,

        items: pdfItems
      })

      // 5. PRINT MECHANISM
      setTimeout(() => {
        window.print()
      }, 2000)
      alert('Surat berhasil disimpan')

      // 6. RESET STATE FORM
      setSelectedItems([]);
      setSelectedPeminjam("");
      setEventName("");
      setPurpose("");
      setTotalUser(0);
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");

      alert("Surat berhasil dibuat");
    } catch (err) {
      console.error("ERROR SURAT:", err)

      alert(
        "Gagal menyimpan surat\n\n" +
        (err?.message || JSON.stringify(err))
      )
    }
  }
  return (
    <>
      <PDFTemplate data={pdfData} />
      <div className="min-h-screen bg-[#F5F7FB] font-sans antialiased text-[#1E293B]">
        {/* TOPBAR */}
        <div className="h-[70px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 bg-[#F8FAFC] px-4 py-2 rounded-xl text-sm font-medium border border-[#E2E8F0] text-[#64748B]">
              🗓️ {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="p-8 max-w-[1600px] mx-auto">
          {/* HERO */}
          <div className="bg-gradient-to-r from-[#30408D] to-[#5D7CEB] rounded-[2rem] shadow-md px-8 py-8 flex items-center gap-6 mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20">
              📄
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Surat Peminjaman Laboratorium</h1>
              <p className="text-white/80 mt-1.5 text-base md:text-lg font-medium">
                Form pengajuan surat peminjaman lab komputer dengan integrasi dokumen otomatis
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-8 items-start">

            {/* LEFT SIDE: FORM MAIN */}
            <div className="bg-white rounded-[2rem] border border-[#E2E8F0] shadow-sm p-8 space-y-8">
              {/* TITLE */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-[#F1F5F9]">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl shadow-inner border border-blue-100/50">
                  ✏️
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1E293B] tracking-tight">Form Peminjaman</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Lengkapi data di bawah ini untuk membuat dokumen baru</p>
                </div>
              </div>

              {/* DATA PEMINJAM */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#1E293B] text-lg flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#30408D] rounded-full inline-block" />
                    Data Peminjam
                  </h3>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#334155] mb-2 block">
                    Pilih Peminjam <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedPeminjam}
                    onChange={(e) => setSelectedPeminjam(e.target.value)}
                    className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-[#1E293B] font-medium transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100 outline-none appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '18px' }}
                  >
                    <option value="">Pilih dari Master Peminjam</option>
                    {peminjams.map((peminjam) => (
                      <option key={peminjam.id_peminjam} value={peminjam.id_peminjam}>
                        {peminjam.nama_peminjam} ({peminjam.nrp})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DETAIL PEMINJAMAN */}
              <div className="space-y-6 pt-2">
                <h3 className="font-bold text-[#1E293B] text-lg flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#30408D] rounded-full inline-block" />
                  Detail Peminjaman
                </h3>

                {/* JADWAL PEMINJAMAN */}
                <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0]">
                  <h4 className="font-bold text-[#1E293B] mb-5 text-base flex items-center gap-2">
                    <span>📅</span> Jadwal Peminjaman
                  </h4>

                  {/* Tanggal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-2 block">
                        Tanggal Mulai <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4 font-medium text-[#1E293B] transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-2 block">
                        Tanggal Selesai <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4 font-medium text-[#1E293B] transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100 outline-none"
                      />
                    </div>
                  </div>

                  {/* Jam */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-2 block">
                        Jam Mulai <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4 font-medium text-[#1E293B] transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-2 block">
                        Jam Selesai <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4 font-medium text-[#1E293B] transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* TYPE SELECTOR TABS */}
                <div>
                  <label className="text-sm font-semibold text-[#334155] mb-2.5 block">
                    Tipe Peminjaman <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTipePeminjaman('lab')}
                      className={`rounded-2xl p-5 text-left border-2 transition-all duration-200 group relative overflow-hidden ${tipePeminjaman === 'lab'
                        ? 'border-[#5D7CEB] bg-blue-50/70 shadow-sm ring-2 ring-blue-100'
                        : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-bold text-base ${tipePeminjaman === 'lab' ? 'text-[#30408D]' : 'text-[#1E293B]'}`}>
                          Peminjaman Lab
                        </h4>
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${tipePeminjaman === 'lab' ? 'border-[#5D7CEB] bg-[#5D7CEB]' : 'border-[#CBD5E1]'}`}>
                          {tipePeminjaman === 'lab' && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B]">Satu ruangan laboratorium lengkap beserta fasilitasnya</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTipePeminjaman('item')}
                      className={`rounded-2xl p-5 text-left border-2 transition-all duration-200 group relative overflow-hidden ${tipePeminjaman === 'item'
                        ? 'border-[#5D7CEB] bg-blue-50/70 shadow-sm ring-2 ring-blue-100'
                        : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-bold text-base ${tipePeminjaman === 'item' ? 'text-[#30408D]' : 'text-[#1E293B]'}`}>
                          Peminjaman Item
                        </h4>
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${tipePeminjaman === 'item' ? 'border-[#5D7CEB] bg-[#5D7CEB]' : 'border-[#CBD5E1]'}`}>
                          {tipePeminjaman === 'item' && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B]">Pilih unit perangkat komputer atau komponen spesifik</p>
                    </button>
                  </div>
                </div>

                {/* CONDITIONAL SUBFORM: LAB */}
                {tipePeminjaman === 'lab' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] animated fadeIn">
                    <div>
                      <label className="text-sm font-semibold block mb-2 text-[#475569]">
                        Laboratorium <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedLab}
                        onChange={(e) => setSelectedLab(e.target.value)}
                        className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4 font-medium outline-none transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '18px' }}
                      >
                        <option value="">Pilih Lab</option>
                        <option value="L4">L4</option>
                        <option value="L3">L3</option>
                        <option value="L2">L2</option>
                        <option value="E4">E4</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold block mb-2 text-[#475569]">
                        Jumlah Peserta
                      </label>
                      <input
                        type="number"
                        value={totalUser}
                        onChange={(e) => setTotalUser(e.target.value)}
                        className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4 font-medium outline-none transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}

                {/* CONDITIONAL SUBFORM: ITEM */}
                {tipePeminjaman === 'item' && (
                  <div className="space-y-5 p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    {/* PC Selection */}
                    <div>
                      <label className="text-sm font-semibold block mb-2 text-[#475569]">
                        Pilih Unit PC
                      </label>
                      <div className="flex gap-3">
                        <select
                          value={selectedPC}
                          onChange={(e) => setSelectedPC(e.target.value)}
                          className="flex-1 h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4 font-medium outline-none transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
                          style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '18px' }}
                        >
                          <option value="">Pilih Unit PC</option>
                          {pcs.map((pc) => (
                            <option key={pc.pc_id} value={pc.pc_id}>
                              {pc.pc_code}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={addPCToList}
                          className="w-[52px] h-[52px] rounded-2xl bg-[#5D7CEB] hover:bg-[#4C6BE0] text-white flex items-center justify-center font-bold text-xl transition-all shadow-sm active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Component Selection */}
                    <div>
                      <label className="text-sm font-semibold block mb-2 text-[#475569]">
                        Pilih Komponen / Perangkat Pendukung
                      </label>
                      <div className="flex gap-3">
                        <select
                          value={selectedComponent}
                          onChange={(e) => setSelectedComponent(e.target.value)}
                          className="flex-1 h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4 font-medium outline-none transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
                          style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '18px' }}
                        >
                          <option value="">Pilih Komponen</option>
                          {components.map((component) => (
                            <option key={component.component_id} value={component.component_id}>
                              {component.component_name}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                          className="w-24 h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4 text-center font-semibold outline-none transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100"
                        />

                        <button
                          type="button"
                          onClick={addComponentToList}
                          className="w-[52px] h-[52px] rounded-2xl bg-[#5D7CEB] hover:bg-[#4C6BE0] text-white flex items-center justify-center font-bold text-xl transition-all shadow-sm active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* EVENT NAME (FOR LAB) */}
                {tipePeminjaman === 'lab' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155] block">
                      Nama Kegiatan / Agenda <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="Contoh: Praktikum Basis Data Lanjut / Seminar AI"
                      className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 font-medium outline-none transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                )}

                {/* PURPOSE TEXTAREA */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#334155] block">
                    Keperluan / Tujuan Peminjaman <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Tuliskan alasan peminjaman secara jelas dan rinci..."
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 resize-none font-medium outline-none transition-all focus:border-[#5D7CEB] focus:ring-4 focus:ring-blue-100 leading-relaxed"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="border-t border-[#E2E8F0] pt-6 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 h-[54px] rounded-2xl border border-[#CBD5E1] text-[#475569] font-bold hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-all active:scale-95">
                  Reset Form
                </button>

                <button
                  onClick={handleSubmit}
                  className="flex-1 h-[54px] rounded-2xl bg-[#5D7CEB] hover:bg-[#4C6BE0] text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>✈️</span> Buat Surat Dokumen
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: BASKET / SUMMARY PANEL */}
            <div className="space-y-6 xl:sticky xl:top-8">
              {tipePeminjaman === 'item' && (
                <div className="bg-white rounded-[2rem] border border-[#E2E8F0] shadow-sm p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <h3 className="font-bold text-[#1E293B] text-base flex items-center gap-2">
                      📦 Item Dipilih
                    </h3>
                    <span className="bg-blue-50 text-[#30408D] text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                      {selectedItems.length} Barang
                    </span>
                  </div>

                  {selectedItems.length === 0 ? (
                    <div className="text-center py-12 bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
                      <span className="text-3xl block mb-2 opacity-60">📥</span>
                      <p className="text-sm font-medium text-[#64748B]">Belum ada item dipilih</p>
                      <p className="text-xs text-[#94A3B8] mt-1">Gunakan form untuk menambahkan PC/Komponen</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                      {selectedItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-2xl p-4 border border-[#E2E8F0] transition-all duration-150 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm border ${item.item_type === 'PC' ? 'bg-indigo-50 border-indigo-100 text-[#30408D]' : 'bg-amber-50 border-amber-100 text-amber-700'
                              }`}>
                              {item.item_type === 'PC' ? '💻' : '🔌'}
                            </div>
                            <div>
                              <div className="font-bold text-[#1E293B] text-sm">{item.item_name}</div>
                              <div className="text-xs text-[#64748B] mt-0.5 font-medium">Tipe: {item.item_type}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-1 text-xs font-bold text-[#1E293B]">
                              x{item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="w-8 h-8 rounded-lg text-[#EF4444] hover:bg-red-50 flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                              title="Hapus item"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* LIVE PREVIEW CARD */}
              {/* LIVE PREVIEW CARD */}
              <div className="bg-white rounded-[2rem] p-6 text-[#1E293B] shadow-sm border border-[#E2E8F0] relative overflow-hidden">
                {/* Decorative subtle background shape */}
                <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-48 h-48 bg-[#5D7CEB]/5 rounded-full blur-2xl" />

                <h4 className="text-xs uppercase tracking-widest text-[#64748B] font-bold mb-4 flex items-center gap-2 relative z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ringkasan Dokumen Aktif
                </h4>

                <div className="space-y-4 text-sm relative z-10">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-2.5">
                    <div className="flex justify-between text-xs text-[#64748B] font-semibold">
                      <span>Peminjam:</span>
                      <span className="text-[#30408D] font-bold">
                        {selectedBorrower?.kategori || "-"}
                      </span>
                    </div>
                    <div className="text-base font-bold truncate text-[#30408D]">
                      {selectedBorrower?.nama_peminjam || "Belum Memilih Peminjam"}
                    </div>
                    {selectedBorrower?.nrp && (
                      <div className="text-xs text-[#64748B] font-medium">NRP: {selectedBorrower.nrp}</div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                      <div className="text-[11px] text-[#64748B] font-bold mb-1 uppercase tracking-wider">Tipe</div>
                      <div className="font-extrabold uppercase text-xs text-[#5D7CEB]">{tipePeminjaman}</div>
                    </div>
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                      <div className="text-[11px] text-[#64748B] font-bold mb-1 uppercase tracking-wider">Target Lokasi</div>
                      <div className="font-bold text-xs truncate text-[#1E293B]">
                        {tipePeminjaman === 'lab' ? (selectedLab || "-") : "Multi Perangkat"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}