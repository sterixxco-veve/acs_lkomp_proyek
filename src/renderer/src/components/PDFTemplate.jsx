import React from 'react'
import logoISTTS from '../../assets/logo_istts.png'
import logoLkomp from '../../assets/logo_lkomp.png'

export const PDFTemplate = ({ data }) => {
  if (!data) return null
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-"

    return new Date(dateTime).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }
  return (
    <div className="print-area hidden print:block print:absolute print:inset-0 print:z-[9999] print:bg-white">
      {/* CSS Injection tingkat tinggi untuk isolasi total halaman cetak */}
      <style>{`
        @media print {
          /* Sembunyikan SEMUA elemen root aplikasi di luar print-area */
          html, body {
            height: 100% !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
            font-family: 'Times New Roman', Times, serif !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #root, .min-h-screen {
            max-height: 100% !important;
            overflow: hidden !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            size: A4 portrait;
            margin: 12mm 15mm 12mm 15mm; /* Margin diperketat agar aman */
          }
          .pdf-container {
            width: 100% !important;
            max-height: 270mm !important; /* Batas tinggi mutlak A4 */
            box-sizing: border-box !important;
            display: block !important; /* Matikan flex untuk hindari bug chrome */
          }
          table {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Container Utama Dokumen */}
      <div className="pdf-container text-[12px] leading-normal text-black bg-white">
        {/* Kop Surat */}
        <div className="flex items-center border-b-[3px] border-double border-black pb-2 mb-3">
          <img src={logoISTTS} alt="Logo ISTTS" className="w-14 h-14 object-contain mr-4" />

          <div className="flex-1 text-center">
            <h1 className="text-[18px] font-bold leading-tight">Institut Sains dan Teknologi Terpadu Surabaya</h1>
            <p className="text-[10px] mt-0.5">Jl. Ngagel Jaya Tengah 73 - 77, Surabaya 60284, Indonesia</p>
            <p className="text-[10px]">Telp. (031) 5027920 Fax. (031) 5041509</p>
          </div>

          <img src={logoLkomp} alt="Logo Lkomp" className="w-14 h-14 object-contain ml-4" />
        </div>

        {/* Tanggal */}
        <div className="text-right mb-3">Surabaya, {data.created_date}</div>

        {/* Detail Surat */}
        <div className="mb-3">
          <table className="leading-normal text-[12px]">
            <tbody>
              <tr>
                <td className="pr-4 align-top">Nomor</td>
                <td className="pr-2 align-top">:</td>
                <td>{data.nomorSurat}</td>
              </tr>
              <tr>
                <td className="pr-4 align-top">Keperluan</td>
                <td className="pr-2 align-top">:</td>
                <td>{data.purpose}</td>
              </tr>
              <tr>
                <td className="pr-4 align-top">Lampiran</td>
                <td className="pr-2 align-top">:</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tujuan Surat */}
        <div className="mb-3 leading-tight">
          <p>Kepada Yth.</p>
          <p className="font-bold">Kepala Laboratorium</p>
          <p>Institut Sains dan Teknologi Terpadu Surabaya</p>
          <p>di tempat.</p>
        </div>

        {/* Pembuka */}
        <div className="mb-2">
          <p>Dengan Hormat,</p>
        </div>

        {data.tipe_peminjaman === "lab" ? (
          <p className="text-justify mb-3">
            Sehubungan dengan adanya kegiatan{" "}
            <strong>{data.event_name}</strong>{" "}
            dengan jumlah peserta{" "}
            <strong>{data.total_user}</strong>{" "}
            orang, kami mengajukan permohonan
            peminjaman laboratorium sebagai berikut:
          </p>
        ) : (
          <p className="text-justify mb-3">
            Dengan ini kami mengajukan permohonan
            peminjaman fasilitas sebagai berikut:
          </p>
        )}

        {/* Tabel Fasilitas */}
        <table className="w-full border-collapse border border-black mb-3 text-[11px]">
          <thead>
            <tr className="bg-gray-100/50">
              <th className="border border-black p-1 text-center font-bold">Nama Fasilitas</th>
              <th className="border border-black p-1 text-center font-bold w-[10%]">Jumlah</th>
              <th className="border border-black p-1 text-center font-bold w-[22%]">Waktu Mulai</th>
              <th className="border border-black p-1 text-center font-bold w-[22%]">Waktu Selesai</th>
              <th className="border border-black p-1 text-center font-bold w-[8%]">Revisi</th>
            </tr>
          </thead>

          <tbody>
            {(data.items || []).map((item, idx) => (
              <tr key={idx}>
                <td className="border border-black p-1 text-left">{item.item_name}</td>
                {/* LOGIC FIX: Jika tipe peminjaman adalah lab, paksa jumlahnya jadi 1 */}
                <td className="border border-black p-1 text-center">
                  {data.tipe_peminjaman === "lab" ? "1" : item.quantity}
                </td>
                <td className="border border-black p-1 text-center">
                  {formatDateTime(data.borrow_start)}
                </td>
                <td className="border border-black p-1 text-center">
                  {formatDateTime(data.borrow_end)}
                </td>
                <td className="border border-black p-1 text-center">{item.revision || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Keperluan */}
        <div className="mb-3">
          <table className="text-[12px]">
            <tbody>
              <tr>
                <td className="pr-4 align-top font-bold">Keperluan</td>
                <td className="pr-2 align-top">:</td>
                <td className="text-justify">{data.purpose}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Penutup */}
        <p className="text-justify mb-8">
          Demikian surat permohonan kami, atas perhatiannya kami ucapkan terima kasih.
        </p>

        {/* Bagian Tanda Tangan */}
        <div className="w-full text-[12px]">
          {data.kategori?.toLowerCase() === "mahasiswa" ? (
            <div className="flex justify-between">
              {/* KIRI */}
              <div className="w-[45%] text-center">
                <p>Menyetujui,</p>
                <div className="h-16"></div>
                <p className="font-bold underline">Grace Levina Dewi</p>
                <p className="text-[11px] text-gray-800">Koordinator Laboratorium Komputer</p>
              </div>

              {/* KANAN */}
              <div className="w-[45%] text-center">
                <p>Hormat kami,</p>
                <div className="h-16"></div>
                <p className="font-bold underline">{data.requester_name}</p>
                <p className="text-[11px] text-gray-800">Ketua Pelaksana {data.event_name}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <div className="w-[45%] text-center">
                <p>Mengetahui,</p>
                <div className="h-16"></div>
                <p className="font-bold underline">Grace Levina Dewi</p>
                <p className="text-[11px] text-gray-800">Koordinator Laboratorium Komputer</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}