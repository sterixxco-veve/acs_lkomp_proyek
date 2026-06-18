import React, { useEffect, useState } from 'react'
import { PDFTemplate } from '../PDFTemplate'
import { useOutletContext } from 'react-router-dom'

export function SekretarisDashboard() {
  const {user} = useOutletContext()

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

      const peminjamanId =
        peminjaman.peminjaman_id

      for (const item of selectedItems) {
        await window.api.addDetailPeminjaman({
          peminjaman_id: peminjamanId,
          item_type: item.item_type,
          reference_id: item.reference_id,
          item_name: item.item_name,
          quantity: item.quantity
        })
      }

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

      const kategoriPeminjam =
        selectedBorrower?.kategori

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

      setTimeout(() => {
        window.print()
      }, 2000)
      alert('Surat berhasil disimpan')

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
      <div className="min-h-screen bg-[#F5F7FB]">
        {/* TOPBAR */}
        <div className="h-[70px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6">
          <button className="text-[#1E293B] text-xl">✕</button>

          <div className="flex items-center gap-5">
            <p className="text-sm text-[#64748B]">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>

          </div>
        </div>


        <div className="p-6">
          {/* HERO */}
          <div className="bg-gradient-to-r from-[#30408D] to-[#5D7CEB] rounded-3xl shadow-lg px-6 py-6 flex items-center gap-5 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
              📄
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white">Surat Peminjaman Laboratorium</h1>

              <p className="text-white/80 mt-1 text-lg">
                Form pengajuan surat peminjaman lab komputer
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_430px] gap-6">
            {/* LEFT */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6">
              {/* TITLE */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg">
                  📄
                </div>

                <h2 className="text-2xl font-bold text-[#1E293B]">Form Peminjaman</h2>
              </div>

              {/* DATA */}
              <div className="mb-8">
                <h3 className="font-bold text-[#1E293B] mb-5 text-lg">Data Peminjam</h3>

                <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                  Pilih Peminjam *
                </label>

                <select
                  value={selectedPeminjam}
                  onChange={(e) => setSelectedPeminjam(e.target.value)}
                  className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-[#1E293B] outline-none"
                >
                  <option value="">
                    Pilih dari Master Peminjam
                  </option>

                  {peminjams.map((peminjam) => (
                    <option
                      key={peminjam.id_peminjam}
                      value={peminjam.id_peminjam}
                    >
                      {peminjam.nama_peminjam} ({peminjam.nrp})
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-[#E2E8F0] my-8"></div>

              {/* DETAIL */}
              <div>
                <h3 className="font-bold text-[#1E293B] mb-5 text-lg">Detail Peminjaman</h3>

                {/* TYPE */}
                <label className="text-sm font-semibold text-[#1E293B] mb-3 block">
                  Tipe Peminjaman *
                </label>

                {/* JADWAL PEMINJAMAN */}
                <div className="bg-slate-50 rounded-2xl p-5 mb-6">
                  <h3 className="font-bold text-[#1E293B] mb-4 text-lg">
                    📅 Jadwal Peminjaman
                  </h3>

                  {/* Tanggal */}
                  <div className="grid grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                        Tanggal Mulai *
                      </label>

                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) =>
                          setStartDate(e.target.value)
                        }
                        className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                        Tanggal Selesai *
                      </label>

                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) =>
                          setEndDate(e.target.value)
                        }
                        className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4"
                      />
                    </div>
                  </div>

                  {/* Jam */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                        Jam Mulai *
                      </label>

                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) =>
                          setStartTime(e.target.value)
                        }
                        className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                        Jam Selesai *
                      </label>

                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) =>
                          setEndTime(e.target.value)
                        }
                        className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-white px-4"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setTipePeminjaman('lab')}
                    className={`rounded-2xl p-5 text-center border-2 transition-all ${tipePeminjaman === 'lab'
                      ? 'border-[#5D7CEB] bg-blue-50'
                      : 'border-[#CBD5E1]'
                      }`}
                  >
                    <h4
                      className={`font-bold ${tipePeminjaman === 'lab'
                        ? 'text-[#5D7CEB]'
                        : 'text-[#1E293B]'
                        }`}
                    >
                      Peminjaman Lab
                    </h4>

                    <p className="text-sm text-[#64748B] mt-1">
                      Satu laboratorium lengkap
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipePeminjaman('item')}
                    className={`rounded-2xl p-5 text-center border-2 transition-all ${tipePeminjaman === 'item'
                      ? 'border-[#5D7CEB] bg-blue-50'
                      : 'border-[#CBD5E1]'
                      }`}
                  >
                    <h4
                      className={`font-bold ${tipePeminjaman === 'item'
                        ? 'text-[#5D7CEB]'
                        : 'text-[#1E293B]'
                        }`}
                    >
                      Peminjaman Item
                    </h4>

                    <p className="text-sm text-[#64748B] mt-1">
                      Pilih perangkat tertentu
                    </p>
                  </button>
                </div>

                {tipePeminjaman === 'lab' && (
                  <>
                    {/* Laboratorium */}
                    <div className="grid grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="text-sm font-semibold block mb-2">
                          Laboratorium *
                        </label>

                        <select
                          value={selectedLab}
                          onChange={(e) =>
                            setSelectedLab(e.target.value)
                          }
                          className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4"
                        >
                          <option>Pilih Lab</option>
                          <option>L4</option>
                          <option>L3</option>
                          <option>L2</option>
                          <option>E4</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-semibold block mb-2">
                          Jumlah Peserta
                        </label>

                        <input
                          type="number"
                          value={totalUser}
                          onChange={(e) =>
                            setTotalUser(e.target.value)
                          }
                          className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4"
                        />
                      </div>
                    </div>
                  </>
                )}

                {tipePeminjaman === 'item' && (
                  <>
                    {/* PC */}
                    <div className="mb-5">
                      <label className="text-sm font-semibold block mb-2">
                        Pilih PC
                      </label>

                      <div className="flex gap-3">
                        <select
                          value={selectedPC}
                          onChange={(e) =>
                            setSelectedPC(e.target.value)
                          }
                          className="flex-1 h-[52px] rounded-2xl border border-[#E2E8F0] px-4"
                        >
                          <option value="">
                            Pilih PC
                          </option>

                          {pcs.map((pc) => (
                            <option
                              key={pc.pc_id}
                              value={pc.pc_id}
                            >
                              {pc.pc_code}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={addPCToList}
                          className="px-5 rounded-2xl bg-blue-500 text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* COMPONENT */}
                    <div className="mb-5">
                      <label className="text-sm font-semibold block mb-2">
                        Pilih Component
                      </label>

                      <div className="flex gap-3">
                        <select
                          value={selectedComponent}
                          onChange={(e) =>
                            setSelectedComponent(e.target.value)
                          }
                          className="flex-1 h-[52px] rounded-2xl border border-[#E2E8F0] px-4"
                        >
                          <option value="">
                            Pilih Component
                          </option>

                          {components.map((component) => (
                            <option
                              key={component.component_id}
                              value={component.component_id}
                            >
                              {component.component_name}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) =>
                            setQty(e.target.value)
                          }
                          className="w-24 h-[52px] rounded-2xl border border-[#E2E8F0] px-4"
                        />

                        <button
                          type="button"
                          onClick={addComponentToList}
                          className="px-5 rounded-2xl bg-blue-500 text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Keranjang */}
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <h3 className="font-bold mb-4">
                        Item Dipilih
                      </h3>

                      {selectedItems.length === 0 && (
                        <p className="text-slate-500">
                          Belum ada item dipilih
                        </p>
                      )}

                      {selectedItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white rounded-xl p-3 mb-2"
                        >
                          <div>
                            <div className="font-semibold">
                              {item.item_name}
                            </div>

                            <div className="text-sm text-slate-500">
                              Qty: {item.quantity}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(index)
                            }
                            className="text-red-500"
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}


                {tipePeminjaman === "lab" && (
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                      Nama Kegiatan *
                    </label>

                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) =>
                        setEventName(e.target.value)
                      }
                      placeholder="Contoh: Seminar AI 2026"
                      className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4"
                    />
                  </div>
                )}

                {/* TEXTAREA */}
                <div className="mb-8">
                  <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                    Keperluan / Tujuan *
                  </label>

                  <textarea
                    rows={5}
                    value={purpose}
                    onChange={(e) =>
                      setPurpose(e.target.value)
                    }
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 resize-none"
                  />
                </div>

                {/* BUTTON */}
                <div className="border-t border-[#E2E8F0] pt-5 flex gap-4">
                  <button className="flex-1 h-[52px] rounded-2xl border border-[#CBD5E1] font-semibold hover:bg-slate-50 transition-all">
                    Reset Form
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="flex-1 h-[52px] rounded-2xl bg-[#5D7CEB] hover:bg-[#4C6BE0] text-white font-semibold transition-all"
                  >
                    ✈ Buat Surat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
