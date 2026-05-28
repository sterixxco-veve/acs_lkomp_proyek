import React from 'react'

const recentLetters = [
  {
    id: 'SRT-2026-001',
    borrower: 'Dr. Budi Santoso',
    status: 'Approved',
    detail: 'Lab E4',
    date: '15/5/2026'
  },
  {
    id: 'SRT-2026-002',
    borrower: 'Ahmad Rizki',
    status: 'Approved',
    detail: '3 Items',
    date: '10/5/2026'
  }
]

export function SekretarisDashboard({ user }) {
  return (
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

          <button className="border border-red-300 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            🚪 Logout
          </button>
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

              <select className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-[#1E293B] outline-none">
                <option>Pilih dari Master Peminjam</option>
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

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="border-2 border-[#5D7CEB] bg-blue-50 rounded-2xl p-5 text-center">
                  <h4 className="font-bold text-[#5D7CEB]">Peminjaman Lab</h4>

                  <p className="text-sm text-[#64748B] mt-1">Satu laboratorium lengkap</p>
                </button>

                <button className="border border-[#CBD5E1] rounded-2xl p-5 text-center hover:border-[#5D7CEB] transition-all">
                  <h4 className="font-bold text-[#1E293B]">Peminjaman Item</h4>

                  <p className="text-sm text-[#64748B] mt-1">Pilih perangkat tertentu</p>
                </button>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                    Laboratorium *
                  </label>

                  <select className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4">
                    <option>Pilih Lab</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                    Jumlah Peserta
                  </label>

                  <input
                    type="number"
                    defaultValue={35}
                    className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4"
                  />
                </div>
              </div>

              {/* DATE */}
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                    📅 Tanggal Mulai *
                  </label>

                  <input
                    type="date"
                    className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                    📅 Tanggal Selesai *
                  </label>

                  <input
                    type="date"
                    className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4"
                  />
                </div>
              </div>

              {/* TIME */}
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                    ⏰ Jam Mulai *
                  </label>

                  <input
                    type="time"
                    className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                    ⏰ Jam Selesai *
                  </label>

                  <input
                    type="time"
                    className="w-full h-[52px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4"
                  />
                </div>
              </div>

              {/* TEXTAREA */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-[#1E293B] mb-2 block">
                  Keperluan / Tujuan *
                </label>

                <textarea
                  rows={5}
                  defaultValue="Praktikum Pemrograman Web - Kelas TI-3A"
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 resize-none"
                />
              </div>

              {/* BUTTON */}
              <div className="border-t border-[#E2E8F0] pt-5 flex gap-4">
                <button className="flex-1 h-[52px] rounded-2xl border border-[#CBD5E1] font-semibold hover:bg-slate-50 transition-all">
                  Reset Form
                </button>

                <button className="flex-1 h-[52px] rounded-2xl bg-[#5D7CEB] hover:bg-[#4C6BE0] text-white font-semibold transition-all">
                  ✈ Buat Surat
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* RECENT */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-[#1E293B]">Surat Terbaru</h2>

                <input
                  type="text"
                  placeholder="Search..."
                  className="w-[150px] h-[42px] rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm"
                />
              </div>

              <div className="space-y-4">
                {recentLetters.map((item) => (
                  <div key={item.id} className="border border-[#E2E8F0] rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-[#1E293B]">{item.id}</h3>

                        <p className="text-sm text-[#64748B]">{item.borrower}</p>
                      </div>

                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-xl text-xs font-semibold">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-[#64748B] mb-4">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-semibold">
                        {item.detail}
                      </span>

                      <span>•</span>

                      <span>{item.date}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="h-[42px] rounded-xl border border-[#CBD5E1] font-semibold hover:bg-slate-50 transition-all">
                        ✏ Edit
                      </button>

                      <button className="h-[42px] rounded-xl bg-[#5D7CEB] hover:bg-[#4C6BE0] text-white font-semibold transition-all">
                        ⬇ PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INFO */}
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                ℹ
              </div>

              <div>
                <h3 className="font-bold text-[#1E293B] mb-2">Informasi</h3>

                <p className="text-sm text-[#5B6B8C] leading-relaxed">
                  Surat peminjaman yang sudah dibuat dapat diunduh dalam format PDF. Pastikan semua
                  data terisi dengan benar sebelum submit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
