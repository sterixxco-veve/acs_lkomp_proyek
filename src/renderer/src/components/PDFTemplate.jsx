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
    <div className="print-area hidden print:block">
      <style>{`body { font-family: times New Roman; color: black; }`}</style>
      {/* Container */}
      <div className="max-w-[800px] mx-auto">
        {/* Kop Surat */}
        <div className="flex items-center border-b-4 border-double border-black pb-4 mb-6">
          <img src={logoISTTS} alt="Logo" className="w-20 h-20 object-contain mr-5" />

          <div className="flex-1 text-center">
            <h1 className="text-[20px] font-bold">Institut Sains dan Teknologi Terpadu Surabaya</h1>

            <p className="text-[12px]">Jl. Ngagel Jaya Tengah 73 - 77, Surabaya 60284, Indonesia</p>

            <p className="text-[12px]">Telp. (031) 5027920 Fax. (031) 5041509</p>


          </div>
          <img src={logoLkomp} alt="Logo" className="w-20 h-20 object-contain mr-5" />

        </div>

        {/* Tanggal */}
        <div className="text-right mb-5">Surabaya, {data.created_date}</div>

        {/* Detail Surat */}
        <div className="mb-6">
          <table>
            <tbody>
              <tr>
                <td className="pr-4">Nomor</td>
                <td className="pr-2">:</td>
                <td>{data.nomorSurat}</td>
              </tr>
              <tr>
                <td className="pr-4">Keperluan</td>
                <td className="pr-2">:</td>
                <td>{data.purpose}</td>
              </tr>

              <tr>
                <td className="pr-4">Lampiran</td>
                <td className="pr-2">:</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tujuan Surat */}
        <div className="mb-6">
          <p>Kepada Yth.</p>

          <p className="font-bold">Kepala Laboratorium</p>

          <p>Institut Sains dan Teknologi Terpadu Surabaya</p>

          <p>di tempat.</p>
        </div>

        {/* Pembuka */}

        <div className="mb-4">
          <p>Dengan Hormat,</p>
        </div>

        {data.tipe_peminjaman === "lab" ? (
          <p className="text-justify mb-5">
            Sehubungan dengan adanya kegiatan{" "}
            <strong>{data.event_name}</strong>{" "}
            dengan jumlah peserta{" "}
            <strong>{data.total_user}</strong>{" "}
            orang, kami mengajukan permohonan
            peminjaman laboratorium sebagai berikut:
          </p>
        ) : (
          <p className="text-justify mb-5">
            Dengan ini kami mengajukan permohonan
            peminjaman fasilitas sebagai berikut:
          </p>
        )}

        {/* Tabel Fasilitas */}
        <table className="w-full border-collapse border border-black mb-5 text-[13px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 w-[45%]">Nama Fasilitas</th>

              <th className="border border-black p-2 w-[10%]">Jumlah</th>

              <th className="border border-black p-2 w-[20%]">Waktu Mulai</th>

              <th className="border border-black p-2 w-[20%]">Waktu Selesai</th>

              <th className="border border-black p-2 w-[5%]">Revisi</th>
            </tr>
          </thead>

          <tbody>
            {(data.items || []).map((item, idx) => (
              <tr key={idx}>
                <td className="border border-black p-2 text-left">{item.item_name}</td>

                <td className="border border-black p-2 text-center">{item.quantity}</td>

                <td className="border border-black p-2 text-center">
                  {formatDateTime(data.borrow_start)}
                </td>

                <td className="border border-black p-2 text-center">
                  {formatDateTime(data.borrow_end)}
                </td>

                <td className="border border-black p-2 text-center">{item.revision || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Keperluan */}
        <div className="mt-4 mb-6">
          <table>
            <tbody>
              <tr>
                <td className="pr-4">Keperluan</td>
                <td className="pr-2">:</td>
                <td>{data.purpose}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Penutup */}
        <p className="text-justify mt-5">
          Demikian surat permohonan kami, atas perhatiannya kami ucapkan terima kasih.
        </p>

        {/* Tanda Tangan */}

        {data.kategori?.toLowerCase() === "mahasiswa" ? (
          <div className="mt-16 flex justify-between">
            {/* KIRI */}
            <div className="w-[40%] text-center">
              <p>Menyetujui,</p>

              <div className="h-24"></div>

              <p className="font-bold underline">
                Grace Levina Dewi
              </p>

              <p>Koordinator Laboratorium Komputer</p>
            </div>

            {/* KANAN */}
            <div className="w-[40%] text-center">
              <p>Hormat kami,</p>

              <div className="h-24"></div>

              <p className="font-bold underline">
                {data.requester_name}
              </p>

              <p>Ketua Pelaksana {data.event_name}</p>
            </div>
          </div>
        ) : (
          <div className="mt-16 flex justify-end">
            <div className="w-[40%] text-center">
              <p>Mengetahui,</p>

              <div className="h-24"></div>

              <p className="font-bold underline">
                Grace Levina Dewi
              </p>

              <p>Koordinator Laboratorium Komputer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
