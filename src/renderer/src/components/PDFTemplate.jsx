import React from 'react'

export const PDFTemplate = ({ type, data }) => {
  if (!data) return null
  return (
    <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-16 font-serif text-black leading-relaxed">
      {/* Kop Surat */}
      <div className="text-center border-b-4 border-double border-black pb-4 mb-8">
        <h1 className="text-2xl font-bold uppercase">Laboratorium Komputer Engineering</h1>
        <p className="text-sm">Gedung Teknik Lt. 4 - Universitas Teknologi XYZ</p>
        <p className="text-sm italic">Sistem Informasi Inventaris Lkomp Hardware Overview</p>
      </div>

      {type === 'loan' ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-center underline mb-8">
            SURAT PEMINJAMAN HARDWARE
          </h2>
          <div className="space-y-2">
            <p>
              ID Transaksi: <strong>#{data.lending_id}</strong>
            </p>
            <p>Telah dilakukan peminjaman asset laboratorium kepada:</p>
          </div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="w-40 py-1">Nama Peminjam</td>
                <td>: {data.borrower_name}</td>
              </tr>
              <tr>
                <td className="py-1">Jabatan/Role</td>
                <td>: {data.borrower_role}</td>
              </tr>
              <tr>
                <td className="py-1">Nama Item</td>
                <td>: {data.item_name}</td>
              </tr>
              <tr>
                <td className="py-1">Tanggal Pinjam</td>
                <td>: {data.borrow_date}</td>
              </tr>
              <tr>
                <td className="py-1">Batas Kembali</td>
                <td>: {data.expected_return_date}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-12 grid grid-cols-2 text-center">
            <div>
              <p>Peminjam,</p>
              <div className="h-24"></div>
              <p className="font-bold underline">{data.borrower_name}</p>
            </div>
            <div>
              <p>Admin Lab,</p>
              <div className="h-24"></div>
              <p className="font-bold underline">Asisten Lab</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-center underline mb-8">
            LAPORAN REKAP PEMINJAMAN PERIODIK
          </h2>
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2">No</th>
                <th className="border border-black p-2">Peminjam</th>
                <th className="border border-black p-2">Item</th>
                <th className="border border-black p-2">Pinjam</th>
                <th className="border border-black p-2">Kembali</th>
                <th className="border border-black p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-black p-2 text-center">{idx + 1}</td>
                  <td className="border border-black p-2">{item.borrower_name}</td>
                  <td className="border border-black p-2">{item.item_name}</td>
                  <td className="border border-black p-2">{item.borrow_date}</td>
                  <td className="border border-black p-2">{item.expected_return_date}</td>
                  <td className="border border-black p-2 uppercase">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
