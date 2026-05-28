import React from 'react'

export const PDFTemplate = ({ data }) => {
  if (!data) return null

  return (
    <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-10 text-black font-serif text-[14px] leading-relaxed">
      {/* Container */}
      <div className="max-w-[800px] mx-auto">
        {/* Kop Surat */}
        <div className="flex items-center border-b-4 border-double border-black pb-4 mb-6">
          <img src="/logo_istts.png" alt="Logo" className="w-20 h-20 object-contain mr-5" />

          <div className="flex-1 text-center">
            <h1 className="text-[20px] font-bold">Institut Sains dan Teknologi Terpadu Surabaya</h1>

            <p className="text-[12px]">Jl. Ngagel Jaya Tengah 73 - 77, Surabaya 60284, Indonesia</p>

            <p className="text-[12px]">Telp. (031) 5027920 Fax. (031) 5041509</p>

            <p className="text-[12px]">Homepage : istts.ac.id | Web : simfas.istts.ac.id</p>
          </div>
        </div>

        {/* Tanggal */}
        <div className="text-right mb-5">Surabaya, {data.created_date}</div>

        {/* Detail Surat */}
        <div className="mb-6">
          <table>
            <tbody>
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

        <p className="text-justify mb-5">
          Sehubungan dengan adanya kegiatan <strong>{data.event_name}</strong> dan jumlah pengguna
          dari dalam ISTTS berjumlah <strong>{data.total_user}</strong> orang, kami mengajukan
          permohonan peminjaman fasilitas sebagai berikut:
        </p>

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
            {data.items?.map((item, idx) => (
              <tr key={idx}>
                <td className="border border-black p-2 text-left">{item.item_name}</td>

                <td className="border border-black p-2 text-center">{item.quantity}</td>

                <td className="border border-black p-2 text-center">{item.start_time}</td>

                <td className="border border-black p-2 text-center">{item.end_time}</td>

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
        <div className="mt-16 flex justify-between">
          {/* Kiri */}
          <div className="w-[40%] text-center">
            <p>Menyetujui,</p>

            <div className="h-24"></div>

            <p className="font-bold underline">{data.approver_name}</p>

            <p>{data.approver_position}</p>
          </div>

          {/* Kanan */}
          <div className="w-[40%] text-center">
            <p>Hormat kami,</p>

            <div className="h-24"></div>

            <p className="font-bold underline">{data.requester_name}</p>

            <p>{data.requester_position}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
